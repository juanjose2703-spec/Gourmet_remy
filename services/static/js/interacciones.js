/**
 * REMY 1.0 - JS Global Reutilizable
 */
window.REMY = {
    minIngredientes: 2,
    maxIngredientes: 30,

    // Previsualización de la imagen subida
    previewImagen: function(event) {
        const file = event.target && event.target.files && event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.getElementById('img_preview');
                if (img) img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    },

    // Gestión de Modales Nativos <dialog>
    abrirModal: function(idModal) {
        const modal = document.getElementById(idModal);
        if (modal && typeof modal.showModal === "function") {
            modal.showModal();
        }
    },

    cerrarModal: function(idModal) {
        const modal = document.getElementById(idModal);
        if (modal && typeof modal.close === "function") {
            modal.close();
        }
    },

    seleccionarCategoria: function(valor) {
        const inputCat = document.getElementById('input_categoria');
        if (inputCat) inputCat.value = valor;
        this.cerrarModal('modal_categoria');
    },

    // Agregar nuevo input de ingrediente (Permite pasar un valor por defecto)
    agregarIngrediente: function(valor = '') {
        const contenedor = document.getElementById('contenedor_ingredientes');
        if (!contenedor) return;

        const cantidadActual = contenedor.getElementsByClassName('item-ingrediente').length;

        if (cantidadActual < this.maxIngredientes) {
            const nuevoNumero = cantidadActual + 1;
            const nuevoDiv = document.createElement('div');
            nuevoDiv.className = 'campo-form item-ingrediente';
            nuevoDiv.innerHTML = `
                <label>Ingrediente ${nuevoNumero}</label>
                <input type="text" class="input-redondeado input-ingrediente" readonly value="${valor}" placeholder="Seleccionar..." onclick="REMY.abrirModal('modal_ingredientes')">
            `;
            contenedor.appendChild(nuevoDiv);
        }
    },

    // Eliminar último input de ingrediente (Mínimo 2)
    removerIngrediente: function() {
        const contenedor = document.getElementById('contenedor_ingredientes');
        if (!contenedor) return;

        const elementos = contenedor.getElementsByClassName('item-ingrediente');

        if (elementos.length > this.minIngredientes) {
            contenedor.removeChild(elementos[elementos.length - 1]);
        }
    },

    // Carga los datos existentes en los inputs de la vista modificar
    cargarPlatoExistente: function(datos) {
        if (!datos) return;

        const inputNombre = document.getElementById('input_nombre');
        const inputDesc = document.getElementById('input_descripcion');
        const inputCat = document.getElementById('input_categoria');
        const imgPreview = document.getElementById('img_preview');
        const inputEstado = document.getElementById('input_estado');

        if (inputNombre && datos.nombre) inputNombre.value = datos.nombre;
        if (inputDesc && datos.descripcion) inputDesc.value = datos.descripcion;
        if (inputCat && datos.categoria) inputCat.value = datos.categoria;
        if (imgPreview && datos.imagen) imgPreview.src = datos.imagen;
        if (inputEstado && typeof datos.activo !== 'undefined') {
            inputEstado.checked = Boolean(datos.activo);
        }

        // Cargar la lista de ingredientes dinámicamente
        if (datos.ingredientes && Array.isArray(datos.ingredientes)) {
            const contenedor = document.getElementById('contenedor_ingredientes');
            if (contenedor) {
                contenedor.innerHTML = ''; // Limpia las filas vacías por defecto
                datos.ingredientes.forEach(ing => this.agregarIngrediente(ing));
            }
        }
    }
};

// Carga automática al abrir la vista
document.addEventListener('DOMContentLoaded', function() {
    // Verifica si la página actual es la de modificar mediante su formulario
    const esVistaModificar = document.getElementById('form_modificar_plato') !== null;

    if (esVistaModificar) {
        REMY.cargarPlatoExistente({
            nombre: 'Ceviche Mixto Especial',
            descripcion: 'Ceviche tradicional marinado en jugo de limón, acompañado de cebolla morada, maíz y cilantro.',
            categoria: 'Entrada',
            imagen: 'imagenes/ceviche.jpg',
            activo: true,
            ingredientes: [
                'Pescado Blanco',
                'Camarón',
                'Jugo de Limón',
                'Cebolla Morada',
                'Cilantro'
            ]
        });
    }
});