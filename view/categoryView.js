
export function renderCategories(categories) {
    const selectElement = document.getElementById('floatingSelect');
    selectElement.innerHTML = '';  // Limpia el contenido del select

    if (Array.isArray(categories)) {
        // Agrega una opción por defecto
        const defaultOption = document.createElement('option');
        defaultOption.textContent = 'Open this select menu';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        selectElement.appendChild(defaultOption);

        // Agrega las opciones de categorías
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.value;  // Valor de la opción
            option.textContent = category.name;  // Texto visible de la opción

            // Asignar un id al elemento select, no a la opción
            option.setAttribute('data-id', `idcat-${category.id}`); // Usa un atributo data-id para el ID

            selectElement.appendChild(option);
        });
    } else {
        console.error('Expected an array of categories');
    }
}



// export function renderCategories(categories) {
//     const detailsContainer = document.getElementById('listCat');
//     detailsContainer.innerHTML = '';

//     if (Array.isArray(categories)) {
//         categories.forEach(category => {
//             const categoryItem = document.createElement('li');
            
//             categoryItem.className = 'dropdown-item';
//             categoryItem.innerHTML = `<a id="idcat-${category.id}" class="dropdown-item" href="#">${category.name}</a>`;
//             detailsContainer.appendChild(categoryItem);
//         });
//     } else {
//         console.error('Expected an array of categories');
//     }


export function getFormData() {
    
    const ej = document.getElementById('categoryName').value; 
    if(!ej == ""){
        const lowerCaseEj = ej.toLowerCase(); 
        console.log(lowerCaseEj); 
        return { name: lowerCaseEj };
    }
    else{
        alert("el campo no puede ser vacio")
    }
    
}

