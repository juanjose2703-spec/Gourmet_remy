document.addEventListener('DOMContentLoaded', () => {
    const formAnadirPlato = document.getElementById('form_anadir_plato');
    const inputFoto = document.getElementById('input_foto');
    const imgPreview = document.getElementById('img_preview');
    const inputCategoria = document.getElementById('input_categoria');
    const btnLimpiarCat = document.getElementById('btn_limpiar_cat');
    
    const contenedorIngredientes = document.getElementById('contenedor_ingredientes');
    const btnAgregarIngrediente = document.getElementById('btn_agregar_ingrediente');
    const btnQuitarIngrediente = document.getElementById('btn_quitar_ingrediente');
    
    const modalCategoria = document.getElementById('modal_categoria');
    const btnCerrarModalCat = document.getElementById('btn_cerrar_modal_cat');

    // Elementos del modal de ingredientes
    const superficieModalIngredientes = document.getElementById('superficie_modal_ingredientes');
    const inputBuscarIngrediente = document.getElementById('input_buscar_ingrediente');
    const listaIngredientesContenedor = document.getElementById('lista_ingredientes');

    let itemIngredienteActual = null;
    let todosLosIngredientes = [];

    // Cargar ingredientes desde la API
    async function cargarIngredientesDesdeDB() {
        try {
            const respuesta = await fetch('/api/ingredientes');
            if (!respuesta.ok) return;

            const data = await respuesta.json();
            const arrayBruto = Array.isArray(data) ? data : (data.data || []);

            // Mapeo ajustado a tu respuesta real de MySQL (id_ingrediente, nombre, unidad_minima)
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

    // Carga inicial
    cargarIngredientesDesdeDB();

    // Renderizar tarjetas en la ventana emergente
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

    // Buscador en vivo
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

    // Abrir modal
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

    // Eventos al tocar el campo de ingrediente
    if (contenedorIngredientes) {
        contenedorIngredientes.addEventListener('click', (e) => {
            const inputTarget = e.target.closest('.input-ingrediente-nombre') || e.target.closest('.cont-input-wrapper');
            
            if (inputTarget) {
                if (e.target.classList.contains('btn-limpiar')) return;

                const bloque = e.target.closest('.item-ingrediente-bloque');
                if (bloque) {
                    itemIngredienteActual = bloque;
                    abrirSuperficieIngredientes();
                }
            }

            // Limpiar selección
            if (e.target.classList.contains('btn-limpiar')) {
                e.stopPropagation();
                const bloque = e.target.closest('.item-ingrediente-bloque');
                if (bloque) {
                    bloque.querySelector('.input-ingrediente-id').value = '';
                    bloque.querySelector('.input-ingrediente-nombre').value = '';
                    bloque.querySelector('.unidad-medida').textContent = 'gr';
                    e.target.classList.add('oculto');
                }
            }

            // Controles de cantidad (- / +)
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

    // Agregar nueva fila
    if (btnAgregarIngrediente) {
        btnAgregarIngrediente.addEventListener('click', () => {
            const cantidad = contenedorIngredientes.querySelectorAll('.item-ingrediente-bloque').length + 1;
            const nuevoBloque = document.createElement('div');
            nuevoBloque.className = 'item-ingrediente-bloque';
            nuevoBloque.innerHTML = `
                <div class="campo-form item-ingrediente">
                    <label class="lbl-ingrediente">Ingrediente ${cantidad}</label>
                    <input type="hidden" name="ingredientes[]" class="input-ingrediente-id">
                    <div class="cont-input-wrapper">
                        <input type="text" class="input-redondeado input-ingrediente-nombre" readonly placeholder="Seleccionar...">
                        <button type="button" class="btn-limpiar oculto">&times;</button>
                    </div>
                </div>
                <div class="campo-form fila-cantidad-ingrediente">
                    <label class="lbl-cantidad">Cantidad</label>
                    <div class="cont-control-cantidad">
                        <button type="button" class="btn-cant btn-menos">-</button>
                        <input type="number" name="cantidades[]" class="input-redondeado input-cantidad" value="1" min="1" step="any">
                        <button type="button" class="btn-cant btn-mas">+</button>
                        <span class="unidad-medida">gr</span>
                    </div>
                </div>
            `;
            contenedorIngredientes.appendChild(nuevoBloque);
        });
    }

    // Quitar fila
    if (btnQuitarIngrediente) {
        btnQuitarIngrediente.addEventListener('click', () => {
            const items = contenedorIngredientes.querySelectorAll('.item-ingrediente-bloque');
            if (items.length > 1) {
                contenedorIngredientes.removeChild(items[items.length - 1]);
            }
        });
    }

    // Vista previa de imagen
    if (inputFoto) {
        inputFoto.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => imgPreview.src = e.target.result;
                reader.readAsDataURL(file);
            }
        });
    }

    // Modal Categorías
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
                inputCategoria.value = e.target.getAttribute('data-valor');
                if (btnLimpiarCat) btnLimpiarCat.classList.remove('oculto');
                modalCategoria.close();
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
        btnCerrarModalCat.addEventListener('click', () => modalCategoria.close());
    }

    // Enviar formulario
    if (formAnadirPlato) {
        formAnadirPlato.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(formAnadirPlato);

            try {
                const response = await fetch('/api/platos/insertar', {
                    method: 'POST',
                    body: formData
                });

                const resultado = await response.json();

                if (response.ok && resultado.status === 'success') {
                    window.location.href = '/platos_menu';
                } else {
                    alert('Error: ' + (resultado.message || 'No se pudo guardar el plato.'));
                }
            } catch (error) {
                console.error('Error al guardar plato:', error);
                alert('No se pudo conectar con el servidor.');
            }
        });
    }
});