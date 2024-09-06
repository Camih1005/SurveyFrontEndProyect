export async function getQuestion(chapterId) {
    const getCategoriesUrl = `https://radiant-growth-production.up.railway.app/api/question/${chapterId}`;
    
    const response = await fetch(getCategoriesUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Network response was not ok: ${response.statusText} - ${text}`);
    }
    console.log("ejemplo chapter pa",JSON.stringify(response.json) || "no retorna nada question" )
    return response.json();
}


export async function postQuestion(question,chapterId) {
    const crearQuestion = `https://radiant-growth-production.up.railway.app/api/question/${chapterId}`;
    
    try {
        const response = await fetch(crearQuestion, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(question) // Asegúrate de que esto es lo que el servidor espera
        });

        if (!response.ok) {
            // Lee la respuesta de error si existe
            const text = await response.text();
            console.error(`Error: ${response.status} - ${text}`);
            throw new Error(`Network response was not ok: ${response.statusText} - ${text}`);
        }

        // Procesa la respuesta JSON
        const data = await response.json();
        console.log("question creada", data);
        
        // Usa el ID de la encuesta si se proporciona
       
        
        return data; // Retorna el ID de la encuesta creada

    } catch (error) {
        // Captura y muestra cualquier error en la solicitud
        console.error('Error al crear question:', error);
        throw error;
    }
}

