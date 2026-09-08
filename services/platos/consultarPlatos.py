"""
Traducción de consultarPlatos.php
Lista todos los platos de la base de datos.
"""
from dbremy import conn, cursor
import json

def consultarPlatos():
    sql = "SELECT * FROM Platos"
    cursor.execute(sql)
    columnas = [col[0] for col in cursor.description]
    resultado = cursor.fetchall()

    if resultado:
        response = [dict(zip(columnas, fila)) for fila in resultado]
    else:
        response = {"message": "0 resultados"}

    return json.dumps(response, ensure_ascii=False, default=str)
