from cryptography.fernet import Fernet
import os

# File to store the encryption key
KEY_FILE = 'secret.key'

# Load existing key or generate a new one
if os.path.exists(KEY_FILE):
    with open(KEY_FILE, 'rb') as file:
        SECRET_KEY = file.read()
else:
    SECRET_KEY = Fernet.generate_key()
    with open(KEY_FILE, 'wb') as file:
        file.write(SECRET_KEY)

cipher = Fernet(SECRET_KEY)

def encrypt_data(data: str) -> str:
    return cipher.encrypt(data.encode()).decode()

def decrypt_data(data: str) -> str:
    return cipher.decrypt(data.encode()).decode()
