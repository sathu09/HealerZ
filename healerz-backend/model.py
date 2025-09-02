import os
import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# Features for heart disease
HEART_FEATURES = ['age', 'sex', 'cp','fbs', 'oldpeak', 'ca']
HEART_TARGET = 'num'

# Features for stroke prediction
STROKE_FEATURES = ['hypertension', 'heart_disease', 'ever_married', 'work_type', 'Residence_type', 'avg_glucose_level', 'smoking_status']
STROKE_TARGET = 'stroke'

# ------ HEART DISEASE --------

def load_heart_disease_data():
    data = pd.read_csv('data/heart.csv')
    if 'Unnamed: 0' in data.columns:
        data = data.drop(columns=['Unnamed: 0'])

    if data['sex'].dtype == 'object':
        data['sex'] = data['sex'].map({'Male': 1, 'Female': 0})

    le = LabelEncoder()
    data['cp'] = le.fit_transform(data['cp'])
    data = data.dropna()

    X = data[HEART_FEATURES]
    y = (data[HEART_TARGET] > 0).astype(int)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    return X_train_scaled, X_test_scaled, y_train, y_test, scaler

def train_heart_disease_model():
    X_train, X_test, y_train, y_test, scaler = load_heart_disease_data()
    model = LogisticRegression(max_iter=1000)
    model.fit(X_train, y_train)
    joblib.dump(model, 'heart_disease_model.pkl')
    joblib.dump(scaler, 'heart_disease_scaler.pkl')
    return model, scaler

def load_heart_disease_model():
    if not os.path.exists('heart_disease_model.pkl'):
        return train_heart_disease_model()
    return joblib.load('heart_disease_model.pkl'), joblib.load('heart_disease_scaler.pkl')

def predict_heart_disease(data):
    model, scaler = load_heart_disease_model()
    input_df = pd.DataFrame([data[0]], columns=HEART_FEATURES)
    input_scaled = scaler.transform(input_df)
    prediction = model.predict(input_scaled)[0]
    return "Stage 1 - Mild risk of Heart Disease better to chanal a doctor" if prediction else "Stage 0 - No risk of Heart Disease you can enjoy yourself"

#---------- STROKE -------

def load_stroke_data():
    data = pd.read_csv('data/strokedata.csv')

    # Encode categorical fields
    data['ever_married'] = data['ever_married'].map({'Yes': 1, 'No': 0})
    data['Residence_type'] = data['Residence_type'].map({'Urban': 1, 'Rural': 0})

    work_type_le = LabelEncoder()
    smoking_le = LabelEncoder()

    data['work_type'] = work_type_le.fit_transform(data['work_type'])
    data['smoking_status'] = smoking_le.fit_transform(data['smoking_status'])

    data = data.dropna()

    X = data[STROKE_FEATURES]
    y = data[STROKE_TARGET]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    return X_train_scaled, X_test_scaled, y_train, y_test, scaler, work_type_le, smoking_le

def train_stroke_model():
    X_train, X_test, y_train, y_test, scaler, work_type_le, smoking_le = load_stroke_data()
    model = LogisticRegression(max_iter=1000)
    model.fit(X_train, y_train)
    joblib.dump(model, 'stroke_model.pkl')
    joblib.dump(scaler, 'stroke_scaler.pkl')
    joblib.dump(work_type_le, 'stroke_work_type_encoder.pkl')
    joblib.dump(smoking_le, 'stroke_smoking_encoder.pkl')
    return model, scaler, work_type_le, smoking_le

def load_stroke_model():
    if not os.path.exists('stroke_model.pkl'):
        return train_stroke_model()
    return (
        joblib.load('stroke_model.pkl'),
        joblib.load('stroke_scaler.pkl'),
        joblib.load('stroke_work_type_encoder.pkl'),
        joblib.load('stroke_smoking_encoder.pkl')
    )

def predict_stroke(input_data):
    try:
        print("Stroke Input Received:", input_data)

        # Load the trained model and scaler
        model, scaler, _, _ = load_stroke_model()

        # Convert input to DataFrame
        input_df = pd.DataFrame([input_data], columns=STROKE_FEATURES)
        print("Input DataFrame:\n", input_df)

        # Scale the input
        input_scaled = scaler.transform(input_df)
        print("Scaled Input:\n", input_scaled)

        # Make prediction
        prediction = model.predict(input_scaled)[0]
        print("Prediction result:", prediction)

        return "Stage 2 - High risk of Stroke Please Consult the Doctor" if prediction == 1 else "Stage 0 - No risk of Stroke feel free"

    except Exception as e:
        print("Error in stroke prediction:", str(e))
        raise

