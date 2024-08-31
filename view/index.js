import { initialize } from '../controller/categoryController.js';

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar categorías
    initialize();

    // Elementos del DOM
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const surveyForm = document.getElementById('surveyForm');
    const categoryDropdown = document.getElementById('listCat');
    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));

    // Función para manejar el envío del formulario de encuesta
    surveyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        confirmationModal.show();
    });

    // Manejar el inicio de sesión
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Lógica de autenticación (aquí deberías verificar contra tu backend)
        if (email === 'admin@example.com' && password === 'admin') {
            window.location.href = 'view/deploy.html'; // Redirige al panel del admin
        } else {
            alert('Usuario o contraseña incorrectos.');
        }
    });

    // Manejar el registro
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Registro exitoso.');
        // Aquí deberías manejar el registro real
    });

    // Función para mostrar el formulario de encuesta según la categoría seleccionada
    function showSurveyForm(categoryId) {
        // Aquí puedes ajustar el formulario según la categoría seleccionada
        surveyForm.classList.remove('d-none');
    }

    // Manejar la selección de categoría
    categoryDropdown.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            const categoryId = e.target.getAttribute('data-id');
            showSurveyForm(categoryId);
        }
    });
});
