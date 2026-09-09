from flask import Flask, render_template
from flask_cors import CORS

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

if __name__ == '__main__':
    programa.run(host='0.0.0.0', debug=True, port=5000)