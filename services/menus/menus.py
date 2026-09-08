from conexion import *

class Menus:
    def listar(self):
        sql = "SELECT * FROM Menu ORDER BY CASE WHEN estado='Activo' THEN 0 ELSE 1 END"
        mi_cursor.execute(sql)
        resultado = mi_cursor.fetchall()
        return resultado
    def consultar(self, id):
        sql = f"SELECT * FROM Menu WHERE id_menu='{id}'"
        mi_cursor.execute(sql)
        resultado = mi_cursor.fetchall()
        return resultado
    def agregar(self, id, nombre, tiempos_menu, precio, descripcion, estado, fecha_creacion):
        sql = f"INSERT INTO Menu (id_menu,nombre,tiempos_menu,precio,descripcion,estado,fecha_creacion) VALUES ('{id}','{nombre}',{tiempos_menu},{precio},'{descripcion}','{estado}','{fecha_creacion}')"
        mi_cursor.execute(sql)
        mi_db.commit()
    def modificar(self, id, nombre, tiempos_menu, precio, descripcion, estado, fecha_creacion):
        sql = f"UPDATE Menu SET nombre='{nombre}', tiempos_menu={tiempos_menu}, precio={precio}, descripcion='{descripcion}', estado='{estado}', fecha_creacion='{fecha_creacion}' WHERE id_menu='{id}'"
        mi_cursor.execute(sql)
        mi_db.commit()
        return self.consultar(id)
    def desactivar(self, id):
        sql = f"UPDATE Menu SET estado='Inactivo' WHERE id_menu='{id}'"
        mi_cursor.execute(sql)
        mi_db.commit()

mis_menus = Menus()