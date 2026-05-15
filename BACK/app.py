from flask import Flask,jsonify,request
from flask_cors import CORS
from database import obtener_conexion

app = Flask(__name__)
CORS(app) # esto da la comunicacion del front con el back

# RUTA PARA OBTENER LAS TAREAS

@app.route('/tareas', methods=['GET'])
def listar_tareas():
    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor(dictionary=True)
        cursor.execute("SELECT * FROM tareas")
        todas_las_tareas = cursor.fetchall()
        cursor.close()
        conexion.close()
        return jsonify(todas_las_tareas), 200
    except Exception as error:
        return jsonify({"mensaje":f"Error al consultar{error}"}),500    

@app.route('/')
def inicio():
    return "¡El servidor está funcionando! Visitá /tareas para ver los datos."

# RUTA PARA CREAR UNA NUEVA TAREA

@app.route('/tareas', methods=['POST'])
def crear_tarea():
    try:
        nueva_tarea = request.json # aca recibimos los datos del front
        conexion = obtener_conexion()
        cursor = conexion.cursor()
        
        consulta = "INSERT INTO tareas(titulo,descripcion) VALUES (%s,%s)"
        valores = (nueva_tarea['titulo'],nueva_tarea['descripcion'])
        
        cursor.execute(consulta,valores)
        conexion.commit() # GUARDO LOS CAMBIOS EN LA BASE DE DATOS
        
        cursor.close()
        conexion.close()
        return jsonify ({"mensaje":"Tarea guarda con exito"}),201
    except Exception as error:
        return jsonify({"mensaje": f"Error al crear: {error}"}), 500

# RUTA PARA ELIMINAR TAREA

# RUTA PARA ELIMINAR UNA TAREA
@app.route('/tareas/<int:id>', methods=['DELETE'])
def eliminar_tarea(id):
    try:
        conexion = obtener_conexion()
        cursor = conexion.cursor()
        
        # SQL para borrar la fila con ese ID específico
        consulta = "DELETE FROM tareas WHERE id = %s"
        cursor.execute(consulta, (id,))
        
        conexion.commit() # Confirmamos el borrado en la base de datos
        cursor.close()
        conexion.close()
        
        return jsonify({"mensaje": "Tarea eliminada correctamente"}), 200
    except Exception as error:
        return jsonify({"mensaje": f"Error al eliminar: {error}"}), 500
    
# RUTA PARA ACTUALIZAR ESTADO DE UNA TAREA (TERMINADA,PENDIENTE)

@app.route('/tareas/<int:id>', methods=['PUT'])
def actualizar_tarea(id):
    try:
        datos = request.json
        conexion = obtener_conexion()
        cursor = conexion.cursor()
        
        # ahora a cambiar el estado de la tarea
        consulta = "UPDATE tareas SET completada = %s WHERE id = %s"
        valores = (datos['completada', id])
        
        cursor.execute(consulta,valores)
        conexion.commit()
        
        cursor.close()
        conexion.close()
        return jsonify({"mensaje":"tarea actualizada"}),200
    except Exception as error:
        return jsonify({'mensaje': f"Error al actualizar: {error}"}),400

@app.route('/tareas/editar/<int:id>', methods=['PUT'])
def editar_tarea(id):
    try:
        datos = request.json
        conexion = obtener_conexion()
        cursor = conexion.cursor()
        
        # Actualizamos título y descripción
        consulta = "UPDATE tareas SET titulo = %s, descripcion = %s WHERE id = %s"
        cursor.execute(consulta, (datos['titulo'], datos['descripcion'], id))
        
        conexion.commit()
        cursor.close()
        conexion.close()
        
        return jsonify({"mensaje": "Tarea editada correctamente"}), 200
    except Exception as error:
        return jsonify({"mensaje": f"Error al editar: {error}"}), 500
    
if __name__ == '__main__':
    app.run(debug=True)