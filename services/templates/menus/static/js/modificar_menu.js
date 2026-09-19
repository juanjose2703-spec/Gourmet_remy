document.addEventListener('DOMContentLoaded', async () => {

    const IMAGEN_DEFAULT = '/static/img/dummy_remy.png';

    let campoDestinoInput = null;
    let categoriaFiltroActual = null;
    let todosLosPlatos = [];

    const mapaCategorias = {
        'plato_fuerte': 2,
        'entrada':      1,
        'postre':       3,
        'bebida':       4
    };

    const platosSeleccionados = {
        'plato_fuerte': null,
        'entrada':      null,
        'postre':       null,
        'bebida':       null
    };

    const superficieModal       = document.getElementById('superficie_modal');
    const tituloSuperficie      = document.getElementById('titulo_superficie');
    const inputBuscarPlato      = document.getElementById('input_buscar_plato');
    const listaPlatosContenedor = document.getElementById('lista_platos');
    const formaModificarMenu    = document.getElementById('forma_modificar_menu');
    const camposSeleccion       = document.querySelectorAll('.campo-seleccion');
    const inputPrecio           = document.getElementById('precio_menu');
    const toggleActivo          = document.getElementById('activo_menu');
    const lblEstado             = document.getElementById('lbl_estado_menu');
    const botonesLimpiar        = document.querySelectorAll('.btn-limpiar');

    const partes = window.location.pathname.split('/');
    const id_menu = partes[partes.length - 1];

    function obtenerRutaImagen(img) {
        if (!img || img.trim() === '') return IMAGEN_DEFAULT;
        if (img.startsWith('http://') || img.startsWith('https://')) return img;
        return `/img_remy/${img}`;
    }

    async function cargarTodosLosPlatos() {
        try {
            const response = await fetch('/api/platos');
            const json = await response.json();
            const data = Array.isArray(json) ? json : (json.data || []);
            todosLosPlatos = data.filter(p => p.estado === 'Activo');
        } catch (error) {
            console.error('Error al cargar platos:', error);
        }
    }

    function obtenerPlatosCategoriaActual() {
        return todosLosPlatos.filter(p => {
            const cat = p.id_categoria !== undefined ? p.id_categoria : p.categoria;
            return String(cat) === String(categoriaFiltroActual);
        });
    }

    async function cargarMenuExistente() {
        try {
            const response = await fetch(`/api/menus/${id_menu}`);
            const menu = await response.json();

            if (!menu) return;

            document.getElementById('nombre_menu').value = menu.nombre || '';
            document.getElementById('desc_menu').value   = menu.descripcion || '';
            document.getElementById('precio_menu').value = menu.precio || '';
            toggleActivo.checked = menu.estado === 'Activo';
            actualizarEstadoToggle();

            if (menu.platos && menu.platos.length > 0) {
                menu.platos.forEach(plato => {
                    const cat = plato.categoria !== undefined ? plato.categoria : plato.id_categoria;
                    if (cat === 1) {
                        document.getElementById('entrada').value = plato.nombre;
                        platosSeleccionados['entrada'] = plato.id_plato;
                        actualizarBotonLimpiar(document.getElementById('entrada'));
                    } else if (cat === 2) {
                        document.getElementById('plato_fuerte').value = plato.nombre;
                        platosSeleccionados['plato_fuerte'] = plato.id_plato;
                        actualizarBotonLimpiar(document.getElementById('plato_fuerte'));
                    } else if (cat === 3) {
                        document.getElementById('postre').value = plato.nombre;
                        platosSeleccionados['postre'] = plato.id_plato;
                        actualizarBotonLimpiar(document.getElementById('postre'));
                    } else if (cat === 4) {
                        document.getElementById('bebida').value = plato.nombre;
                        platosSeleccionados['bebida'] = plato.id_plato;
                        actualizarBotonLimpiar(document.getElementById('bebida'));
                    }
                });
            }
        } catch (error) {
            console.error('Error al cargar el menú:', error);
        }
    }

    function actualizarBotonLimpiar(input) {
        const wrapper = input.closest('.cont-input-wrapper');
        if (!wrapper) return;
        const btn = wrapper.querySelector('.btn-limpiar');
        if (!btn) return;
        if (input.value.trim() !== '') {
            btn.classList.remove('oculto');
        } else {
            btn.classList.add('oculto');
        }
    }

    botonesLimpiar.forEach(btn => {
        btn.addEventListener('click', (evento) => {
            evento.stopPropagation();
            const wrapper = btn.closest('.cont-input-wrapper');
            const input = wrapper ? wrapper.querySelector('input') : null;
            if (input) {
                platosSeleccionados[input.id] = null;
                input.value = '';
                btn.classList.add('oculto');
            }
        });
    });

    // === APERTURA Y BÚSQUEDA GENERAL INICIAL ===
    camposSeleccion.forEach(input => {
        input.addEventListener('click', () => {
            campoDestinoInput = input;
            categoriaFiltroActual = mapaCategorias[input.id];
            tituloSuperficie.textContent = input.getAttribute('data-titulo') || 'Escoger plato';
            inputBuscarPlato.value = '';

            const filtrados = obtenerPlatosCategoriaActual();
            renderizarPlatos(filtrados);
            
            superficieModal.classList.remove('oculto');
        });
    });

    superficieModal.addEventListener('click', (evento) => {
        if (evento.target === superficieModal) cerrarSuperficie();
    });

    function cerrarSuperficie() {
        superficieModal.classList.add('oculto');
        campoDestinoInput = null;
        categoriaFiltroActual = null;
    }

    function renderizarPlatos(lista) {
        listaPlatosContenedor.innerHTML = '';

        if (lista.length === 0) {
            listaPlatosContenedor.innerHTML = '<p style="text-align:center;color:#545454;padding:20px;font-weight:bold;">No se encontraron platos.</p>';
            return;
        }

        lista.forEach(plato => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta-plato';

            tarjeta.addEventListener('click', () => {
                if (campoDestinoInput) {
                    campoDestinoInput.value = plato.nombre;
                    platosSeleccionados[campoDestinoInput.id] = plato.id_plato;
                    actualizarBotonLimpiar(campoDestinoInput);
                }
                cerrarSuperficie();
            });

            const rutaImg = obtenerRutaImagen(plato.img_plato);

            tarjeta.innerHTML = `
                <img src="${rutaImg}" alt="${plato.nombre}" onerror="this.src='${IMAGEN_DEFAULT}'">
                <div class="info-plato">
                    <h3>${plato.nombre}</h3>
                    <p>${plato.descripcion || ''}</p>
                </div>
            `;
            listaPlatosContenedor.appendChild(tarjeta);
        });
    }

    inputBuscarPlato.addEventListener('input', () => {
        const texto = inputBuscarPlato.value.toLowerCase().trim();
        const base = obtenerPlatosCategoriaActual();
        if (texto === '') {
            renderizarPlatos(base);
            return;
        }
        renderizarPlatos(base.filter(p => p.nombre.toLowerCase().includes(texto)));
    });

    if (inputPrecio) {
        inputPrecio.addEventListener('keydown', (evento) => {
            if (['e', 'E', '+', '-', '.'].includes(evento.key)) evento.preventDefault();
        });
        inputPrecio.addEventListener('input', () => {
            inputPrecio.value = inputPrecio.value.replace(/[^0-9]/g, '');
        });
    }

    function actualizarEstadoToggle() {
        if (lblEstado && toggleActivo) {
            lblEstado.textContent = toggleActivo.checked ? 'Activo' : 'Inactivo';
        }
    }

    if (toggleActivo) {
        toggleActivo.addEventListener('change', actualizarEstadoToggle);
    }

    formaModificarMenu.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const platoFuerte = platosSeleccionados['plato_fuerte'];
        const entrada     = platosSeleccionados['entrada'];
        const bebida      = platosSeleccionados['bebida'];
        const postre      = platosSeleccionados['postre'];

        if (!platoFuerte) {
            alert('El Plato Fuerte es obligatorio para la modificación del menú.');
            return;
        }

        if (!entrada && !postre) {
            alert('Debe seleccionar al menos una Entrada o un Postre.');
            return;
        }

        const platosDelMenu = [];
        if (entrada) platosDelMenu.push({ id_plato: entrada });
        if (platoFuerte) platosDelMenu.push({ id_plato: platoFuerte });
        if (postre) platosDelMenu.push({ id_plato: postre });
        if (bebida) platosDelMenu.push({ id_plato: bebida });

        if (platosDelMenu.length < 3) {
            alert('El menú debe contener un mínimo de 3 platos.');
            return;
        }

        const data = {
            menu: {
                id_menu:     id_menu,
                nombre:      document.getElementById('nombre_menu').value.trim(),
                descripcion: document.getElementById('desc_menu').value.trim(),
                precio:      parseInt(document.getElementById('precio_menu').value) || 0,
                estado:      toggleActivo.checked ? 'Activo' : 'Inactivo'
            },
            platos: platosDelMenu
        };

        try {
            const response = await fetch(`/api/menus/${id_menu}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const resultado = await response.json();

            if (resultado.status === 'success') {
                alert(`Menú actualizado con éxito. Tiempos: ${resultado.tiempos_menu}`);
                window.location.href = '/platos_menu';
            } else {
                alert(`Error: ${resultado.message}`);
            }
        } catch (error) {
            console.error('Error al modificar el menú:', error);
        }
    });

    await cargarTodosLosPlatos();
    await cargarMenuExistente();
});