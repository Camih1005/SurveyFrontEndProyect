
 export async function getSurveysByCatId(idcat) {
    const url = `https://radiant-growth-production.up.railway.app/api/surveys/${idcat}`;
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Network response was not ok: ${response.statusText} - ${text}`);
    }

    return response.json();
}




// const surveys = 
//     { "description": "salud",
//      "name": "camiloessee" }
// ;

// Función para crear una nueva categoría


export async function postSurvey(surveys,idca) {
    const createSurveyUrl = `https://radiant-growth-production.up.railway.app/api/survey/category/${idca.id}`;
    
    try {
        const response = await fetch(createSurveyUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(surveys) // Asegúrate de que esto es lo que el servidor espera
        });

        if (!response.ok) {
            // Lee la respuesta de error si existe
            const text = await response.text();
            console.error(`Error: ${response.status} - ${text}`);
            throw new Error(`Network response was not ok: ${response.statusText} - ${text}`);
        }

        // Procesa la respuesta JSON
        const data = await response.json();
        console.log('Encuesta creada con éxito:', data , data.id);
        
        // Usa el ID de la encuesta si se proporciona
       
        
        return data.id; // Retorna el ID de la encuesta creada

    } catch (error) {
        // Captura y muestra cualquier error en la solicitud
        console.error('Error al crear encuesta:', error);
        throw error;
    }
}

export async function DeleteSurvey(idSurvey) {
    const url = `https://radiant-growth-production.up.railway.app/api/survey/${idSurvey}`;
    
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            // Lee la respuesta de error si existe
            const text = await response.text();
            console.error(`Error: ${response.status} - ${text}`);
            throw new Error(`Network response was not ok: ${response.statusText} - ${text}`);
        }

        // Procesa la respuesta JSON
        const data = await response.json();
        console.log(data);
        return data; 
}


// // Llamada a la función para probarla
// createCategory().then(data => {
//     console.log('Respuesta del servidor:', data);
// }).catch(error => {
//     console.error('Error en la solicitud:', error);
// });

