document.addEventListener('DOMContentLoaded', async () => {

    const categorias = {1: 'Entrada', 2: 'Plato Fuerte', 3: 'Postre', 4: 'Bebida'};
    const IMAGEN_DEFAULT = '/static/img/dummy_remy.png';

    const partes = window.location.pathname.split('/');
    const id_plato = partes[partes.length - 1];

    if (!id_plato) return;

    function obtenerRutaImagen(img) {
        if (!img || img.trim() === '') return IMAGEN_DEFAULT;
        if (img.startsWith('http://') || img.startsWith('https://')) return img;
        return `/img_remy/${img}`;
    }

    try {
        const responsePlato = await fetch(`/api/platos/${id_plato}`);
        if (responsePlato.ok) {
            const plato = await responsePlato.json();

            if (plato) {
                const imgElement = document.getElementById('img_plato');
                imgElement.src = obtenerRutaImagen(plato.img_plato);
                imgElement.alt = plato.nombre || 'Plato';
                imgElement.onerror = () => { imgElement.src = IMAGEN_DEFAULT; };

                document.getElementById('nombre_plato').textContent = plato.nombre ? plato.nombre.toUpperCase() : 'SIN TÍTULO';
                document.getElementById('descripcion_plato').textContent = plato.descripcion || 'Sin descripción disponible.';
                document.getElementById('categoria_plato').textContent = categorias[plato.categoria] || 'Sin categoría';
                document.getElementById('fecha_plato').textContent = plato.fecha_creacion ? plato.fecha_creacion.split('T')[0] : 'Sin fecha';
                document.getElementById('selector_estado_activo').checked = plato.estado === 'Activo';
            }
        }

        const responseIng = await fetch(`/api/platos/${id_plato}/ingredientes`);
        const tbody = document.getElementById('tbody_ingredientes');
        tbody.innerHTML = '';

        if (responseIng.ok) {
            const ingredientes = await responseIng.json();

            if (Array.isArray(ingredientes) && ingredientes.length > 0) {
                ingredientes.forEach(ing => {
                    tbody.innerHTML += `
                        <tr>
                            <td>${ing.nombre}</td>
                            <td>${ing.cantidad}</td>
                            <td>${ing.unidad}</td>
                        </tr>
                    `;
                });
            } else {
                tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;">No hay ingredientes registrados.</td></tr>`;
            }
        } else {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;">Error al obtener ingredientes.</td></tr>`;
        }

    } catch (error) {
        console.error('Error al cargar el detalle del plato:', error);
    }
});