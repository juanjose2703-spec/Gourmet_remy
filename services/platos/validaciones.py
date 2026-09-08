"""
Traducción de validaciones.php
Genera códigos únicos para platos y menús según las reglas de negocio.
"""
from datetime import datetime

def generarCodigoPlato(categoria: int, conn) -> str:
    """
    Genera un código único para un nuevo plato según su categoría.
    Estructura: PL + primeras 2 letras de la categoría + número incremental (001-999).
    Categorías:
    1 = Entrada   (PLEN)
    2 = Plato Fuerte (PLFU)
    3 = Postre    (PLPO)
    4 = Bebida    (PLBE)
    """
    mapCategorias = {
        1: 'EN',
        2: 'FU',
        3: 'PO',
        4: 'BE'
    }

    if categoria not in mapCategorias:
        raise Exception("Categoría inválida.")

    prefijo = "PL" + mapCategorias[categoria]

    # Buscar el último código existente en la BD para esa categoría
    sql = "SELECT id_plato FROM Platos WHERE id_plato LIKE %s ORDER BY id_plato DESC LIMIT 1"
    cursor = conn.cursor()
    cursor.execute(sql, (prefijo + "%",))
    resultado = cursor.fetchone()
    cursor.close()

    if resultado:
        # Extraer el número y sumarle 1
        ultimoCodigo = resultado[0]
        numero = int(ultimoCodigo[-3:])
        nuevoNumero = str(numero + 1).zfill(3)
    else:
        # Si no existe ninguno, empezar en 001
        nuevoNumero = "001"

    return prefijo + nuevoNumero


def generarCodigoMenu(conn) -> str:
    """
    Genera un código único secuencial global para la tabla de menús (varchar 16).
    Estructura: MN + fecha actual (AAMMDD) + - + número incremental global de 3 cifras.
    Ejemplo: MN260804-000, MN260804-001, MN260804-002...
    """
    # Fecha del día actual en formato AAMMDD
    fechaSimple = datetime.now().strftime("%y%m%d")
    prefijoBase = "MN" + fechaSimple + "-"

    # Buscar el último menú creado en toda la tabla
    sql = "SELECT id_menu FROM Menu WHERE id_menu LIKE 'MN%' ORDER BY id_menu DESC LIMIT 1"
    cursor = conn.cursor()
    cursor.execute(sql)
    resultado = cursor.fetchone()
    cursor.close()

    if resultado:
        ultimoCodigo = resultado[0]
        # El formato es MNymd-XXX. Las últimas 3 cifras empiezan en la posición 9
        ultimoNumero = int(ultimoCodigo[9:])
        nuevoNumero = ultimoNumero + 1
    else:
        nuevoNumero = 0

    secuencialFormateado = str(nuevoNumero).zfill(3)

    return prefijoBase + secuencialFormateado
