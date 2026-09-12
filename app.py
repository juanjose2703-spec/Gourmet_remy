import os
from datetime import datetime
from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
from PIL import Image
import mysql.connector
import requests as req
from buscarGeneral import buscarGeneral

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

IMG_REMY_DIR = r'C:\MAMP\htdocs\img_remy'
PLATS_IMG_DIR = os.path.join(IMG_REMY_DIR, 'platos')

programa = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, 'services', 'templates'),
    static_folder=os.path.join(BASE_DIR, 'services', 'static')
)
CORS(programa)

DB_CONFIG = {
    'host': 'localhost',
    'user': 'remy',
    'password': '12345',
    'database': 'remy',
    'port': 3306
}

def get_db_connection():
    return mysql.connector.connect(**DB_CONFIG)

MAPA_CATEGORIAS = {
    1: 'EN',
    2: 'FU',
    3: 'PO',
    4: 'BE'
}

NOMBRES_A_ID_CATEGORIA = {
    'entrada': 1,
    'plato fuerte': 2,
    'postre': 3,
    'bebida': 4
}

def generar_codigo_plato(id_categoria, conn):
    if id_categoria not in MAPA_CATEGORIAS:
        raise ValueError("Categoría inválida.")
    
    prefijo = f"PL{MAPA_CATEGORIAS[id_categoria]}"
    cursor = conn.cursor(dictionary=True)
    
    query = "SELECT id_plato FROM platos WHERE id_plato LIKE %s ORDER BY id_plato DESC LIMIT 1"
    cursor.execute(query, (f"{prefijo}%",))
    resultado = cursor.fetchone()
    cursor.close()

    if resultado:
        ultimo_codigo = resultado['id_plato']
        numero = int(ultimo_codigo[-3:])
        nuevo_numero = str(numero + 1).zfill(3)
    else:
        nuevo_numero = "001"

    return f"{prefijo}{nuevo_numero}"

def guardar_imagen_png(file_storage, id_plato, directorio_destino):
    if not os.path.exists(directorio_destino):
        os.makedirs(directorio_destino, exist_ok=True)

    nombre_archivo = f"{id_plato}.png"
    ruta_final = os.path.join(directorio_destino, nombre_archivo)

    imagen = Image.open(file_storage)
    if imagen.mode != 'RGBA':
        imagen = imagen.convert('RGBA')
        
    imagen.save(ruta_final, format='PNG', optimize=True)
    return nombre_archivo

@programa.route('/img_remy/<path:filename>')
def obtener_imagen_local(filename):
    return send_from_directory(IMG_REMY_DIR, filename)

@programa.route('/menus/static/<path:filename>')
def menus_static(filename):
    return send_from_directory(
        os.path.join(BASE_DIR, 'services', 'templates', 'menus', 'static'),
        filename
    )

@programa.route('/platos/static/<path:filename>')
def platos_static(filename):
    return send_from_directory(
        os.path.join(BASE_DIR, 'services', 'templates', 'platos', 'static'),
        filename
    )

@programa.route('/')
def index():
    return render_template('platos_menu.html')

@programa.route('/platos_menu')
def platos_menu():
    return render_template('platos_menu.html')

@programa.route('/crear_plato')
def crear_plato():
    return render_template('platos/templates/crear_plato.html')

@programa.route('/modificar_plato/<id_plato>')
def modificar_plato(id_plato):
    return render_template('platos/templates/modificar_plato.html')

@programa.route('/busqueda')
def busqueda():
    return render_template('busqueda.html')

@programa.route('/detalle_plato/<id_plato>')
def detalle_plato(id_plato):
    return render_template('platos/templates/detalle_plato.html')

@programa.route('/detalle_menu/<id_menu>')
def detalle_menu(id_menu):
    return render_template('menus/templates/detalle_menu.html')

@programa.route('/crear_menu')
def crear_menu():
    return render_template('menus/templates/crear_menu.html')

@programa.route('/modificar_menu/<id_menu>')
def modificar_menu(id_menu):
    return render_template('menus/templates/modificar_menu.html')

@programa.route('/buscar')
def buscar():
    q = request.args.get('q', '')
    resultado = buscarGeneral(q)
    return programa.response_class(response=resultado, status=200, mimetype='application/json')

@programa.route('/api/ingredientes', methods=['GET'])
def obtener_ingredientes():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id_ingrediente, nombre FROM ingredientes ORDER BY nombre ASC")
        ingredientes = cursor.fetchall()
        cursor.close()
        return jsonify(ingredientes), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn and conn.is_connected():
            conn.close()

@programa.route('/api/platos', methods=['GET'])
def proxy_platos():
    r = req.get('http://localhost:5085/platos')
    return programa.response_class(response=r.text, status=r.status_code, mimetype='application/json')

@programa.route('/api/platos/insertar', methods=['POST'])
def insertar_plato():
    conn = None
    try:
        nombre = request.form.get('nombre', '').strip()
        categoria_raw = request.form.get('categoria', '').strip()
        descripcion = request.form.get('descripcion', '').strip()
        estado = request.form.get('estado', 'Activo')
        ingredientes_ids = request.form.getlist('ingredientes[]')

        if categoria_raw.isdigit():
            id_categoria = int(categoria_raw)
        else:
            id_categoria = NOMBRES_A_ID_CATEGORIA.get(categoria_raw.lower(), 0)

        if not nombre or id_categoria == 0 or not descripcion:
            return jsonify({"status": "error", "message": "Datos incompletos o categoría no válida."}), 400

        conn = get_db_connection()

        try:
            id_plato = generar_codigo_plato(id_categoria, conn)
        except ValueError as e:
            return jsonify({"status": "error", "message": str(e)}), 400

        nombre_imagen_guardada = ""
        if 'imagen' in request.files and request.files['imagen'].filename != '':
            archivo_imagen = request.files['imagen']
            nombre_imagen_guardada = guardar_imagen_png(archivo_imagen, id_plato, PLATS_IMG_DIR)

        fecha_creacion = datetime.now().strftime('%Y-%m-%d')

        cursor = conn.cursor()
        query_plato = """
            INSERT INTO platos (id_plato, nombre, categoria, descripcion, img_plato, estado, fecha_creacion)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query_plato, (id_plato, nombre, id_categoria, descripcion, nombre_imagen_guardada, estado, fecha_creacion))

        if ingredientes_ids:
            ingredientes_validos = [ing.strip() for ing in ingredientes_ids if ing and ing.strip()]
            if ingredientes_validos:
                query_ing = "INSERT INTO plato_ingrediente (id_plato, id_ingrediente, cantidad) VALUES (%s, %s, %s)"
                datos_ingredientes = [(id_plato, id_ing, 1) for id_ing in ingredientes_validos]
                cursor.executemany(query_ing, datos_ingredientes)

        conn.commit()
        cursor.close()

        return jsonify({
            "status": "success",
            "message": "Plato e imagen guardados exitosamente",
            "id_plato_generado": id_plato,
            "img_plato": nombre_imagen_guardada
        }), 201

    except Exception as e:
        if conn and conn.is_connected():
            conn.rollback()
        return jsonify({"status": "error", "message": f"Error en el servidor: {str(e)}"}), 500

    finally:
        if conn and conn.is_connected():
            conn.close()

    
@programa.route('/api/menus')
def proxy_menus():
    r = req.get('http://localhost:5084/menus')
    return programa.response_class(response=r.text, status=r.status_code, mimetype='application/json')

@programa.route('/api/menus/<id_menu>')
def proxy_menu_id(id_menu):
    r = req.get(f'http://localhost:5084/menus/{id_menu}')
    return programa.response_class(response=r.text, status=r.status_code, mimetype='application/json')

if __name__ == '__main__':
    programa.run(host='0.0.0.0', debug=True, port=5000)