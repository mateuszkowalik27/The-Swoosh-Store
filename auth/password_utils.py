import bcrypt
from fastapi import HTTPException
from database import db_conn

conn = db_conn.get_connection()

def hash_password(password: str) -> str:
    password_bytes = password.encode('utf-8')

    salt = bcrypt.gensalt()
    hashed_password_bytes = bcrypt.hashpw(password_bytes, salt)

    return hashed_password_bytes.decode('utf-8')

def check_password(password: str):
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT password FROM users")
        hashed_passwords_from_db = [row[0] for row in cursor.fetchall()]

        for hashed in hashed_passwords_from_db:
            if bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8')):
                raise HTTPException(
                    status_code=400,
                    detail="This password already exists, try another one."
                )
    finally:
        cursor.close()