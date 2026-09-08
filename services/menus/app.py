from conexion import *
from menus import mis_menus
from consultarMenu import consultarMenu
from consultarMenuId import consultarMenuId
from insertarMenu import insertarMenu
from modificarMenu import modificarMenu

programa = Flask(__name__)
api = Api(programa)

class ListaMenus(Resource):
    def get(self):
        resultado = consultarMenu()
        return programa.response_class(response=resultado,status=200,mimetype='application/json')
    def post(self):
        data = request.json
        resultado = insertarMenu(data)
        return programa.response_class(response=resultado,status=200,mimetype='application/json')

class Menu(Resource):
    def get(self,id_menu):
        resultado = consultarMenuId(id_menu)
        return programa.response_class(response=resultado,status=200,mimetype='application/json')
    def put(self,id_menu):
        data = request.json
        if "menu" in data:
            data["menu"]["id_menu"] = id_menu
        else:
            data["id_menu"] = id_menu
        resultado = modificarMenu(data)
        return programa.response_class(response=resultado,status=200,mimetype='application/json')
    def delete(self,id_menu):
        resultado = mis_menus.consultar(id_menu)
        if len(resultado)==0:
            return jsonify({"mensaje":"Menu no existe"})
        else:
            mis_menus.desactivar(id_menu)
            return jsonify({"mensaje":"Menu desactivado con éxito!"})

api.add_resource(ListaMenus, "/menus")
api.add_resource(Menu,"/menus/<id_menu>")

if __name__=="__main__":
    programa.run(host="0.0.0.0",debug=True,port=5084)