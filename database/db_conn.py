import psycopg2

def get_connection():
    conn = psycopg2.connect(
        host="localhost",
        user="admin",
        password="1qaz@WSX",
        dbname="shop",
        port=5432
    )
    return conn