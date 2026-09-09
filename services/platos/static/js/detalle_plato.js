document.addEventListener('DOMContentLoaded', async () => {

    const categorias = {1: 'Entrada', 2: 'Plato Fuerte', 3: 'Postre', 4: 'Bebida'};

    // Obtener el id_plato desde la URL
    const partes = window.location.pathname.split('/');
    const id_plato = partes[partes.length - 1];

    if (!id_plato) return;

    try {
        // Cargar datos del plato
        const responsePlato = await fetch(`http://localhost:5085/platos/${id_plato}`);
        const plato = await responsePlato.json();

        if (!plato) return;

        document.getElementById('img_plato').src = plato.img_plato || '';
        document.getElementById('img_plato').alt = plato.nombre;
        document.getElementById('nombre_plato').textContent = plato.nombre.toUpperCase();
        document.getElementById('descripcion_plato').textContent = plato.descripcion;
        document.getElementById('categoria_plato').textContent = categorias[plato.categoria] || 'Sin categoría';
        document.getElementById('fecha_plato').textContent = plato.fecha_creacion ? plato.fecha_creacion.split('T')[0] : 'Sin fecha';

        const checkbox = document.getElementById('selector_estado_activo');
        checkbox.checked = plato.estado === 'Activo';

        // Cargar ingredientes del plato
        const responseIng = await fetch(`http://localhost:5085/platos/${id_plato}/ingredientes`);
        const ingredientes = await responseIng.json();
        const tbody = document.getElementById('tbody_ingredientes');
        tbody.innerHTML = '';

        ingredientes.forEach(ing => {
            tbody.innerHTML += `
                <tr>
                    <td>${ing.nombre}</td>
                    <td>${ing.stock}</td>
                    <td>${ing.unidad}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.error('Error al cargar el detalle del plato:', error);
    }
});