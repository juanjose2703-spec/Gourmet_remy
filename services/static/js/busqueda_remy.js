function inicializarBusquedaREMY() {
    const inputBusqueda = document.getElementById('input_busqueda');
    const btnEjecutar = document.getElementById('btn_ejecutar_busqueda');
    const btnFiltro = document.getElementById('btn_abrir_filtro');
    const contenedor = document.getElementById('sec_lista_resultados');
    const msjSinResultados = document.getElementById('sin_resultados_msj');

    if (!inputBusqueda) return;

    async function buscar() {
        const q = inputBusqueda.value.trim();
        if (q.length === 0) {
            contenedor.innerHTML = '';
            msjSinResultados.classList.add('oculto');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/buscar?q=${encodeURIComponent(q)}`);
            const data = await response.json();
            contenedor.innerHTML = '';

            if (data.length === 0) {
                msjSinResultados.classList.remove('oculto');
                return;
            }

            msjSinResultados.classList.add('oculto');

            data.forEach(item => {
                const fecha = item.fecha_creacion ? item.fecha_creacion.split('T')[0] : 'Sin fecha';

                contenedor.innerHTML += `
                    <article class="tarjeta-plato"
                        data-titulo="${item.nombre.toLowerCase()}"
                        data-categoria="${item.tipo.toLowerCase()}">
                        <figure class="foto-plato">
                            <img src="${imagen}" alt="${item.nombre}" onerror="">
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
        } catch (error) {
            console.error('Error al buscar:', error);
        }
    }

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

    btnFiltro.addEventListener('click', () => {
        alert('Funcionalidad de filtro avanzado seleccionada.');
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarBusquedaREMY);
} else {
    inicializarBusquedaREMY();
}