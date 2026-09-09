async function cargarDetalleMenu() {
    const partes = window.location.pathname.split('/');
    const id_menu = partes[partes.length - 1];

    if (!id_menu) return;

    try {
        // 1. Obtener datos desde la API (puerto 5085)
        const responseMenu = await fetch(`http://localhost:5085/menus/${id_menu}`);
        const menu = await responseMenu.json();

        if (!menu) return;

        // 2. Poblar información básica en la interfaz
        const elNombre = document.querySelector('.tit-platillo');
        const elPrecio = document.querySelector('.precio-platillo');
        const elDescripcion = document.querySelector('.txt-descripcion');
        const elFecha = document.querySelector('.col-meta-datos .txt-meta:nth-child(1) strong');
        const elTiempos = document.querySelector('.col-meta-datos .txt-meta:nth-child(2) strong');
        const swtchEstado = document.getElementById('swtch_estado_plato');
        const btnEditar = document.getElementById('btn_flotante_editar');

        if (elNombre) elNombre.textContent = menu.nombre ? menu.nombre.toUpperCase() : '';
        if (elPrecio) elPrecio.textContent = menu.precio ? `$${menu.precio}` : '$0';
        if (elDescripcion) elDescripcion.textContent = menu.descripcion || '';
        if (elFecha) elFecha.textContent = menu.fecha_creacion ? menu.fecha_creacion.split('T')[0] : '';
        if (elTiempos) elTiempos.textContent = menu.tiempos || '0';
        if (btnEditar) btnEditar.href = `/modificar_menu/${id_menu}`;

        if (swtchEstado) {
            swtchEstado.checked = menu.estado === 'Activo' || menu.activo === true;
            swtchEstado.dispatchEvent(new Event('change'));
        }

        // 3. Renderizar carrusel dinámico si la API envía imágenes
        const tiraDiapositivas = document.getElementById('tira_imagenes');
        const contPuntos = document.getElementById('cont_puntos_carrusel');

        let imagenes = [];
        if (Array.isArray(menu.imagenes) && menu.imagenes.length > 0) {
            imagenes = menu.imagenes;
        } else if (menu.imagen_url || menu.img_menu) {
            imagenes = [menu.imagen_url || menu.img_menu];
        }

        if (tiraDiapositivas && contPuntos && imagenes.length > 0) {
            tiraDiapositivas.innerHTML = '';
            contPuntos.innerHTML = '';

            imagenes.forEach((imgUrl, idx) => {
                tiraDiapositivas.innerHTML += `
                    <figure class="item-diapositiva">
                        <img src="${imgUrl}" alt="${menu.nombre || 'Menú'}" class="img-fluida">
                    </figure>
                `;
                contPuntos.innerHTML += `
                    <button type="button" class="btn-punto ${idx === 0 ? 'activo' : ''}" data-slide="${idx}" aria-label="Foto ${idx + 1}"></button>
                `;
            });
        }

        // 4. Inicializar carrusel con los elementos DOM generados
        inicializarCarrusel();

    } catch (error) {
        console.error('Error al cargar el detalle del menú:', error);
    }
}

function inicializarCarrusel() {
    const tiraDiapositivas = document.getElementById('tira_imagenes');
    const btnsPuntos = document.querySelectorAll('.btn-punto');
    
    if (!tiraDiapositivas || btnsPuntos.length === 0) return;

    const totalDiapositivas = btnsPuntos.length;
    let indiceActual = 0;
    let temporizadorCarrusel = null;
    const TIEMPO_CAMBIO_MS = 3000;

    function moverCarruselA(indice) {
        indiceActual = indice;
        const desplazamientoPorcentaje = -indiceActual * 100;
        
        tiraDiapositivas.style.transform = `translateX(${desplazamientoPorcentaje}%)`;

        btnsPuntos.forEach((punto, pos) => {
            const esActivo = pos === indiceActual;
            punto.classList.toggle('activo', esActivo);
            
            if (esActivo) {
                punto.setAttribute('aria-current', 'true');
            } else {
                punto.removeAttribute('aria-current');
            }
        });
    }

    function siguienteFoto() {
        const siguienteIndice = (indiceActual + 1) % totalDiapositivas;
        moverCarruselA(siguienteIndice);
    }

    function iniciarAutoplay() {
        detenerAutoplay();
        temporizadorCarrusel = setInterval(siguienteFoto, TIEMPO_CAMBIO_MS);
    }

    function detenerAutoplay() {
        if (temporizadorCarrusel) {
            clearInterval(temporizadorCarrusel);
            temporizadorCarrusel = null;
        }
    }

    btnsPuntos.forEach((punto) => {
        punto.addEventListener('click', (evento) => {
            const posSeleccionada = parseInt(evento.currentTarget.getAttribute('data-slide'), 10);
            moverCarruselA(posSeleccionada);
            iniciarAutoplay(); 
        });
    });

    const visor = tiraDiapositivas.parentElement;
    if (visor) {
        visor.addEventListener('mouseenter', detenerAutoplay);
        visor.addEventListener('mouseleave', iniciarAutoplay);
    }

    iniciarAutoplay();
}

function inicializarREMY() {
    const swtchEstado = document.getElementById('swtch_estado_plato');
    const lblEstado = document.getElementById('lbl_estado_swtch');

    if (swtchEstado && lblEstado) {
        const actualizarEstadoUI = () => {
            if (swtchEstado.checked) {
                lblEstado.textContent = 'Activo';
                lblEstado.classList.remove('inactivo');
            } else {
                lblEstado.textContent = 'Inactivo';
                lblEstado.classList.add('inactivo');
            }
        };

        actualizarEstadoUI();
        swtchEstado.addEventListener('change', actualizarEstadoUI);
    }

    // Carga asíncrona de datos desde el backend
    cargarDetalleMenu();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarREMY);
} else {
    inicializarREMY();
}