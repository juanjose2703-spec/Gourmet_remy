"""
Traducción de insertarPlatos.php
Inserta un plato nuevo y su relación con ingredientes en plato_ingrediente.
"""
from dbremy import conn
from validaciones import generarCodigoPlato
from datetime import datetime
import json

def insertarPlatos(data: dict) -> str:
    response = {}

    try:
        if "plato" not in data or "ingredientes" not in data:
            raise Exception("Datos incompletos o formato JSON no esperado.")

        plato = data["plato"]

        campos = ["nombre", "categoria", "descripcion", "estado"]
        if not all(campo in plato for campo in campos):
            raise Exception("Campos internos del plato incompletos.")

        nombre      = plato["nombre"]
        categoria   = int(plato["categoria"])
        descripcion = plato["descripcion"]
        img_plato   = plato.get("img_plato", "")
        estado      = plato["estado"]

        # Generar id_plato automático según la categoría
        id_plato = generarCodigoPlato(categoria, conn)

        fecha_creacion = datetime.now().strftime("%Y-%m-%d")

        # 1. Insertar el plato principal
        cursor = conn.cursor()
        sql = "INSERT INTO Platos (id_plato, nombre, categoria, descripcion, img_plato, estado, fecha_creacion) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        cursor.execute(sql, (id_plato, nombre, categoria, descripcion, img_plato, estado, fecha_creacion))
        conn.commit()

        # 2. Insertar relación con ingredientes en plato_ingrediente
        ingredientes = data["ingredientes"]
        sql_rel = "INSERT INTO Plato_Ingrediente (id_plato, id_ingrediente, cantidad) VALUES (%s, %s, %s)"

        for ing in ingredientes:
            id_ingrediente = ing.get("id_ingrediente", "")
            cantidad = int(ing.get("cantidad", 0))

            if id_ingrediente and cantidad > 0:
                cursor.execute(sql_rel, (id_plato, id_ingrediente, cantidad))

        conn.commit()
        cursor.close()

        response["status"] = "success"
        response["message"] = "Plato creado exitosamente"
        response["id_plato_generado"] = id_plato
        response["fecha_creacion"] = datetime.now().strftime("%d/%m/%Y")

    except Exception as e:
        response["status"] = "error"
        response["message"] = str(e)

    return json.dumps(response, ensure_ascii=False)
