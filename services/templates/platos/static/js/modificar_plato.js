document.addEventListener('DOMContentLoaded', async () => {

    const formModificarPlato      = document.getElementById('form_modificar_plato');
    const inputFoto               = document.getElementById('input_foto');
    const imgPreview              = document.getElementById('img_preview');
    const inputNombre             = document.getElementById('input_nombre');
    const inputDescripcion        = document.getElementById('input_descripcion');
    const inputCategoria          = document.getElementById('input_categoria');
    const inputEstado             = document.getElementById('input_estado');
    const btnLimpiarCat           = document.getElementById('btn_limpiar_cat');

    const contenedorIngredientes = document.getElementById('contenedor_ingredientes');
    const btnAgregarIngrediente  = document.getElementById('btn_agregar_ingrediente');
    const btnQuitarIngrediente   = document.getElementById('btn_quitar_ingrediente');

    const modalCategoria          = document.getElementById('modal_categoria');
    const btnCerrarModalCat       = document.getElementById('btn_cerrar_modal_cat');

    const textoEstado             = document.getElementById('texto_estado');

    // Elementos del modal overlay de ingredientes
    const superficieModalIngredientes = document.getElementById('superficie_modal_ingredientes');
    const inputBuscarIngrediente      = document.getElementById('input_buscar_ingrediente');
    const listaIngredientesContenedor = document.getElementById('lista_ingredientes');

    let itemIngredienteActual = null;
    let todosLosIngredientes = [];

    const categoriasMap = {
        1: 'Entrada',
        2: 'Plato Fuerte',
        3: 'Postre',
        4: 'Bebida',
        '1': 'Entrada',
        '2': 'Plato Fuerte',
        '3': 'Postre',
        '4': 'Bebida'
    };

    const partes = window.location.pathname.split('/');
    const id_plato = partes[partes.length - 1];

    if (!id_plato) return;

    // ==========================================
    // 1. LÓGICA DE CATEGORÍAS Y ESTADO
    // ==========================================
    if (inputCategoria) {
        inputCategoria.addEventListener('click', () => {
            if (modalCategoria && typeof modalCategoria.showModal === 'function') {
                modalCategoria.showModal();
            }
        });
    }

    const listaCategorias = document.getElementById('lista_categorias');
    if (listaCategorias) {
        listaCategorias.addEventListener('click', (e) => {
            if (e.target.tagName === 'LI') {
                const valorCat = e.target.getAttribute('data-valor') || e.target.textContent.trim();
                inputCategoria.value = valorCat;
                if (btnLimpiarCat) btnLimpiarCat.classList.remove('oculto');
                if (modalCategoria) modalCategoria.close();
            }
        });
    }

    if (btnLimpiarCat) {
        btnLimpiarCat.addEventListener('click', (e) => {
            e.stopPropagation();
            inputCategoria.value = '';
            btnLimpiarCat.classList.add('oculto');
        });
    }

    if (btnCerrarModalCat) {
        btnCerrarModalCat.addEventListener('click', () => {
            if (modalCategoria) modalCategoria.close();
        });
    }

    function actualizarTextoEstado() {
        if (textoEstado && inputEstado) {
            textoEstado.textContent = inputEstado.checked ? 'Activo' : 'Inactivo';
        }
    }

    if (inputEstado) {
        inputEstado.addEventListener('change', actualizarTextoEstado);
    }

    // ==========================================
    // 2. LÓGICA DE INGREDIENTES CON BUSCADOR
    // ==========================================
    async function cargarIngredientesDesdeDB() {
        try {
            const respuesta = await fetch('/api/ingredientes');
            if (!respuesta.ok) return;

            const data = await respuesta.json();
            const arrayBruto = Array.isArray(data) ? data : (data.data || []);

            todosLosIngredientes = arrayBruto.map(item => ({
                id: item.id_ingrediente || item.id || '',
                nombre: item.nombre || '',
                unidad: item.unidad_minima || item.unidad || item.unidad_medida || 'gr'
            })).filter(i => i.nombre !== '');

        } catch (error) {
            console.error('Error al obtener ingredientes:', error);
            todosLosIngredientes = [];
        }
    }

    function renderizarIngredientes(lista) {
        if (!listaIngredientesContenedor) return;
        listaIngredientesContenedor.innerHTML = '';

        if (!lista || lista.length === 0) {
            listaIngredientesContenedor.innerHTML = `
                <p style="text-align:center; color:#545454; padding:20px; font-weight:700; font-size:0.85rem;">
                    No se encontraron ingredientes.
                </p>`;
            return;
        }

        lista.forEach(ing => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'tarjeta-ingrediente-item';

            tarjeta.addEventListener('click', () => {
                if (itemIngredienteActual) {
                    const inputId = itemIngredienteActual.querySelector('.input-ingrediente-id');
                    const inputNombre = itemIngredienteActual.querySelector('.input-ingrediente-nombre');
                    const btnLimpiar = itemIngredienteActual.querySelector('.btn-limpiar');
                    const spanUnidad = itemIngredienteActual.querySelector('.unidad-medida');

                    if (inputId) inputId.value = ing.id;
                    if (inputNombre) inputNombre.value = ing.nombre;
                    if (btnLimpiar) btnLimpiar.classList.remove('oculto');
                    if (spanUnidad) spanUnidad.textContent = ing.unidad;
                }
                cerrarSuperficieIngredientes();
            });

            tarjeta.innerHTML = `
                <span class="nombre-ing">${ing.nombre}</span>
                <span class="unidad-ing">(${ing.unidad})</span>
            `;
            listaIngredientesContenedor.appendChild(tarjeta);
        });
    }

    if (inputBuscarIngrediente) {
        inputBuscarIngrediente.addEventListener('input', () => {
            const texto = inputBuscarIngrediente.value.toLowerCase().trim();
            if (texto === '') {
                renderizarIngredientes(todosLosIngredientes);
                return;
            }
            const filtrados = todosLosIngredientes.filter(i => 
                i.nombre.toLowerCase().includes(texto)
            );
            renderizarIngredientes(filtrados);
        });
    }

    async function abrirSuperficieIngredientes() {
        if (inputBuscarIngrediente) inputBuscarIngrediente.value = '';

        if (todosLosIngredientes.length === 0) {
            await cargarIngredientesDesdeDB();
        }

        renderizarIngredientes(todosLosIngredientes);
        if (superficieModalIngredientes) superficieModalIngredientes.classList.remove('oculto');
    }

    function cerrarSuperficieIngredientes() {
        if (superficieModalIngredientes) superficieModalIngredientes.classList.add('oculto');
        itemIngredienteActual = null;
    }

    if (superficieModalIngredientes) {
        superficieModalIngredientes.addEventListener('click', (e) => {
            if (e.target === superficieModalIngredientes) cerrarSuperficieIngredientes();
        });
    }

    function crearBloqueIngrediente(numIndex, id = '', nombre = '', cantidad = 1, unidad = 'gr') {
        const div = document.createElement('div');
        div.className = 'item-ingrediente-bloque';
        const ocultoClass = nombre ? '' : 'oculto';

        div.innerHTML = `
            <div class="campo-form item-ingrediente">
                <label class="lbl-ingrediente">Ingrediente ${numIndex}</label>
                <input type="hidden" name="ingredientes[]" class="input-ingrediente-id" value="${id}">
                <div class="cont-input-wrapper">
                    <input type="text" class="input-redondeado input-ingrediente-nombre" readonly placeholder="Seleccionar..." value="${nombre}">
                    <button type="button" class="btn-limpiar ${ocultoClass}">&times;</button>
                </div>
            </div>
            <div class="campo-form fila-cantidad-ingrediente">
                <label class="lbl-cantidad">Cantidad</label>
                <div class="cont-control-cantidad">
                    <button type="button" class="btn-cant btn-menos">-</button>
                    <input type="number" name="cantidades[]" class="input-redondeado input-cantidad" value="${cantidad}" min="1" step="any">
                    <button type="button" class="btn-cant btn-mas">+</button>
                    <span class="unidad-medida">${unidad}</span>
                </div>
            </div>
        `;
        return div;
    }

    // ==========================================
    // 3. CARGAR DATOS DEL PLATO Y ESTADO
    // ==========================================
    async function cargarPlato() {
        try {
            const res = await fetch(`/api/platos/${id_plato}`);
            if (!res.ok) return;
            const plato = await res.json();

            if (plato) {
                if (inputNombre) inputNombre.value = plato.nombre || '';
                if (inputDescripcion) inputDescripcion.value = plato.descripcion || '';
                
                if (inputCategoria) {
                    let catVal = plato.nombre_categoria || plato.categoria_nombre || plato.categoria || '';
                    if (categoriasMap[catVal]) {
                        catVal = categoriasMap[catVal];
                    }
                    inputCategoria.value = catVal;
                    if (btnLimpiarCat && catVal !== '') btnLimpiarCat.classList.remove('oculto');
                }

                if (inputEstado) {
                    const valorEstado = String(plato.estado).toLowerCase().trim();
                    inputEstado.checked = (valorEstado === 'activo' || valorEstado === '1' || valorEstado === 'true');
                    actualizarTextoEstado();
                }

                if (imgPreview && plato.img_plato) {
                    imgPreview.src = plato.img_plato.startsWith('http') || plato.img_plato.startsWith('data:')
                        ? plato.img_plato 
                        : `/img_remy/${plato.img_plato}`;
                }
            }
        } catch (err) {
            console.error('Error al cargar plato:', err);
        }
    }

    async function cargarIngredientesPlato() {
        try {
            const res = await fetch(`/api/platos/${id_plato}/ingredientes`);
            if (!res.ok) return;
            const ingredientes = await res.json();

            if (contenedorIngredientes) {
                contenedorIngredientes.innerHTML = '';

                if (Array.isArray(ingredientes) && ingredientes.length > 0) {
                    ingredientes.forEach((ing, idx) => {
                        const idIng = ing.id_ingrediente || ing.id || '';
                        const nomIng = ing.nombre || '';
                        const cantIng = ing.cantidad || 1;
                        const uniIng = ing.unidad || ing.unidad_medida || ing.unidad_minima || 'gr';

                        const bloque = crearBloqueIngrediente(idx + 1, idIng, nomIng, cantIng, uniIng);
                        contenedorIngredientes.appendChild(bloque);
                    });
                }

                // Si trae menos de 2 ingredientes desde la BD, forzamos que existan mínimamente 2 filas
                let totalActual = contenedorIngredientes.querySelectorAll('.item-ingrediente-bloque').length;
                while (totalActual < 2) {
                    totalActual++;
                    contenedorIngredientes.appendChild(crearBloqueIngrediente(totalActual));
                }
            }
        } catch (err) {
            console.error('Error al cargar ingredientes del plato:', err);
            if (contenedorIngredientes) {
                contenedorIngredientes.innerHTML = '';
                contenedorIngredientes.appendChild(crearBloqueIngrediente(1));
                contenedorIngredientes.appendChild(crearBloqueIngrediente(2));
            }
        }
    }

    // ==========================================
    // 4. EVENTOS E INTERACCIONES
    // ==========================================
    if (contenedorIngredientes) {
        contenedorIngredientes.addEventListener('click', (e) => {
            // 1. Limpieza individual de un ingrediente (X)
            if (e.target.classList.contains('btn-limpiar')) {
                e.preventDefault();
                e.stopPropagation();
                const bloque = e.target.closest('.item-ingrediente-bloque');
                if (bloque) {
                    const inputId = bloque.querySelector('.input-ingrediente-id');
                    const inputNombre = bloque.querySelector('.input-ingrediente-nombre');
                    const spanUnidad = bloque.querySelector('.unidad-medida');

                    if (inputId) inputId.value = '';
                    if (inputNombre) inputNombre.value = '';
                    if (spanUnidad) spanUnidad.textContent = 'gr';

                    e.target.classList.add('oculto');
                }
                return; // Evita abrir la lista desplegable
            }

            // 2. Abrir Modal de selección
            const inputTarget = e.target.closest('.input-ingrediente-nombre') || e.target.closest('.cont-input-wrapper');
            if (inputTarget) {
                const bloque = e.target.closest('.item-ingrediente-bloque');
                if (bloque) {
                    itemIngredienteActual = bloque;
                    abrirSuperficieIngredientes();
                }
            }

            // 3. Controles de cantidad (- / +)
            if (e.target.classList.contains('btn-menos')) {
                const inputCant = e.target.nextElementSibling;
                let val = parseFloat(inputCant.value) || 1;
                if (val > 1) inputCant.value = val - 1;
            }

            if (e.target.classList.contains('btn-mas')) {
                const inputCant = e.target.previousElementSibling;
                let val = parseFloat(inputCant.value) || 0;
                inputCant.value = val + 1;
            }
        });
    }

    // Botón para agregar una nueva fila (+)
    if (btnAgregarIngrediente) {
        btnAgregarIngrediente.addEventListener('click', () => {
            const numIndex = contenedorIngredientes.querySelectorAll('.item-ingrediente-bloque').length + 1;
            contenedorIngredientes.appendChild(crearBloqueIngrediente(numIndex));
        });
    }

    // Botón para quitar la última fila (-): No permite borrar si quedan 2 o menos
    if (btnQuitarIngrediente) {
        btnQuitarIngrediente.addEventListener('click', () => {
            const items = contenedorIngredientes.querySelectorAll('.item-ingrediente-bloque');
            if (items.length > 2) {
                contenedorIngredientes.removeChild(items[items.length - 1]);
            }
        });
    }

    if (inputFoto) {
        inputFoto.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => imgPreview.src = event.target.result;
                reader.readAsDataURL(file);
            }
        });
    }

    // ==========================================
    // 5. ENVIAR FORMULARIO (UPDATE PLATO Y ESTADO)
    // ==========================================
    if (formModificarPlato) {
        formModificarPlato.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(formModificarPlato);
            formData.set('estado', inputEstado && inputEstado.checked ? 'Activo' : 'Inactivo');

            try {
                const res = await fetch(`/api/platos/${id_plato}`, {
                    method: 'PUT',
                    body: formData
                });

                const resultado = await res.json();

                if (res.ok && resultado.status === 'success') {
                    window.location.href = '/platos_menu';
                } else {
                    alert('Error: ' + (resultado.message || 'No se pudo actualizar el plato.'));
                }
            } catch (err) {
                console.error('Error al guardar cambios:', err);
                alert('No se pudo conectar con el servidor.');
            }
        });
    }

    await cargarIngredientesDesdeDB();
    await cargarPlato();
    await cargarIngredientesPlato();
});