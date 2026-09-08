"""
Traducción de consultarIngrediente.php
Trae los ingredientes de un plato específico desde plato_ingrediente.
"""
from dbremy import conn
import json

def consultarIngrediente(id_plato: str) -> str:
    if not id_plato:
        return json.dumps([])

    sql = """
        SELECT
            i.id_ingrediente,
            i.nombre,
            i.stock AS stock_general,
            pi.cantidad AS cantidad_receta,
            i.unidad_minima AS unidad
        FROM Plato_Ingrediente pi
        INNER JOIN Ingredientes i ON pi.id_ingrediente = i.id_ingrediente
        WHERE pi.id_plato = %s
    """
    cursor = conn.cursor()
    cursor.execute(sql, (id_plato,))
    resultado = cursor.fetchall()
    cursor.close()

    ingredientes = []
    for row in resultado:
        ingredientes.append({
            "id_ingrediente": row[0],
            "nombre":         row[1],
            "stock":          int(row[2]),
            "cantidad":       int(row[3]),
            "unidad":         row[4]
        })

    return json.dumps(ingredientes, ensure_ascii=False)
