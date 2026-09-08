"""
Traducción de consultarMenuId.php
Busca un menú por su id_menu con sus platos anidados.
"""
from dbremy import conn
import json

def consultarMenuId(id_menu: str):
    if not id_menu:
        return json.dumps({"error": "No se proporcionó id_menu"}, ensure_ascii=False)

    sql = """
        SELECT m.*, p.id_plato, p.nombre AS plato_nombre, p.categoria,
               p.descripcion AS plato_descripcion, p.img_plato
        FROM Menu m
        LEFT JOIN Contiene c ON m.id_menu = c.id_menu
        LEFT JOIN Platos p ON c.id_plato = p.id_plato
        WHERE m.id_menu = %s
    """
    cursor = conn.cursor()
    cursor.execute(sql, (id_menu,))
    resultado = cursor.fetchall()
    columnas = [col[0] for col in cursor.description]
    cursor.close()

    menuData = None

    if resultado:
        for row in resultado:
            fila = dict(zip(columnas, row))

            # Inicializar la estructura del menú solo una vez
            if menuData is None:
                menuData = {
                    "id_menu":        fila["id_menu"],
                    "nombre":         fila["nombre"],
                    "tiempos_menu":   int(fila["tiempos_menu"]) if fila["tiempos_menu"] else 0,
                    "precio":         int(fila["precio"]) if fila["precio"] else 0,
                    "descripcion":    fila["descripcion"],
                    "estado":         fila["estado"],
                    "fecha_creacion": str(fila["fecha_creacion"]) if fila["fecha_creacion"] else None,
                    "platos":         []
                }

            # Inyectar los platos asociados
            if fila["id_plato"] is not None:
                menuData["platos"].append({
                    "id_plato":    fila["id_plato"],
                    "nombre":      fila["plato_nombre"],
                    "categoria":   int(fila["categoria"]) if fila["categoria"] else None,
                    "descripcion": fila["plato_descripcion"],
                    "img_plato":   fila["img_plato"]
                })

        return json.dumps(menuData, ensure_ascii=False, default=str)
    else:
        return json.dumps(None)
