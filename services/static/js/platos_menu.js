document.addEventListener('DOMContentLoaded', () => {

    const pestaPlatos = document.getElementById('pesta_platos');
    const pestaMenu = document.getElementById('pesta_menu');
    const secColPlatos = document.getElementById('sec_col_platos');
    const secColMenu = document.getElementById('sec_col_menu');
    const mediaQueryPC = window.matchMedia('(min-width: 1020px)');

    const IMAGEN_DEFAULT = '/static/img/dummy_remy.png';

    function recortarTexto(texto, maxCaracteres) {
        if (!texto) return '';
        return texto.length > maxCaracteres
            ? texto.substring(0, maxCaracteres).trim() + '...'
            : texto;
    }

    function obtenerRutaImagen(img) {
        if (!img || img.trim() === '') return IMAGEN_DEFAULT;
        if (img.startsWith('http://') || img.startsWith('https://')) return img;
        return `/img_remy/${img}`;
    }

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
            const response = await fetch('/api/platos');
            const json = await response.json();
            // Soporta array directo o {status, data}
            const data = Array.isArray(json) ? json : (json.data || []);
            const contenedor = document.querySelector('#sec_col_platos .lista-tarjetas-grid');
            contenedor.innerHTML = '';

            data.forEach(plato => {
                const categorias = {1: 'Entrada', 2: 'Plato Fuerte', 3: 'Postre', 4: 'Bebida'};
                const catId = plato.categoria || plato.id_categoria;
                const categoria = categorias[catId] || 'Sin categoría';
                const fecha = plato.fecha_creacion ? plato.fecha_creacion.split('T')[0] : 'Sin fecha';
                const imagen = obtenerRutaImagen(plato.img_plato);
                const opacidad = plato.estado === 'Inactivo' ? 'style="opacity:0.4"' : '';
                const nombreFormateado = recortarTexto(plato.nombre.toUpperCase(), 30);
                const descripcionFormateada = recortarTexto(plato.descripcion, 90);

                contenedor.innerHTML += `
                    <a href="/detalle_plato/${plato.id_plato}" class="tarjeta-plato" ${opacidad}>
                        <figure class="foto-plato">
                            <img src="${imagen}" alt="${plato.nombre}" onerror="this.src='${IMAGEN_DEFAULT}'">
                        </figure>
                        <div class="info-plato">
                            <h3 class="nombre-plato letra-azul-dark">${nombreFormateado}</h3>
                            <p class="desc-plato">${descripcionFormateada}</p>
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
            const response = await fetch('/api/menus');
            const json = await response.json();
            // Soporta array directo o {status, data}
            const data = Array.isArray(json) ? json : (json.data || []);
            const contenedor = document.querySelector('#sec_col_menu .lista-tarjetas-grid');
            contenedor.innerHTML = '';

            data.forEach(menu => {
                const platos = menu.platos || [];
                const opacidad = menu.estado === 'Inactivo' ? 'style="opacity:0.4"' : '';
                const precio = menu.precio ? `$${menu.precio.toLocaleString('es-CO')}` : '$0';
                const tituloMenuFormateado = recortarTexto(menu.nombre, 30);

                const platoPrincipal = platos.find(p => p.categoria === 2);
                const entrada        = platos.find(p => p.categoria === 1);
                const postre         = platos.find(p => p.categoria === 3);
                const bebida         = platos.find(p => p.categoria === 4);

                let mosaico = '';

                const imgPrincipal = platoPrincipal ? obtenerRutaImagen(platoPrincipal.img_plato) : IMAGEN_DEFAULT;
                const altPrincipal = platoPrincipal ? platoPrincipal.nombre : 'Plato fuerte';
                mosaico += `<figure class="img-menu-ppal"><img src="${imgPrincipal}" alt="${altPrincipal}" onerror="this.src='${IMAGEN_DEFAULT}'"></figure>`;

                if (entrada) {
                    mosaico += `<figure class="img-menu-sec"><img src="${obtenerRutaImagen(entrada.img_plato)}" alt="${entrada.nombre}" onerror="this.src='${IMAGEN_DEFAULT}'"></figure>`;
                }
                if (postre) {
                    mosaico += `<figure class="img-menu-sec"><img src="${obtenerRutaImagen(postre.img_plato)}" alt="${postre.nombre}" onerror="this.src='${IMAGEN_DEFAULT}'"></figure>`;
                }
                if (bebida) {
                    mosaico += `<figure class="img-menu-sec img-ancho-completo"><img src="${obtenerRutaImagen(bebida.img_plato)}" alt="${bebida.nombre}" onerror="this.src='${IMAGEN_DEFAULT}'"></figure>`;
                }

                contenedor.innerHTML += `
                    <a href="/detalle_menu/${menu.id_menu}" class="tarjeta-menu-compuesta" ${opacidad}>
                        <div class="mosaico-imagenes-menu">
                            ${mosaico}
                        </div>
                        <div class="info-tarjeta-menu">
                            <h4 class="titulo-menu letra-negro">${tituloMenuFormateado}</h4>
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