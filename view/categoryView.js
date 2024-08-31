// view/categoryView.js

// Actualiza la lista de categorías en la interfaz de usuario
export function renderCategories(categories) {
    const detailsContainer = document.getElementById('listCat');
    detailsContainer.innerHTML = '';

    if (Array.isArray(categories)) {
        categories.forEach(category => {
            const categoryItem = document.createElement('li');
            categoryItem.className = 'dropdown-item';
            categoryItem.innerHTML = `<a class="dropdown-item" href="#">${category.name}</a>`;
            detailsContainer.appendChild(categoryItem);
        });
    } else {
        console.error('Expected an array of categories');
    }
}

// Obtén el valor del input del formulario
export function getFormData() {
    const ej = document.getElementById('categoryName').value;
    return { name: ej };
}
