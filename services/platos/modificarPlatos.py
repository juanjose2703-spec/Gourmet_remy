"""
Traducción de modificarPlatos.php
Modifica un plato existente. Si cambia de categoría, regenera el id_plato.
Actualiza también los ingredientes en plato_ingrediente.
"""
from dbremy import conn
from validaciones import generarCodigoPlato
import json

def modificarPlatos(data: dict) -> str:
    response = {"status": "error", "message": "Error desconocido"}

    try:
        if "plato" not in data or "ingredientes" not in data:
            raise Exception("Faltan datos de plato o ingredientes en el JSON.")

        plato = data["plato"]
        id_plato    = plato["id_plato"]
        nombre      = plato["nombre"]
        categoria   = int(plato["categoria"])
        descripcion = plato["descripcion"]
        img_plato   = plato["img_plato"]
        estado      = plato["estado"]

        cursor = conn.cursor()

        # 1. Consultar la categoría actual del plato
        cursor.execute("SELECT categoria FROM Platos WHERE id_plato = %s", (id_plato,))
        resultado = cursor.fetchone()
        categoriaActual = int(resultado[0]) if resultado else None

        id_final = id_plato

        # Si cambió la categoría, regenerar el ID
        if categoriaActual and categoriaActual != categoria:
            id_final = generarCodigoPlato(categoria, conn)

        # 2. Borrar ingredientes viejos del plato actual
        cursor.execute("DELETE FROM Plato_Ingrediente WHERE id_plato = %s", (id_plato,))

        # 3. Actualizar los datos del plato (incluyendo posible nuevo ID)
        sql = "UPDATE Platos SET id_plato=%s, nombre=%s, categoria=%s, descripcion=%s, img_plato=%s, estado=%s WHERE id_plato=%s"
        cursor.execute(sql, (id_final, nombre, categoria, descripcion, img_plato, estado, id_plato))

        # 4. Insertar los nuevos ingredientes enlazados al id_final
        ingredientes = data["ingredientes"]
        sql_rel = "INSERT INTO Plato_Ingrediente (id_plato, id_ingrediente, cantidad) VALUES (%s, %s, %s)"

        for ing in ingredientes:
            id_ingrediente = ing.get("id_ingrediente", "").strip()
            cantidad = int(ing.get("cantidad", 1))
            if cantidad <= 0:
                cantidad = 1
            if id_ingrediente:
                cursor.execute(sql_rel, (id_final, id_ingrediente, cantidad))

        conn.commit()
        cursor.close()

        response["status"] = "success"
        response["message"] = "Plato modificado exitosamente"
        response["nuevo_id"] = id_final

    except Exception as e:
        response["status"] = "error"
        response["message"] = "Error detectado: " + str(e)

    return json.dumps(response, ensure_ascii=False)
