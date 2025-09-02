from flask_sqlalchemy import SQLAlchemy
from database import db
from datetime import datetime 

class Prediction(db.Model):
    __tablename__ = 'prediction'
    __table_args__ = {'extend_existing': True}

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    disease = db.Column(db.String(100), nullable=False)
    data = db.Column(db.Text, nullable=False)
    result = db.Column(db.String(100), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)

class PatientSummary(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    blood_group = db.Column(db.String(10), nullable=False)
    internal_disease = db.Column(db.String(100), nullable=True)
    external_disease = db.Column(db.String(100), nullable=True)
    

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    encrypted_data = db.Column(db.LargeBinary, nullable=False)



class DoctorNote(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    note = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

class Prescription(db.Model):
    __tablename__ = 'prescription'

    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, db.ForeignKey('patient_summary.id'), nullable=False)
    content = db.Column(db.String(500), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)




    def __repr__(self):
        return f'<Prescription {self.id}>'