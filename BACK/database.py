import mysql.connector

def obtener_conexion():
    conexion = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Locura2013",
        database="gestor_tareas_db"
    )
    return conexion
