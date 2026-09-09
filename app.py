import os
from flask import Flask, render_template, request, send_from_directory
from flask_cors import CORS
from buscarGeneral import buscarGeneral

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

programa = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, 'services', 'templates'),
    static_folder=os.path.join(BASE_DIR, 'services', 'static')
)
CORS(programa)

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

if __name__ == '__main__':
    programa.run(host='0.0.0.0', debug=True, port=5000)