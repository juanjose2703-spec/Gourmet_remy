"""
Traducción de consultarMenu.php
Lista todos los menús con sus platos anidados (JOIN con contiene).
"""
from dbremy import conn
import json

def consultarMenu():
    sql = """
        SELECT m.*, p.id_plato, p.nombre AS plato_nombre, p.categoria,
               p.descripcion AS plato_descripcion, p.img_plato
        FROM Menu m
        LEFT JOIN Contiene c ON m.id_menu = c.id_menu
        LEFT JOIN Platos p ON c.id_plato = p.id_plato
    """
    cursor = conn.cursor()
    cursor.execute(sql)
    resultado = cursor.fetchall()
    columnas = [col[0] for col in cursor.description]
    cursor.close()

    menus = {}

    if resultado:
        for row in resultado:
            fila = dict(zip(columnas, row))
            id_menu = fila["id_menu"]

            # Si el menú no ha sido mapeado, inicializar su estructura
            if id_menu not in menus:
                menus[id_menu] = {
                    "id_menu":       id_menu,
                    "nombre":        fila["nombre"],
                    "tiempos_menu":  int(fila["tiempos_menu"]) if fila["tiempos_menu"] else 0,
                    "precio":        int(fila["precio"]) if fila["precio"] else 0,
                    "descripcion":   fila["descripcion"],
                    "estado":        fila["estado"],
                    "fecha_creacion": str(fila["fecha_creacion"]) if fila["fecha_creacion"] else None,
                    "platos":        []
                }

            # Si el registro contiene un plato asociado, inyectarlo
            if fila["id_plato"] is not None:
                menus[id_menu]["platos"].append({
                    "id_plato":    fila["id_plato"],
                    "nombre":      fila["plato_nombre"],
                    "categoria":   int(fila["categoria"]) if fila["categoria"] else None,
                    "descripcion": fila["plato_descripcion"],
                    "img_plato":   fila["img_plato"]
                })

        return json.dumps(list(menus.values()), ensure_ascii=False, default=str)
    else:
        return json.dumps({"message": "0 resultados"}, ensure_ascii=False)
