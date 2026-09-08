import mysql.connector

servername = "localhost"
username = "remy"
password = "12345"
dbname = "remy"

conn = mysql.connector.connect(
    host=servername,
    user=username,
    password=password,
    database=dbname
)

cursor = conn.cursor()
