"""
Traducción de consultarPlatosId.php
Busca un plato por su id_plato.
"""
from dbremy import conn, cursor
import json

def consultarPlatosId(id_plato: str):
    if not id_plato:
        return json.dumps({"error": "No se proporcionó id_plato"}, ensure_ascii=False)

    sql = "SELECT * FROM Platos WHERE id_plato = %s"
    cursor.execute(sql, (id_plato,))
    columnas = [col[0] for col in cursor.description]
    resultado = cursor.fetchone()

    if resultado:
        plato = dict(zip(columnas, resultado))
        # Convertir categoría a entero para compatibilidad con Android
        if 'categoria' in plato:
            plato['categoria'] = int(plato['categoria'])
        return json.dumps(plato, ensure_ascii=False, default=str)
    else:
        return json.dumps(None)
