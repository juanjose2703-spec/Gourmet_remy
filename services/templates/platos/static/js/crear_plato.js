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
    const modalIngredientes = document.getElementById('modal_ingredientes');
    const btnCerrarModalCat = document.getElementById('btn_cerrar_modal_cat');
    const btnCerrarModalIng = document.getElementById('btn_cerrar_modal_ing');
    
    let itemIngredienteActual = null;

    // Cargar Ingredientes desde la API
    async function cargarIngredientesDesdeDB() {
        try {
            const respuesta = await fetch('/api/ingredientes');
            const ingredientes = await respuesta.json();
            const listaModal = document.getElementById('lista_ingredientes');
            
            if (listaModal && Array.isArray(ingredientes)) {
                listaModal.innerHTML = ingredientes.map(ing => {
                    // Detecta la unidad de cualquiera de las variantes posibles
                    const unidad = ing.unidad || ing.unidad_minima || ing.unidad_medida || 'gr';
                    
                    // Solo imprime el nombre en el texto visual del modal
                    return `<li data-id="${ing.id_ingrediente}" data-nombre="${ing.nombre}" data-unidad="${unidad}">${ing.nombre}</li>`;
                }).join('');
            }
        } catch (error) {
            console.error('Error al cargar ingredientes desde MySQL:', error);
        }
    }

    cargarIngredientesDesdeDB();

    // Manejo de Vista Previa de Imagen
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

    // Modal Categoría
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
                btnLimpiarCat.classList.remove('oculto');
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

    // Abrir Modal de Ingredientes y delegación para botones X y +/-
    if (contenedorIngredientes) {
        contenedorIngredientes.addEventListener('click', (e) => {
            // Abrir modal de selección
            if (e.target.classList.contains('input-ingrediente-nombre')) {
                itemIngredienteActual = e.target.closest('.item-ingrediente-bloque');
                if (modalIngredientes && typeof modalIngredientes.showModal === 'function') {
                    modalIngredientes.showModal();
                }
            }

            // Botón Limpiar (X) en Ingrediente
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

            // Botón Menos (-) en Cantidad de ingrediente
            if (e.target.classList.contains('btn-menos')) {
                const inputCant = e.target.nextElementSibling;
                let val = parseFloat(inputCant.value) || 1;
                if (val > 1) {
                    inputCant.value = val - 1;
                }
            }

            // Botón Más (+) en Cantidad de ingrediente
            if (e.target.classList.contains('btn-mas')) {
                const inputCant = e.target.previousElementSibling;
                let val = parseFloat(inputCant.value) || 0;
                inputCant.value = val + 1;
            }
        });
    }

    // Selección de Ingrediente dentro del Modal
    const listaIngredientes = document.getElementById('lista_ingredientes');
    if (listaIngredientes) {
        listaIngredientes.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            if (li && itemIngredienteActual) {
                const idIngrediente = li.getAttribute('data-id');
                const nombreIngrediente = li.getAttribute('data-nombre');
                const unidadIngrediente = li.getAttribute('data-unidad') || 'gr';

                itemIngredienteActual.querySelector('.input-ingrediente-id').value = idIngrediente;
                
                const inputNombre = itemIngredienteActual.querySelector('.input-ingrediente-nombre');
                inputNombre.value = nombreIngrediente;
                
                const btnLimpiar = itemIngredienteActual.querySelector('.btn-limpiar');
                if (btnLimpiar) btnLimpiar.classList.remove('oculto');

                // Actualiza la unidad de medida al lado de los botones + / -
                const spanUnidad = itemIngredienteActual.querySelector('.unidad-medida');
                if (spanUnidad) spanUnidad.textContent = unidadIngrediente;

                modalIngredientes.close();
            }
        });
    }

    if (btnCerrarModalIng) {
        btnCerrarModalIng.addEventListener('click', () => modalIngredientes.close());
    }

    // Agregar nueva fila de Ingrediente
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

    // Eliminar última fila de Ingrediente
    if (btnQuitarIngrediente) {
        btnQuitarIngrediente.addEventListener('click', () => {
            const items = contenedorIngredientes.querySelectorAll('.item-ingrediente-bloque');
            if (items.length > 1) {
                contenedorIngredientes.removeChild(items[items.length - 1]);
            }
        });
    }

    // Guardar Formulario
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
                console.error('Error de red/servidor:', error);
                alert('No se pudo conectar con el servidor.');
            }
        });
    }
});