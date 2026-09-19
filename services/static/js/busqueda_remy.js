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

    // Función aux para resolver la ruta de la imagen (URL remota, archivo local en img_remy o Dummy)
    function obtenerRutaImagen(img) {
        if (!img || img.trim() === '') return IMAGEN_DEFAULT;
        if (img.startsWith('http://') || img.startsWith('https://')) {
            return img;
        }
        return `/img_remy/${img}`;
    }

    // Función para manejar el clic y la navegación según el tipo de registro
    function redirigirADetalle(id, tipo) {
        const tipoLimpio = tipo ? tipo.toLowerCase().trim() : '';

        if (tipoLimpio === 'plato') {
            window.location.href = `/detalle_plato/${id}`;
        } else if (tipoLimpio === 'menú' || tipoLimpio === 'menu') {
            window.location.href = `/detalle_menu/${id}`;
        } else if (tipoLimpio === 'ingrediente') {
            // Ruta prehecha pero sin direccionar a nada aún
            console.log(`Detalle de ingrediente reservado (ID: ${id})`);
        }
    }

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
                const rutaImagen = obtenerRutaImagen(item.img_registro);

                contenedor.innerHTML += `
                    <article class="tarjeta-item-resultado" 
                            data-id="${item.id_registro}"
                            data-tipo="${item.tipo}"
                            data-titulo="${item.nombre ? item.nombre.toLowerCase() : ''}" 
                            data-categoria="${item.tipo ? item.tipo.toLowerCase() : ''}"
                            style="cursor: pointer;">
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

            // Asignar los eventos de clic a cada tarjeta recién renderizada
            const tarjetas = contenedor.querySelectorAll('.tarjeta-item-resultado');
            tarjetas.forEach(tarjeta => {
                tarjeta.addEventListener('click', () => {
                    const id = tarjeta.getAttribute('data-id');
                    const tipo = tarjeta.getAttribute('data-tipo');
                    redirigirADetalle(id, tipo);
                });
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