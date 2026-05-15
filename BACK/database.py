import mysql.connector

def obtener_conexion():
    conexion = mysql.connector.connect(
        host="localhost",
        user="root",
        password="*******",
        database="gestor_tareas_db"
    )
    return conexion
