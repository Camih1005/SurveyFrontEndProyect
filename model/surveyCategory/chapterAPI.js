// Función para enviar datos del capítulo
export async function createChapter(survey,chapter) {
    try {
        // Cambia la URL para incluir el ID de la encuesta si es necesario
        const URL = `https://radiant-growth-production.up.railway.app/api/chapter/${survey}`;
        
        // Muestra los datos enviados para depuración
        console.log('Datos enviados al servidor para crear capítulo:', chapter);
        
        // Crea el capítulo
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(chapter)
        });

        if (!response.ok) {
            // Lee el texto de error para más detalles
            const text = await response.text();
            throw new Error(`Error: ${response.status} - ${text}`);
        }

        const result = await response.json();
        console.log('Capítulo creado con ID:', result.id);
        console.log('Número del capítulo:', result.chapterNumber || 'Número no disponible'); // Muestra el número del capítulo
        return { id: result.id, chapterNumber: result.chapter_Number,chapter_title:  result.chapter_title };

    } catch (error) {
        console.error('Error al crear capítulo:', error);
        throw error;
    }
}