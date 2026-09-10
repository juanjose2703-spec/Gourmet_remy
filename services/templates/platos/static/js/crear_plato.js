document.addEventListener('DOMContentLoaded', () => {
    const formAnadirPlato = document.getElementById('form_anadir_plato');
    const inputFoto = document.getElementById('input_foto');
    const imgPreview = document.getElementById('img_preview');
    const inputCategoria = document.getElementById('input_categoria');
    const contenedorIngredientes = document.getElementById('contenedor_ingredientes');
    const btnAgregarIngrediente = document.getElementById('btn_agregar_ingrediente');
    const btnQuitarIngrediente = document.getElementById('btn_quitar_ingrediente');
    
    const modalCategoria = document.getElementById('modal_categoria');
    const modalIngredientes = document.getElementById('modal_ingredientes');
    const btnCerrarModalCat = document.getElementById('btn_cerrar_modal_cat');
    const btnCerrarModalIng = document.getElementById('btn_cerrar_modal_ing');
    
    let itemIngredienteActual = null;

    async function cargarIngredientesDesdeDB() {
        try {
            const respuesta = await fetch('/api/ingredientes');
            const ingredientes = await respuesta.json();
            const listaModal = document.getElementById('lista_ingredientes');
            
            if (listaModal && Array.isArray(ingredientes)) {
                listaModal.innerHTML = ingredientes.map(ing => 
                    `<li data-id="${ing.id_ingrediente}" data-nombre="${ing.nombre}">${ing.nombre}</li>`
                ).join('');
            }
        } catch (error) {
            console.error('Error al cargar ingredientes desde MySQL:', error);
        }
    }

    cargarIngredientesDesdeDB();

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
                modalCategoria.close();
            }
        });
    }

    if (btnCerrarModalCat) {
        btnCerrarModalCat.addEventListener('click', () => modalCategoria.close());
    }

    if (contenedorIngredientes) {
        contenedorIngredientes.addEventListener('click', (e) => {
            if (e.target.classList.contains('input-ingrediente-nombre')) {
                itemIngredienteActual = e.target.closest('.item-ingrediente');
                if (modalIngredientes && typeof modalIngredientes.showModal === 'function') {
                    modalIngredientes.showModal();
                }
            }
        });
    }

    const listaIngredientes = document.getElementById('lista_ingredientes');
    if (listaIngredientes) {
        listaIngredientes.addEventListener('click', (e) => {
            if (e.target.tagName === 'LI' && itemIngredienteActual) {
                const idIngrediente = e.target.getAttribute('data-id');
                const nombreIngrediente = e.target.getAttribute('data-nombre');

                itemIngredienteActual.querySelector('.input-ingrediente-id').value = idIngrediente;
                itemIngredienteActual.querySelector('.input-ingrediente-nombre').value = nombreIngrediente;
                
                modalIngredientes.close();
            }
        });
    }

    if (btnCerrarModalIng) {
        btnCerrarModalIng.addEventListener('click', () => modalIngredientes.close());
    }

    if (btnAgregarIngrediente) {
        btnAgregarIngrediente.addEventListener('click', () => {
            const cantidad = contenedorIngredientes.querySelectorAll('.item-ingrediente').length + 1;
            const nuevoDiv = document.createElement('div');
            nuevoDiv.className = 'campo-form item-ingrediente';
            nuevoDiv.innerHTML = `
                <label>Ingrediente ${cantidad}</label>
                <input type="hidden" name="ingredientes[]" class="input-ingrediente-id">
                <input type="text" class="input-redondeado input-ingrediente-nombre" readonly placeholder="Seleccionar...">
            `;
            contenedorIngredientes.appendChild(nuevoDiv);
        });
    }

    if (btnQuitarIngrediente) {
        btnQuitarIngrediente.addEventListener('click', () => {
            const items = contenedorIngredientes.querySelectorAll('.item-ingrediente');
            if (items.length > 1) {
                contenedorIngredientes.removeChild(items[items.length - 1]);
            }
        });
    }

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