from datetime import timedelta
import bcrypt
import jwt
from fastapi import APIRouter, Header, HTTPException
from auth import password_utils
from auth.auth_utils import create_access_token
from database import db_conn
from database.models import Login, Register
from config import ACCESS_TOKEN_EXPIRE_HOURS, SECRET_KEY, ALGORITHM

router = APIRouter(tags=["Auth"])
conn = db_conn.get_connection()

@router.post("/login")
def login_user(item: Login, remember_me: bool = False):
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT password, name, surname FROM users WHERE email = %s;", (item.email,))
        user = cursor.fetchone()

        if not user:
            raise HTTPException(status_code=400, detail="User not exists")

        hashed_password = user[0]
        user_name = user[1]
        user_surname = user[2]

        if not bcrypt.checkpw(item.password.encode('utf-8'), hashed_password.encode('utf-8')):
            raise HTTPException(status_code=400, detail="Incorrect Password")

        access_token_expires = timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
        access_token = create_access_token(
            data={"sub": item.email, "type": "access"},
            expires_delta=access_token_expires
        )
        response = {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "email": item.email,
                "name": user_name,
                "surname": user_surname
            }
        }

        if remember_me:
            refresh_token_expires = None
            refresh_token = create_access_token(
                data={"sub": item.email, "type": "refresh"},
                expires_delta=refresh_token_expires
            )

            response["refresh_token"] = refresh_token
            cursor.execute("UPDATE users SET refresh_token = %s WHERE email = %s", (refresh_token, item.email))
            conn.commit()

        return response

    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Server error: {e}")
    finally:
        cursor.close()

@router.post("/register")
def register_user(item: Register):
    cursor = conn.cursor()
    try:
        if (item.password != item.password_confirm):
            raise HTTPException(
                status_code=400,
                detail="Passwords do not match."
            )

        check_query = "SELECT email FROM users WHERE email = %s;"
        cursor.execute(check_query, (item.email,))

        existing_user = cursor.fetchone()

        if existing_user:
            raise HTTPException(
                status_code=400,
                detail=f"User with email address: '{item.email}' already exists, try another one."
            )

        password_utils.check_password(item.password)

        hashed_password = password_utils.hash_password(item.password)

        insert_query = "INSERT INTO users (name, surname, email, date_birth, password) VALUES (%s, %s, %s, %s, %s)"
        values = (item.name, item.surname, item.email, item.date_birth, hashed_password)

        cursor.execute(insert_query, values)
        conn.commit()

    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"A server error occurred during registration: {e}")
    finally:
        cursor.close()
    pass


@router.post("/logout")
def logout_user(authorization: str = Header(None)):
    if not authorization:
        print("Brak nagłówka Authorization")  # DEBUG
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.replace("Bearer ", "")
    print(f"Otrzymany token: {token}")  # DEBUG

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"Token poprawnie zdekodowany: {payload}")  # DEBUG
        email: str = payload.get("sub")

        if not email:
            print("Brak email (sub) w tokenie")  # DEBUG
            raise HTTPException(status_code=401, detail="Invalid token payload")

        print(f"Użytkownik z tokena: {email}")
    except jwt.ExpiredSignatureError:
        print("Token wygasł")  # DEBUG
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError as e:
        print(f"Token nieprawidłowy: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")

    cursor = conn.cursor()
    try:
        update_query = "UPDATE users SET refresh_token = NULL WHERE email = %s"
        cursor.execute(update_query, (email,))
        conn.commit()

        return {"message": "Successfully logged out and refresh token revoked."}

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Server error during logout: {e}")
    finally:
        cursor.close()