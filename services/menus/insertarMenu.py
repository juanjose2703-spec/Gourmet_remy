"""
Traducción de insertarMenu.php
Inserta un menú nuevo y su relación de platos en la tabla contiene.
"""
from dbremy import conn
from validaciones import generarCodigoMenu
from datetime import datetime
import json

def insertarMenu(data: dict) -> str:
    response = {}

    try:
        menuData = data.get("menu", data)

        if not menuData.get("nombre"):
            raise Exception("El nombre del menú es un campo obligatorio.")

        platos = data.get("platos", menuData.get("platos", None))

        if not isinstance(platos, list) or len(platos) == 0:
            raise Exception("El menú debe tener al menos un plato.")

        id_menu = generarCodigoMenu(conn)
        nombre  = menuData["nombre"].strip()
        tiempos = len(platos)
        precio  = int(menuData.get("precio", 0))
        desc    = menuData.get("descripcion", "").strip()
        estado  = menuData.get("estado", "Activo")
        fecha   = datetime.now().strftime("%Y-%m-%d")

        cursor = conn.cursor()

        sql = "INSERT INTO Menu (id_menu, nombre, tiempos_menu, precio, descripcion, estado, fecha_creacion) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        cursor.execute(sql, (id_menu, nombre, tiempos, precio, desc, estado, fecha))
        conn.commit()

        sql_cont = "INSERT INTO Contiene (id_menu, id_plato) VALUES (%s, %s)"
        for plato in platos:
            id_plato = plato.get("id_plato") if isinstance(plato, dict) else plato
            if id_plato:
                cursor.execute(sql_cont, (id_menu, id_plato))
        conn.commit()

        cursor.close()

        response["status"] = "success"
        response["message"] = f"Menú '{nombre}' guardado con éxito"
        response["id_menu_generado"] = id_menu
        response["tiempos_menu"] = tiempos

    except Exception as e:
        response["status"] = "error"
        response["message"] = str(e)

    return json.dumps(response, ensure_ascii=False)