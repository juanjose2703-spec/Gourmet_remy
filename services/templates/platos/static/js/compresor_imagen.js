/**
 * Procesa y reduce el tamaño/peso de un archivo de imagen utilizando un HTML5 Canvas.
 * 
 * @param {File} archivoImagen - El archivo de imagen obtenido desde un input de tipo file.
 * @param {Object} opciones - Configuración de la compresión.
 * @param {number} [opciones.anchoMaximo=1080] - Ancho máximo en píxeles.
 * @param {number} [opciones.altoMaximo=1080] - Alto máximo en píxeles.
 * @param {number} [opciones.calidad=0.75] - Calidad de salida (0.1 a 1.0).
 * @returns {Promise<File>} Archivo comprimido en formato File (mantiene el nombre original).
 */
async function procesarYReducirImagen(archivoImagen, opciones = {}) {
    // Si no viene ningún archivo o no es de tipo imagen, retornamos el archivo tal cual
    if (!archivoImagen || !(archivoImagen instanceof File) || !archivoImagen.type.startsWith('image/')) {
        return archivoImagen;
    }

    const {
        anchoMaximo = 1080,
        altoMaximo = 1080,
        calidad = 0.75
    } = opciones;

    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();

            img.onload = () => {
                let ancho = img.width;
                let alto = img.height;

                // Cálculo de proporciones (escalado proporcional)
                if (ancho > anchoMaximo || alto > altoMaximo) {
                    if (ancho / alto > anchoMaximo / altoMaximo) {
                        alto = Math.round((alto * anchoMaximo) / ancho);
                        ancho = anchoMaximo;
                    } else {
                        ancho = Math.round((ancho * altoMaximo) / alto);
                        alto = altoMaximo;
                    }
                }

                // Renderizado en canvas
                const canvas = document.createElement('canvas');
                canvas.width = ancho;
                canvas.height = alto;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, ancho, alto);

                // Exportación como Blob comprimido en WebP/JPEG
                const tipoSalida = archivoImagen.type === 'image/png' ? 'image/webp' : archivoImagen.type;

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            resolve(archivoImagen); // Fallback si falla la conversión
                            return;
                        }

                        // Reconstruimos el objeto File original con el nuevo Blob comprimido
                        const nuevoArchivo = new File([blob], archivoImagen.name, {
                            type: blob.type,
                            lastModified: Date.now()
                        });

                        resolve(nuevoArchivo);
                    },
                    tipoSalida,
                    calidad
                );
            };

            img.onerror = () => resolve(archivoImagen);
            img.src = e.target.result;
        };

        reader.onerror = () => resolve(archivoImagen);
        reader.readAsDataURL(archivoImagen);
    });
}