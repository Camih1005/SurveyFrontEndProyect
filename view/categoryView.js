
export function renderCategories(categories) {
    const detailsContainer = document.getElementById('listCat');
    detailsContainer.innerHTML = '';

    if (Array.isArray(categories)) {
        categories.forEach(category => {
            const categoryItem = document.createElement('li');
            
            categoryItem.className = 'dropdown-item';
            categoryItem.innerHTML = `<a id="idcat-${category.id}" class="dropdown-item" href="#">${category.name}</a>`;
            detailsContainer.appendChild(categoryItem);
        });
    } else {
        console.error('Expected an array of categories');
    }
}


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

