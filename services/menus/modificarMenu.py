"""
Traducción de modificarMenu.php
Modifica un menú existente. Usa transacción para garantizar consistencia.
Borra y reinsertar los platos en contiene.
"""
from dbremy import conn
import json

def modificarMenu(data: dict) -> str:
    response = {}

    try:
        menuData = data.get("menu", data)

        if not menuData.get("descripcion"):
            raise Exception("El menú debe tener al menos una descripción.")
        if not menuData.get("nombre"):
            raise Exception("El nombre del menú es un campo obligatorio.")
        if int(menuData.get("precio")) <= 0:
            raise Exception("El menú debe tener un valor.")

        platos = data.get("platos", menuData.get("platos", None))

        if not isinstance(platos, list) or len(platos) == 0:
            raise Exception("El menú debe tener al menos un plato.")

        id_menu = menuData["id_menu"].strip()
        nombre  = menuData["nombre"].strip()
        tiempos = len(platos)
        precio  = int(menuData.get("precio", 0))
        desc    = menuData.get("descripcion", "").strip()
        estado  = menuData.get("estado", "Activo")

        cursor = conn.cursor()

        try:
            conn.start_transaction()
        except:
            conn.rollback()
            conn.start_transaction()

        sql = "UPDATE Menu SET nombre=%s, tiempos_menu=%s, precio=%s, descripcion=%s, estado=%s WHERE id_menu=%s"
        cursor.execute(sql, (nombre, tiempos, precio, desc, estado, id_menu))

        cursor.execute("DELETE FROM Contiene WHERE id_menu = %s", (id_menu,))

        sql_cont = "INSERT INTO Contiene (id_menu, id_plato) VALUES (%s, %s)"
        for plato in platos:
            id_plato = plato.get("id_plato") if isinstance(plato, dict) else plato
            if id_plato:
                cursor.execute(sql_cont, (id_menu, id_plato))

        conn.commit()
        cursor.close()

        response["status"] = "success"
        response["message"] = f"Menú '{nombre}' actualizado con éxito"
        response["id_menu"] = id_menu
        response["tiempos_menu"] = tiempos

    except Exception as e:
        conn.rollback()
        response["status"] = "error"
        response["message"] = str(e)

    return json.dumps(response, ensure_ascii=False)