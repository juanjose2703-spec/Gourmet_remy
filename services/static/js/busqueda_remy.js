function inicializarBusquedaREMY() {
    const inputBusqueda = document.getElementById('input_busqueda');
    const btnEjecutar = document.getElementById('btn_ejecutar_busqueda');
    const btnFiltro = document.getElementById('btn_abrir_filtro');
    const menuFiltro = document.getElementById('menu_desplegable_filtro');
    const opcionesFiltro = document.querySelectorAll('.opcion-filtro');
    const contenedor = document.getElementById('sec_lista_resultados');
    const msjSinResultados = document.getElementById('sin_resultados_msj');

    if (!inputBusqueda) return;

    const IMAGEN_DEFAULT = '../../static/img/dummy_remy.png';

    async function buscar() {
        const q = inputBusqueda.value.trim();

        try {
            const response = await fetch(`/buscar?q=${encodeURIComponent(q)}`);
            if (!response.ok) throw new Error('Error al conectar con la base de datos');

            const data = await response.json();
            contenedor.innerHTML = '';

            // Mostrar el dummy únicamente cuando no hayan resultados
            if (!Array.isArray(data) || data.length === 0) {
                msjSinResultados.classList.remove('oculto');
                return;
            }

            msjSinResultados.classList.add('oculto');

            data.forEach(item => {
                const fecha = item.fecha_creacion ? item.fecha_creacion.split('T')[0] : 'Sin fecha';
                const rutaImagen = item.img_registro ? item.img_registro : IMAGEN_DEFAULT;

                contenedor.innerHTML += `
                    <article class="tarjeta-item-resultado" 
                             data-titulo="${item.nombre ? item.nombre.toLowerCase() : ''}" 
                             data-categoria="${item.tipo ? item.tipo.toLowerCase() : ''}">
                        <figure class="cont-img-tarjeta">
                            <img src="${rutaImagen}" 
                                 alt="${item.nombre}" 
                                 class="img-tarjeta" 
                                 onerror="this.src='${IMAGEN_DEFAULT}'">
                        </figure>
                        <div class="cont-info-tarjeta">
                            <h2 class="tit-item">${item.nombre ? item.nombre.toUpperCase() : 'SIN TÍTULO'}</h2>
                            <p class="desc-item">${item.descripcion || 'Sin descripción disponible.'}</p>
                            <p class="tag-categoria"><strong>-${item.tipo}</strong></p>
                            <p class="fecha-creacion">Fecha creación: <time datetime="${fecha}">${fecha}</time></p>
                        </div>
                    </article>
                `;
            });
        } catch (error) {
            console.error('Error durante la búsqueda:', error);
        }
    }

    // Toggle para desplegar/ocultar el menú de filtros
    if (btnFiltro && menuFiltro) {
        btnFiltro.addEventListener('click', (e) => {
            e.stopPropagation();
            menuFiltro.classList.toggle('oculto');
        });

        // Ocultar desplegable si se hace clic fuera de él
        document.addEventListener('click', (e) => {
            if (!menuFiltro.contains(e.target) && e.target !== btnFiltro) {
                menuFiltro.classList.add('oculto');
            }
        });
    }

    // Asignar texto de la opción seleccionada al input y ejecutar la búsqueda
    opcionesFiltro.forEach(opcion => {
        opcion.addEventListener('click', () => {
            inputBusqueda.value = opcion.textContent.trim();
            menuFiltro.classList.add('oculto');
            buscar();
        });
    });

    // Escuchadores de eventos para la barra de búsqueda
    inputBusqueda.addEventListener('input', buscar);

    btnEjecutar.addEventListener('click', (e) => {
        e.preventDefault();
        buscar();
    });

    inputBusqueda.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            buscar();
        }
    });

    // Búsqueda inicial automática al cargar
    buscar();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarBusquedaREMY);
} else {
    inicializarBusquedaREMY();
}