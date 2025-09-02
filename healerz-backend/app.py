from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv

from encryption import encrypt_data, decrypt_data
from models import Prediction, PatientSummary, DoctorNote, Prescription
from database import db
import model

app = Flask(__name__)
CORS(app)

# Load environment variables
load_dotenv()

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///healerz.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

users = []
prediction_history = []

# ---------------- Email Function ----------------
def send_email(to_email, message):
    EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
    EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

    if not EMAIL_ADDRESS or not EMAIL_PASSWORD:
        raise ValueError("Email credentials not set in environment variables")

    msg = EmailMessage()
    msg.set_content(message)
    msg['Subject'] = 'Your Prescription from HealerZ'
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = to_email

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
        smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        smtp.send_message(msg)

# ---------------- AUTH ----------------
@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    encrypted_user = {
        'name': encrypt_data(data['name']),
        'email': encrypt_data(data['email']),
        'password': encrypt_data(data['password']),
        'role': data['role'],
        'disease': data.get('disease')
    }
    users.append(encrypted_user)
    return jsonify({'status': 'success', 'message': 'Registration successful'}), 201

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    for user in users:
        if decrypt_data(user['email']) == data['email'] and decrypt_data(user['password']) == data['password']:
            return jsonify({
                'status': 'success',
                'message': 'Login successful',
                'role': user['role']
            }), 200
    return jsonify({'status': 'fail', 'message': 'Invalid credentials'}), 401

# ---------------- PREDICTION ----------------
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    disease = data.get('disease')
    patient_data = data.get('data')

    if not disease or not patient_data:
        return jsonify({'status': 'fail', 'message': 'Missing input data'}), 400

    try:
        if disease == 'stroke':
            prediction = model.predict_stroke(patient_data)

        elif disease == 'heartDisease':
            input_data = [[
                float(patient_data['age']),
                int(patient_data['sex']),
                int(patient_data['cp']),
                int(patient_data['fbs']),
                float(patient_data['oldpeak']),
                int(patient_data['ca'])
            ]]
            prediction = model.predict_heart_disease(input_data)

        elif disease == 'breastCancer':
            prediction = "Stage 2"
        elif disease == 'lungCancer':
            prediction = "Stage 3"
        else:
            return jsonify({'status': 'fail', 'message': 'Invalid disease type'}), 400

        prediction_record = {
            'email': data.get('email'),
            'disease': disease,
            'input_data': patient_data,
            'result': prediction,
            'timestamp': datetime.now().isoformat()
        }
        prediction_history.append(prediction_record)

        return jsonify({'status': 'success', 'prediction': prediction}), 200

    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

# New: Save Prediction to DB
@app.route('/savePrediction', methods=['POST'])
def save_prediction():
    data = request.get_json()
    try:
        new_prediction = Prediction(
            email=data['email'],
            disease=data['disease'],
            data=str(data['data']),
            result=data['result'],
            timestamp=datetime.utcnow()
        )
        db.session.add(new_prediction)
        db.session.commit()
        return jsonify({'message': 'Prediction saved successfully'}), 201
    except Exception as e:
        print("Error saving prediction:", e)
        return jsonify({'error': 'Failed to save prediction'}), 500

# ---------------- DOCTOR ROUTES ----------------
@app.route('/doctor/patient/<email>', methods=['GET'])
def get_patient_predictions(email):
    try:
        cleaned_email = email.strip().lower()
        print(f"Fetching predictions for email: {cleaned_email}")

        predictions = Prediction.query.filter_by(email=cleaned_email).all()
        print(f"Found {len(predictions)} predictions")

        data = [
            {
                'disease': p.disease,
                'data': p.data,
                'result': p.result,
                'timestamp': p.timestamp
            } for p in predictions
        ]
        return jsonify({'predictions': data}), 200
    except Exception as e:
        print(f"Error fetching patient predictions: {e}")
        return jsonify({'message': 'Failed to fetch patient predictions', 'error': str(e)}), 500


@app.route('/doctor/addNote', methods=['POST'])
def add_note():
    data = request.get_json()
    email = data.get('email')
    note = data.get('note')
    if not email or note is None:
        return jsonify({'error': 'Email and note required'}), 400
    new_note = DoctorNote(email=email, note=note)
    db.session.add(new_note)
    db.session.commit()
    return jsonify({'message': 'Note saved successfully'}), 200

@app.route('/doctor/savePrescription', methods=['POST'])
def save_prescription():
    data = request.get_json()
    patient_id = data.get('patient_id')
    prescription = data.get('prescription')
    prescription_entry = Prescription.query.filter_by(patient_id=patient_id).first()
    if prescription_entry:
        prescription_entry.content = prescription
    else:
        new_prescription = Prescription(patient_id=patient_id, content=prescription)
        db.session.add(new_prescription)
    db.session.commit()
    return jsonify({'message': 'Prescription saved successfully'}), 200

@app.route('/doctor/getPrescriptions', methods=['GET'])
def get_prescriptions():
    try:
        prescriptions = Prescription.query.all()
        prescription_data = {
            p.patient_id: p.content for p in prescriptions
        }
        return jsonify(prescription_data), 200
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

@app.route('/doctor/sendPrescription', methods=['POST'])
def send_prescription_email():
    data = request.get_json()
    patient_email = data.get('patient_email')
    message = data.get('message')

    if not patient_email or not message:
        return jsonify({'error': 'Missing patient email or message'}), 400

    try:
        send_email(patient_email, message)
        return jsonify({"success": "Prescription sent successfully!"}), 200
    except Exception as e:
        print(f"Email error: {e}")
        return jsonify({"error": "Failed to send prescription"}), 500

# ---------------- PATIENT ROUTES ----------------
@app.route('/patients', methods=['GET'])
def get_all_patients():
    patient_users = [
        {
            'name': decrypt_data(user['name']),
            'email': decrypt_data(user['email']),
            'disease': user.get('disease', 'N/A')
        }
        for user in users if user['role'] == 'patient'
    ]
    return jsonify({'patients': patient_users}), 200

@app.route('/savePatientSummary', methods=['POST'])
def save_patient_summary():
    data = request.get_json()
    required_fields = ['name', 'age', 'bloodGroup']
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    new_summary = PatientSummary(
        name=data['name'],
        age=data['age'],
        blood_group=data['bloodGroup'],
        internal_disease=data.get('internalDisease', ''),
        external_disease=data.get('externalDisease', '')
    )
    db.session.add(new_summary)
    db.session.commit()
    return jsonify({"message": "Patient summary saved successfully"}), 201


@app.route('/getPatientSummaries', methods=['GET'])
def get_patient_summaries():
    try:
        summaries = PatientSummary.query.all()
        prescriptions = {str(p.patient_id): p.content for p in Prescription.query.all()}

        result = []
        for s in summaries:
            result.append({
                'id': s.id,
                'name': s.name,
                'age': s.age,
                'bloodGroup': s.blood_group,
                'internalDisease': s.internal_disease,
                'externalDisease': s.external_disease,
                'prescription': prescriptions.get(str(s.id), '')  # 🔁 Fixed this line
            })

        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": "Error fetching patient summaries"}), 500


@app.route('/deletePatientSummary/<int:patient_id>', methods=['DELETE'])
def delete_patient_summary(patient_id):
    try:
        patient = PatientSummary.query.get(patient_id)
        if patient:
            db.session.delete(patient)
            db.session.commit()
            return jsonify({'message': 'Patient summary deleted successfully'}), 200
        else:
            return jsonify({'error': 'Patient not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@app.route('/doctor/history/<email>', methods=['GET'])
def get_patient_history(email):
    note = get_note_for_email(email)
    if note:
        return jsonify({"note": note}), 200
    return jsonify({"message": "No history"}), 404
def get_note_for_email(email):
    note_entry = DoctorNote.query.filter_by(email=email).order_by(DoctorNote.id.desc()).first()
    if note_entry:
        return note_entry.note
    return None


# ---------------- ROOT ----------------
@app.route('/')
def home():
    return "Welcome to the HealerZ API!"

# ---------------- MAIN ----------------
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, port=5001)
