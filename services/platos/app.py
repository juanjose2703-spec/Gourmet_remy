from conexion import *
from platos import mis_platos
from consultarPlatos import consultarPlatos
from consultarPlatosId import consultarPlatosId
from insertarPlatos import insertarPlatos
from modificarPlatos import modificarPlatos
from consultarIngrediente import consultarIngrediente

programa = Flask(__name__)
api = Api(programa)

class ListaPlatos(Resource):
    def get(self):
        resultado = consultarPlatos()
        return programa.response_class(response=resultado,status=200,mimetype='application/json')
    def post(self):
        data = request.json
        resultado = insertarPlatos(data)
        return programa.response_class(response=resultado,status=200,mimetype='application/json')

class Plato(Resource):
    def get(self,id_plato):
        resultado = consultarPlatosId(id_plato)
        return programa.response_class(response=resultado,status=200,mimetype='application/json')
    def put(self,id_plato):
        data = request.json
        resultado = modificarPlatos(data)
        return programa.response_class(response=resultado,status=200,mimetype='application/json')
    def delete(self,id_plato):
        resultado = mis_platos.consultar(id_plato)
        if len(resultado)==0:
            return jsonify({"mensaje":"Plato no existe"})
        else:
            mis_platos.desactivar(id_plato)
            return jsonify({"mensaje":"Plato desactivado con éxito!"})

class PlatoIngredientes(Resource):
    def get(self,id_plato):
        resultado = consultarIngrediente(id_plato)
        return programa.response_class(response=resultado,status=200,mimetype='application/json')

api.add_resource(ListaPlatos, "/platos")
api.add_resource(Plato,"/platos/<id_plato>")
api.add_resource(PlatoIngredientes,"/platos/<id_plato>/ingredientes")

if __name__=="__main__":
    programa.run(host="0.0.0.0",debug=True,port=5085)