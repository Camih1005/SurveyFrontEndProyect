// model/category.js

// Función para obtener todas las categorías
export async function getCategories() {
    const getCategoriesUrl = 'https://radiant-growth-production.up.railway.app/api/SurveyCategory';
    
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

    return response.json();
}

// Función para crear una nueva categoría
export async function createCategory(newCategory) {
    const createCategoryUrl = 'https://radiant-growth-production.up.railway.app/api/SurveyCategory';
    
    const response = await fetch(createCategoryUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCategory)
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Network response was not ok: ${response.statusText} - ${text}`);
    }

    return response.json();
}
