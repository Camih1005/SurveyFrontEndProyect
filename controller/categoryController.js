// controller/categoryController.js
import { getCategories, createCategory } from '../model/surveyCategory/category.js';
import { renderCategories, getFormData } from '../view/categoryView.js';

export async function initialize() {
    // Carga inicial de categorías
    try {
        const categories = await getCategories();
        renderCategories(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }

    const form = document.getElementById('form12');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const newCategory = getFormData();

        try {
            await createCategory(newCategory);
            console.log('Category created:', newCategory);

            // Actualiza la lista de categorías después de crear una nueva categoría
            const categories = await getCategories();
            renderCategories(categories);
        } catch (error) {
            console.error('Error creating category:', error);
        }
    });
}
