const contenedorTareas = document.getElementById('contenedor-tareas');
const btnAgregar = document.getElementById('btn-agregar');
const inputTitulo = document.getElementById('titulo');
const inputDescripcion = document.getElementById('descripcion');
const contadorTareas = document.getElementById('contador-tareas');

const API_URL = 'http://127.0.0.1:5000/tareas';

// Cargar tareas al iniciar
document.addEventListener('DOMContentLoaded', obtenerTareas);

async function obtenerTareas() {
    try {
        const respuesta = await fetch(API_URL);
        const tareas = await respuesta.json();

        contenedorTareas.innerHTML = ''; 
        contadorTareas.innerText = `${tareas.length} tareas`;

        // Ordenamos: Pendientes (0) primero, Completadas (1) al final
        tareas.sort((a, b) => a.completada - b.completada);

        tareas.forEach(tarea => {
            const div = document.createElement('div');
            div.classList.add('tarea-item');
            
            // Forzamos la evaluación: si es 1, es verdadera
            const estaCompletada = tarea.completada == 1;

            if (estaCompletada) div.classList.add('completada');

            div.innerHTML = `
            <div class="tarea-info">
                <h3>${tarea.titulo}</h3>
                <p>${tarea.descripcion || ''}</p>
            </div>
            <div class="tarea-acciones">
                
                <button class="btn-edit" onclick="editarTarea(${tarea.id}, '${tarea.titulo}', '${tarea.descripcion || ''}')">✏️</button>
                <button class="btn-borrar" onclick="eliminarTarea(${tarea.id})">🗑️</button>
            </div>
            `;
            contenedorTareas.appendChild(div);
        });
    }
    catch (error) {
        console.error("Error en el cargado de tareas: ", error);
    }
}

// EVENTO PARA EL BOTÓN AGREGAR
btnAgregar.addEventListener('click', async () => {
    const titulo = inputTitulo.value;
    const descripcion = inputDescripcion.value;

    // Validación básica: que el título no esté vacío
    if (!titulo) {
        alert("Por favor, escribí un título para la tarea");
        return;
    }

    const nuevaTarea = {
        titulo: titulo,
        descripcion: descripcion
    };

    try {
        const respuesta = await fetch(API_URL, {
            method: 'POST', // Usamos el método POST que definimos en el Back
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevaTarea)
        });

        if (respuesta.ok) {
            // Si se guardó bien, limpiamos los campos y refrescamos la lista
            inputTitulo.value = '';
            inputDescripcion.value = '';
            obtenerTareas(); // Volvemos a cargar la lista para ver la nueva tarea
        } else {
            console.error("Error al guardar la tarea");
        }
    } catch (error) {
        console.error("Error en la conexión al agregar:", error);
    }
});

async function eliminarTarea(id) {
    // Es buena práctica preguntar antes de borrar
    if (!confirm("¿Estás seguro de que querés eliminar esta tarea?")) return;

    try {
        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE' // Enviamos el método DELETE al Back
        });

        if (respuesta.ok) {
            console.log("Tarea eliminada con éxito");
            obtenerTareas(); // Recargamos la lista para que desaparezca de la pantalla
        } else {
            alert("No se pudo eliminar la tarea");
        }
    } catch (error) {
        console.error("Error en la conexión al eliminar:", error);
    }
}

async function cambiarEstado(id, estadoActual) {
    try {
        // estadoActual viene como 0 o 1 (o true/false)
        // Lo invertimos: si es 1 pasa a 0, si es 0 pasa a 1
        const nuevoEstado = estadoActual ? 0 : 1;

        const respuesta = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completada: nuevoEstado })
        });

        if (respuesta.ok) {
            obtenerTareas(); // Refrescamos la lista para ver el tachado o el color nuevo
        }
    } catch (error) {
        console.error("Error al actualizar estado:", error);
    }
}

async function editarTarea(id, tituloActual, descActual) {
    const nuevoTitulo = prompt("Editar título:", tituloActual);
    const nuevaDesc = prompt("Editar descripción:", descActual);

    if (nuevoTitulo === null || nuevoTitulo.trim() === "") return;

    try {
        const respuesta = await fetch(`${API_URL}/editar/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                titulo: nuevoTitulo, 
                descripcion: nuevaDesc 
            })
        });

        if (respuesta.ok) {
            obtenerTareas(); 
        }
    } catch (error) {
        console.error("Error al editar tarea:", error);
    }
}



