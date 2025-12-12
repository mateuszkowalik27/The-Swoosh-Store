from fastapi import APIRouter, HTTPException, Header
import jwt
from database import db_conn
from config import SECRET_KEY, ALGORITHM
router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

conn = db_conn.get_connection()

@router.get("/me")
def read_users_me(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

    cursor = conn.cursor()
    try:
        cursor.execute("SELECT name, surname FROM users WHERE email = %s;", (email,))
        user = cursor.fetchone()
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")

        return {"name": user[0], "surname": user[1]}
    finally:
        cursor.close()
