from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Prediction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), nullable=False)
    disease = db.Column(db.String(100), nullable=False)
    data = db.Column(db.Text, nullable=False)  # stores input data as a string
    result = db.Column(db.String(100), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False)



