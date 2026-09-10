/**
 * REMY 1.0 - JS Global Reutilizable (Modificar Plato)
 */
window.REMY = {
    minIngredientes: 2,
    maxIngredientes: 30,

    // Previsualización de la imagen cargada
    previewImagen: function(event) {
        const file = event.target && event.target.files[0];
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

    // Agregar ingrediente con o sin valor inicial
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

    // Eliminar último ingrediente (Mínimo 2)
    removerIngrediente: function() {
        const contenedor = document.getElementById('contenedor_ingredientes');
        if (!contenedor) return;

        const elementos = contenedor.getElementsByClassName('item-ingrediente');
        if (elementos.length > this.minIngredientes) {
            contenedor.removeChild(elementos[elementos.length - 1]);
        }
    },

    // Carga de datos mock del plato existente
    cargarPlatoExistente: function(datos) {
        if (!datos) return;

        const elNombre = document.getElementById('input_nombre');
        const elDesc = document.getElementById('input_descripcion');
        const elCat = document.getElementById('input_categoria');
        const elImg = document.getElementById('img_preview');
        const elEstado = document.getElementById('input_estado');

        if (elNombre && datos.nombre) elNombre.value = datos.nombre;
        if (elDesc && datos.descripcion) elDesc.value = datos.descripcion;
        if (elCat && datos.categoria) elCat.value = datos.categoria;
        if (elImg && datos.imagen) elImg.src = datos.imagen;
        if (elEstado && typeof datos.activo !== 'undefined') {
            elEstado.checked = Boolean(datos.activo);
        }

        // Renderizado dinámico de la lista de ingredientes del plato
        if (datos.ingredientes && Array.isArray(datos.ingredientes)) {
            const contenedor = document.getElementById('contenedor_ingredientes');
            if (contenedor) {
                contenedor.innerHTML = ''; // Limpia campos iniciales
                datos.ingredientes.forEach(ing => this.agregarIngrediente(ing));
            }
        }
    }
};

// Asignación de datos al cargar el DOM
document.addEventListener('DOMContentLoaded', function() {
    REMY.cargarPlatoExistente({
        nombre: 'Ceviche Mixto Especial',
        descripcion: 'Ceviche fresco marinado con marinada de limón, cebolla morada, maíz choclo y cilantro.',
        categoria: 'Entrada',
        imagen: 'imagenes/ceviche.jpg',
        activo: true,
        ingredientes: [
            'Camarón',
            'Pescado Blanco',
            'Limón',
            'Cebolla Morada',
            'Cilantro'
        ]
    });
});