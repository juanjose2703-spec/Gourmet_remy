function inicializarBusquedaREMY() {
    const inputBusqueda = document.getElementById('input_busqueda');
    const btnEjecutar = document.getElementById('btn_ejecutar_busqueda');
    const btnFiltro = document.getElementById('btn_abrir_filtro');
    const panelFiltro = document.getElementById('panel_filtro');
    const contenedor = document.getElementById('sec_lista_resultados');
    const msjSinResultados = document.getElementById('sin_resultados_msj');
    const btnsFiltroTipo = document.querySelectorAll('.btn-filtro-tipo');

    if (!inputBusqueda) return;

    let todosLosResultados = [];
    let filtroActivo = 'todos';

    function pintarResultados(datos) {
        contenedor.innerHTML = '';

        const filtrados = filtroActivo === 'todos'
            ? datos
            : datos.filter(item => item.tipo === filtroActivo);

        if (filtrados.length === 0) {
            msjSinResultados.classList.remove('oculto');
            return;
        }

        msjSinResultados.classList.add('oculto');

        filtrados.forEach(item => {
            const fecha = item.fecha_creacion ? item.fecha_creacion.split('T')[0] : 'Sin fecha';

            contenedor.innerHTML += `
                <article class="tarjeta-plato"
                    data-titulo="${item.nombre.toLowerCase()}"
                    data-categoria="${item.tipo.toLowerCase()}">
                    <figure class="foto-plato">
                        <img src="${imagen}" alt="${item.nombre}" onerror="this.src='imagenes/rata.jfif'">
                    </figure>
                    <div class="info-plato">
                        <h3 class="nombre-plato letra-azul-dark">${item.nombre.toUpperCase()}</h3>
                        <p class="desc-plato">${item.descripcion}</p>
                        <p class="meta-plato">Tipo: <strong>${item.tipo}</strong></p>
                        <p class="meta-plato">Fecha creación: <strong>${fecha}</strong></p>
                    </div>
                </article>
            `;
        });
    }

    async function buscar() {
        const q = inputBusqueda.value.trim();

        if (q.length === 0) {
            contenedor.innerHTML = '';
            todosLosResultados = [];
            msjSinResultados.classList.add('oculto');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/buscar?q=${encodeURIComponent(q)}`);
            todosLosResultados = await response.json();
            pintarResultados(todosLosResultados);
        } catch (error) {
            console.error('Error al buscar:', error);
        }
    }

    // Evento escritura en tiempo real
    inputBusqueda.addEventListener('input', buscar);

    // Evento lupa
    btnEjecutar.addEventListener('click', (e) => {
        e.preventDefault();
        buscar();
    });

    // Evento Enter
    inputBusqueda.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            buscar();
        }
    });

    // Evento abrir/cerrar panel de filtro
    btnFiltro.addEventListener('click', () => {
        panelFiltro.classList.toggle('oculto');
    });

    // Evento botones de filtro por tipo
    btnsFiltroTipo.forEach(btn => {
        btn.addEventListener('click', () => {
            btnsFiltroTipo.forEach(b => b.classList.remove('activo'));
            btn.classList.add('activo');
            filtroActivo = btn.getAttribute('data-tipo');
            pintarResultados(todosLosResultados);
        });
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarBusquedaREMY);
} else {
    inicializarBusquedaREMY();
}