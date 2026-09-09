document.addEventListener('DOMContentLoaded', () => {

    const pestaPlatos = document.getElementById('pesta_platos');
    const pestaMenu = document.getElementById('pesta_menu');
    const secColPlatos = document.getElementById('sec_col_platos');
    const secColMenu = document.getElementById('sec_col_menu');
    const mediaQueryPC = window.matchMedia('(min-width: 1020px)');

    function mostrarSeccion(seccionActivar) {
        if (mediaQueryPC.matches) return;

        if (seccionActivar === 'platos') {
            secColPlatos.classList.remove('oculto-movil');
            secColPlatos.classList.add('visible');
            secColMenu.classList.add('oculto-movil');
            secColMenu.classList.remove('visible');
            pestaPlatos.classList.add('activa');
            pestaMenu.classList.remove('activa');
        } else if (seccionActivar === 'menu') {
            secColMenu.classList.remove('oculto-movil');
            secColMenu.classList.add('visible');
            secColPlatos.classList.add('oculto-movil');
            secColPlatos.classList.remove('visible');
            pestaMenu.classList.add('activa');
            pestaPlatos.classList.remove('activa');
        }
    }

    function verificarTamanoPantalla(e) {
        if (e.matches) {
            secColPlatos.classList.remove('oculto-movil');
            secColMenu.classList.remove('oculto-movil');
        } else {
            if (pestaMenu.classList.contains('activa')) {
                mostrarSeccion('menu');
            } else {
                mostrarSeccion('platos');
            }
        }
    }

    if (pestaPlatos && pestaMenu) {
        pestaPlatos.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarSeccion('platos');
        });
        pestaMenu.addEventListener('click', (e) => {
            e.preventDefault();
            mostrarSeccion('menu');
        });
    }

    mediaQueryPC.addEventListener('change', verificarTamanoPantalla);
    verificarTamanoPantalla(mediaQueryPC);

    // ========== CARGAR PLATOS ==========
    async function cargarPlatos() {
        try {
            const response = await fetch('http://localhost:5085/platos');
            const data = await response.json();
            const contenedor = document.querySelector('#sec_col_platos .lista-tarjetas-grid');
            contenedor.innerHTML = '';

            data.forEach(plato => {
                const categorias = {1: 'Entrada', 2: 'Plato Fuerte', 3: 'Postre', 4: 'Bebida'};
                const categoria = categorias[plato.categoria] || 'Sin categoría';
                const fecha = plato.fecha_creacion ? plato.fecha_creacion.split('T')[0] : 'Sin fecha';
                const imagen = plato.img_plato || 'imagenes/rata.jfif';
                const opacidad = plato.estado === 'Inactivo' ? 'style="opacity:0.4"' : '';

                contenedor.innerHTML += `
                    <a href="/detalle_plato/${plato.id_plato}" class="tarjeta-plato" ${opacidad}>
                        <figure class="foto-plato">
                            <img src="${imagen}" alt="${plato.nombre}" onerror="this.src='imagenes/rata.jfif'">
                        </figure>
                        <div class="info-plato">
                            <h3 class="nombre-plato letra-azul-dark">${plato.nombre.toUpperCase()}</h3>
                            <p class="desc-plato">${plato.descripcion}</p>
                            <p class="meta-plato">Categoría: <strong>${categoria}</strong></p>
                            <p class="meta-plato">Fecha creación: <strong>${fecha}</strong></p>
                        </div>
                    </a>
                `;
            });
        } catch (error) {
            console.error('Error al cargar platos:', error);
        }
    }

    // ========== CARGAR MENUS ==========
    async function cargarMenus() {
        try {
            const response = await fetch('http://localhost:5084/menus');
            const data = await response.json();
            const contenedor = document.querySelector('#sec_col_menu .lista-tarjetas-grid');
            contenedor.innerHTML = '';

            data.forEach(menu => {
                const platos = menu.platos || [];
                const opacidad = menu.estado === 'Inactivo' ? 'style="opacity:0.4"' : '';
                const precio = menu.precio ? `$${menu.precio.toLocaleString('es-CO')}` : '$0';

                let mosaico = '';
                if (platos.length >= 1) {
                    mosaico += `<figure class="img-menu-ppal"><img src="${platos[0].img_plato || 'imagenes/rata.jfif'}" alt="${platos[0].nombre}" onerror="this.src='imagenes/rata.jfif'"></figure>`;
                }
                if (platos.length >= 2) {
                    mosaico += `<figure class="img-menu-sec"><img src="${platos[1].img_plato || 'imagenes/rata.jfif'}" alt="${platos[1].nombre}" onerror="this.src='imagenes/rata.jfif'"></figure>`;
                }
                if (platos.length >= 3) {
                    mosaico += `<figure class="img-menu-sec"><img src="${platos[2].img_plato || 'imagenes/rata.jfif'}" alt="${platos[2].nombre}" onerror="this.src='imagenes/rata.jfif'"></figure>`;
                }
                if (platos.length >= 4) {
                    mosaico += `<figure class="img-menu-sec img-ancho-completo"><img src="${platos[3].img_plato || 'imagenes/rata.jfif'}" alt="${platos[3].nombre}" onerror="this.src='imagenes/rata.jfif'"></figure>`;
                }

                contenedor.innerHTML += `
                    <a href="/detalle_menu/${menu.id_menu}" class="tarjeta-menu-compuesta" ${opacidad}>
                        <div class="mosaico-imagenes-menu">
                            ${mosaico}
                        </div>
                        <div class="info-tarjeta-menu">
                            <h4 class="titulo-menu letra-negro">${menu.nombre}</h4>
                            <span class="precio-menu letra-verde">${precio}</span>
                        </div>
                    </a>
                `;
            });
        } catch (error) {
            console.error('Error al cargar menús:', error);
        }
    }

    cargarPlatos();
    cargarMenus();
});