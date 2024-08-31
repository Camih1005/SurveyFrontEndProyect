
    // URL del endpoint para crear una categoría
    const createCategoryUrl = 'https://radiant-growth-production.up.railway.app/api/SurveyCategory';

    // Datos de la nueva categoría que deseas enviar
    const newCategory = {
        name: 'chrisd', // Reemplaza con los datos adecuados
    };

    // Realizar la solicitud POST
    fetch(createCategoryUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Especifica que el contenido es JSON
        },
        body: JSON.stringify(newCategory) // Convierte el objeto newCategory a formato JSON
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Network response was not ok: ${response.statusText} - ${text}`);
            });
        }
        return response.json(); // Analiza la respuesta JSON
    })
    .then(data => {
        console.log('Category created:', data); // Maneja la nueva categoría creada
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error); // Maneja errores de la solicitud
    });

    // URL del endpoint para obtener todas las categorías
    const getCategoriesUrl = 'https://radiant-growth-production.up.railway.app/api/SurveyCategory';

    // Función para actualizar el contenido del HTML con los datos obtenidos
    function updateCategoryDetails(categories) {
        const detailsContainer = document.getElementById('listCat');

        // Limpia el contenido actual
        detailsContainer.innerHTML = '';

        // Asegúrate de que `categories` es un array
        if (Array.isArray(categories)) {
            categories.forEach(category => {
                // Crear un nuevo elemento `li` para cada categoría
                const categoryItem = document.createElement('li');
                categoryItem.className = 'dropdown-item';
                categoryItem.innerHTML = `<a class="dropdown-item" href="#">${category.name}</a>`;
                
                // Añadir el nuevo elemento `li` a la lista
                detailsContainer.appendChild(categoryItem);
            });
        } else {
            console.error('Expected an array of categories');
        }
    }

    // Realizar la solicitud GET para obtener las categorías
    fetch(getCategoriesUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                throw new Error(`Network response was not ok: ${response.statusText} - ${text}`);
            });
        }
        return response.json(); // Analiza la respuesta JSON
    })
    .then(data => {
        console.log('Categories fetched:', data);
        updateCategoryDetails(data); // Actualiza el contenido del HTML con las categorías obtenidas
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error); // Maneja errores de la solicitud
    });

