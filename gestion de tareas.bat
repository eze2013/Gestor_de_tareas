@echo off
title Lanzador Gestor de Tareas

:: 1. Entramos a la carpeta usando la ruta exacta que me pasaste
cd /d "C:\Users\ezequ\Desktop\gestor de tareas\FRONT"

:: 2. Iniciamos el servidor de Python en una ventana minimizada
start /min python app.py

:: 3. Esperamos 2 segundos para que Python arranque
timeout /t 2 /nobreak >nul

:: 4. Abrimos el index.html usando la ruta completa
start "" "C:\Users\ezequ\Desktop\gestor de tareas\FRONT\index.html"

exit