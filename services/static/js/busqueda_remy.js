/* ==========================================================================
   CONTROLADOR JS BÚSQUEDA EN TIEMPO REAL - REMY 1.0
   ========================================================================== */

function inicializarBusquedaREMY() {
    const inputBusqueda = document.getElementById('input_busqueda');
    const btnEjecutar = document.getElementById('btn_ejecutar_busqueda');
    const btnFiltro = document.getElementById('btn_abrir_filtro');
    const listaTarjetas = document.querySelectorAll('.tarjeta-item-resultado');
    const msjSinResultados = document.getElementById('sin_resultados_msj');

    if (!inputBusqueda || listaTarjetas.length === 0) return;

    // Función principal para filtrar elementos según el texto escrito
    function filtrarElementos() {
        const textoFiltro = inputBusqueda.value.toLowerCase().trim();
        let contadorVisibles = 0;

        listaTarjetas.forEach((tarjeta) => {
            const titulo = tarjeta.getAttribute('data-titulo') || '';
            const categoria = tarjeta.getAttribute('data-categoria') || '';
            const contenidoTexto = tarjeta.textContent.toLowerCase();

            // Comprueba si el texto ingresado coincide con el título, categoría o texto
            if (titulo.includes(textoFiltro) || categoria.includes(textoFiltro) || contenidoTexto.includes(textoFiltro)) {
                tarjeta.classList.remove('oculto');
                contadorVisibles++;
            } else {
                tarjeta.classList.add('oculto');
            }
        });

        // Muestra u oculta el mensaje de "Sin resultados"
        if (contadorVisibles === 0) {
            msjSinResultados.classList.remove('oculto');
        } else {
            msjSinResultados.classList.add('oculto');
        }
    }

    // Evento de escritura en tiempo real
    inputBusqueda.addEventListener('input', filtrarElementos);

    // Evento al dar clic en la Lupa de Búsqueda
    btnEjecutar.addEventListener('click', (e) => {
        e.preventDefault();
        filtrarElementos();
    });

    // Evento al presionar Enter dentro del input
    inputBusqueda.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            filtrarElementos();
        }
    });

    // Evento para el botón de filtro
    btnFiltro.addEventListener('click', () => {
        alert('Funcionalidad de filtro avanzado seleccionada.');
    });

    // Ejecuta el filtro inicial para reflejar lo escrito por defecto ("Ca")
    filtrarElementos();
}

// Ejecución limpia
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarBusquedaREMY);
} else {
    inicializarBusquedaREMY();
}