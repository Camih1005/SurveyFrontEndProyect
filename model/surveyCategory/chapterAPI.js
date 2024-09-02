import { postSurvey } from "../surveyCategory/surveyAPI.js";

// Función para crear un capítulo
export async function createChapter() {
    try {
        // Espera a que se cree la encuesta y obtén el ID
        const idSurvey = await postSurvey();
        console.log('ID de la encuesta:', idSurvey);

        // Construye la URL con el ID de la encuesta
        const URL = `https://radiant-growth-production.up.railway.app/api/chapter/${idSurvey}`;
        
        // Crea el capítulo
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                chapterTitle: "ejemplocacas", 
                chapterNumber: 3 // Asegúrate de que sea del tipo correcto (número si es necesario)
            }),
        });

        if (!response.ok) {
            // Lee el texto de error para más detalles
            const text = await response.text();
            throw new Error(`Error: ${response.status} - ${text}`);
        }

        const result = await response.json();
        console.log('Capítulo creado con ID:', result.id);
        console.log('Número del capítulo:', result.chapterNumber); // Muestra el número del capítulo
        return { id: result.id, chapterNumber: result.chapterNumber };

    } catch (error) {
        console.error('Error al crear capítulo:', error);
    }
}

