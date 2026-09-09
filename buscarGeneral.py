"""
Búsqueda unificada en Platos, Menús e Ingredientes usando UNION ALL.
"""
from dbremy import conn
import json

def buscarGeneral(q: str) -> str:
    q = q.strip() if q else ""
    
    # Si q tiene texto, se aplica el filtro LIKE; si no, se consulta todo.
    if q:
        search = f"%{q}%"
        sql = """
            SELECT 
                p.id_plato AS id_registro,
                p.nombre AS nombre,
                p.descripcion AS descripcion,
                p.img_plato AS img_registro,
                p.fecha_creacion AS fecha_creacion,
                'Plato' AS tipo
            FROM Platos p
            LEFT JOIN Categorias_Platos cp ON p.categoria = cp.id_categoria
            WHERE p.estado = 'Activo' AND (
                p.nombre LIKE %s
                OR cp.nombre LIKE %s
                OR 'Plato' LIKE %s
            )

            UNION ALL

            SELECT
                m.id_menu AS id_registro,
                m.nombre AS nombre,
                m.descripcion AS descripcion,
                (
                    SELECT p2.img_plato
                    FROM Contiene c
                    JOIN Platos p2 ON c.id_plato = p2.id_plato
                    WHERE c.id_menu = m.id_menu AND p2.categoria = 2 AND p2.estado = 'Activo'
                    LIMIT 1
                ) AS img_registro,
                m.fecha_creacion AS fecha_creacion,
                'Menú' AS tipo
            FROM Menu m
            WHERE m.estado = 'Activo' AND (
                m.nombre LIKE %s
                OR 'Menú' LIKE %s
            )

            UNION ALL

            SELECT
                id_ingrediente AS id_registro,
                nombre AS nombre,
                CONCAT('El ingrediente cuenta con un stock actual de ', stock, ' ', unidad_minima, '.') AS descripcion,
                NULL AS img_registro,
                NULL AS fecha_creacion,
                'Ingrediente' AS tipo
            FROM Ingredientes
            WHERE nombre LIKE %s
            OR 'Ingrediente' LIKE %s

            ORDER BY nombre ASC
        """
        params = (search, search, search, search, search, search, search)
    else:
        # Consulta para traer TODOS los resultados disponibles
        sql = """
            SELECT 
                p.id_plato AS id_registro,
                p.nombre AS nombre,
                p.descripcion AS descripcion,
                p.img_plato AS img_registro,
                p.fecha_creacion AS fecha_creacion,
                'Plato' AS tipo
            FROM Platos p
            WHERE p.estado = 'Activo'

            UNION ALL

            SELECT
                m.id_menu AS id_registro,
                m.nombre AS nombre,
                m.descripcion AS descripcion,
                (
                    SELECT p2.img_plato
                    FROM Contiene c
                    JOIN Platos p2 ON c.id_plato = p2.id_plato
                    WHERE c.id_menu = m.id_menu AND p2.categoria = 2 AND p2.estado = 'Activo'
                    LIMIT 1
                ) AS img_registro,
                m.fecha_creacion AS fecha_creacion,
                'Menú' AS tipo
            FROM Menu m
            WHERE m.estado = 'Activo'

            UNION ALL

            SELECT
                id_ingrediente AS id_registro,
                nombre AS nombre,
                CONCAT('El ingrediente cuenta con un stock actual de ', stock, ' ', unidad_minima, '.') AS descripcion,
                NULL AS img_registro,
                NULL AS fecha_creacion,
                'Ingrediente' AS tipo
            FROM Ingredientes

            ORDER BY nombre ASC
        """
        params = ()

    cursor = conn.cursor()
    cursor.execute(sql, params)
    columnas = [col[0] for col in cursor.description]
    resultado = cursor.fetchall()
    cursor.close()

    resultados = []
    for row in resultado:
        fila = dict(zip(columnas, row))
        resultados.append({
            "id_registro":    fila["id_registro"],
            "nombre":         fila["nombre"],
            "descripcion":    fila["descripcion"],
            "img_registro":   fila["img_registro"],
            "fecha_creacion": str(fila["fecha_creacion"]) if fila["fecha_creacion"] else None,
            "tipo":           fila["tipo"]
        })

    return json.dumps(resultados, ensure_ascii=False)