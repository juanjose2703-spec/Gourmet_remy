from flask import Flask, render_template, request
from flask_cors import CORS
from buscarGeneral import buscarGeneral

programa = Flask(__name__)
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

@programa.route('/buscar')
def buscar():
    q = request.args.get('q', '')
    resultado = buscarGeneral(q)
    return programa.response_class(response=resultado, status=200, mimetype='application/json')

if __name__ == '__main__':
    programa.run(host='0.0.0.0', debug=True, port=5000)