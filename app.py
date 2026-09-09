import os
from flask import Flask, render_template, request
from flask_cors import CORS
from buscarGeneral import buscarGeneral

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

programa = Flask(
    __name__,
    template_folder=os.path.join(BASE_DIR, 'services', 'templates'),
    static_folder=os.path.join(BASE_DIR, 'services', 'static')
)
CORS(programa)

@programa.route('/')
def index():
    return render_template('platos_menu.html')

@programa.route('/platos_menu')
def platos_menu():
    return render_template('platos_menu.html')

@programa.route('/busqueda')
def busqueda():
    return render_template('busqueda.html')

@programa.route('/detalle_plato/<id_plato>')
def detalle_plato(id_plato):
    return render_template('detalle_plato.html')

@programa.route('/buscar')
def buscar():
    q = request.args.get('q', '')
    resultado = buscarGeneral(q)
    return programa.response_class(response=resultado, status=200, mimetype='application/json')

if __name__ == '__main__':
    programa.run(host='0.0.0.0', debug=True, port=5000)