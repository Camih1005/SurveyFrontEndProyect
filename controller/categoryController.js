// controller/categoryController.js
import { getCategories, createCategory,DeleteCategoryByName} from '../model/surveyCategory/category.js';
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
            alert("categoria creada");

            // Actualiza la lista de categorías después de crear una nueva categoría
            const categories = await getCategories();
            renderCategories(categories);
        } catch (error) {
            // alert("No se pudo crear la categoria");
            console.error('Error creating category:', error);
        }
    });
}


export function DeleteCategory(){
    const formDeleteCategory = document.getElementById("form13");
    formDeleteCategory.addEventListener("submit",async (e)=>{
        const CategoryName = document.getElementById('categorynameDelete').value;
        if(!CategoryName == ""){
            const lowerCasecat = CategoryName.toLowerCase();
            console.log(lowerCasecat);
            const Eliminar = await DeleteCategoryByName(lowerCasecat);
            if(Eliminar===true){
                alert("categoria eliminada correctamente");
            }
        }
        else{
            alert("el campo no puede ser vacio")
        }
        e.preventDefault();
        e.stopPropagation();

    })
}
