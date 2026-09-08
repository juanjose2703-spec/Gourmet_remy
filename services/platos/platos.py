from conexion import *

class Platos:
    def listar(self):
        sql = "SELECT * FROM Platos ORDER BY CASE WHEN estado='Activo' THEN 0 ELSE 1 END"
        mi_cursor.execute(sql)
        resultado = mi_cursor.fetchall()
        return resultado
    def consultar(self, id):
        sql = f"SELECT * FROM Platos WHERE id_plato='{id}'"
        mi_cursor.execute(sql)
        resultado = mi_cursor.fetchall()
        return resultado
    def agregar(self, id, nombre, categoria, descripcion, img_plato, fecha_creacion, estado):
        sql = f"INSERT INTO Platos (id_plato,nombre,categoria,descripcion,img_plato,fecha_creacion,estado) VALUES ('{id}','{nombre}',{categoria},'{descripcion}','{img_plato}','{fecha_creacion}','{estado}')"
        mi_cursor.execute(sql)
        mi_db.commit()
    def modificar(self, id, nombre, categoria, descripcion, img_plato, fecha_creacion, estado):
        sql = f"UPDATE Platos SET nombre='{nombre}', categoria={categoria}, descripcion='{descripcion}', img_plato='{img_plato}', fecha_creacion='{fecha_creacion}', estado='{estado}' WHERE id_plato='{id}'"
        mi_cursor.execute(sql)
        mi_db.commit()
        return self.consultar(id)
    def desactivar(self, id):
        sql = f"UPDATE Platos SET estado='Inactivo' WHERE id_plato='{id}'"
        mi_cursor.execute(sql)
        mi_db.commit()

mis_platos = Platos()