// controller/categoryController.js
import { getCategories, createCategory,DeleteCategoryById} from '../model/surveyCategory/category.js';
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

export function DeleteCategory() {
    const formDeleteCategory = document.getElementById("form13");
    
    formDeleteCategory.addEventListener("submit", (e) => {
        e.preventDefault();  // Evita que el formulario se envíe automáticamente
        
        const CategoryId = document.getElementById('categorynameDelete').value;
        
        if (CategoryId.trim() === "") {
            showAlert("El campo no puede ser vacío", "danger");
            return;  // Sale de la función si el campo está vacío
        }

        // Crea el modal de confirmación de eliminación dinámicamente
        const modalHTML = `
            <div class="modal fade" id="confirmDeleteModal" tabindex="-1" aria-labelledby="confirmDeleteModalLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="confirmDeleteModalLabel">Confirmar Eliminación</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            ¿Estás seguro de que quieres eliminar esta categoría?
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="confirmDeleteButton">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Añade el modal al body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Muestra el modal
        const confirmDeleteModal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
        confirmDeleteModal.show();

        // Maneja la confirmación del usuario
        document.getElementById('confirmDeleteButton').onclick = async () => {
            try {
                await DeleteCategoryById(CategoryId);
                console.log("Categoría eliminada con éxito");
                // Refresca la página después de eliminar la categoría
                window.location.reload();
            } catch (error) {
                console.error("Error al eliminar la categoría:", error);
                // Elimina el modal del DOM en caso de error
                confirmDeleteModal.hide();
                document.getElementById('confirmDeleteModal').remove();
            }
        };
        
        // Elimina el modal si se cierra con el botón de cerrar
        document.querySelector('#confirmDeleteModal .btn-close').onclick = () => {
            document.getElementById('confirmDeleteModal').remove();
        };
    });
}

function showAlert(message, type) {
    // Crea el alert de Bootstrap dinámicamente
    const alertHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    // Añade el alert al body
    document.body.insertAdjacentHTML('beforeend', alertHTML);

    // Opcional: Elimina el alert después de 5 segundos
    setTimeout(() => {
        const alertElement = document.querySelector('.alert');
        if (alertElement) {
            alertElement.remove();
        }
    }, 5000);
}

