"""
Traducción de obtenerIngredientes.php
Lista todos los ingredientes disponibles.
"""
from dbremy import conn
import json

def obtenerIngredientes() -> str:
    sql = """
        SELECT
            id_ingrediente,
            categoria,
            nombre,
            stock,
            unidad_minima AS unidad,
            stock_minimo
        FROM Ingredientes
    """
    cursor = conn.cursor()
    cursor.execute(sql)
    resultado = cursor.fetchall()
    cursor.close()

    ingredientes = []
    if resultado:
        for row in resultado:
            ingredientes.append({
                "id_ingrediente": row[0],
                "categoria":      row[1],
                "nombre":         row[2],
                "stock":          int(row[3]) if row[3] else 0,
                "unidad":         row[4],
                "stock_minimo":   int(row[5]) if row[5] else 0
            })

    return json.dumps(ingredientes, ensure_ascii=False)
