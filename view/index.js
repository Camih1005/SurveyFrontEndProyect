import { initialize } from '../controller/categoryController.js';

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar categorías
    initialize();


    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const surveyForm = document.getElementById('surveyForm');
    const categoryDropdown = document.getElementById('listCat');
    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));


    surveyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        confirmationModal.show();
    });

  
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

       
        if (email === 'admin@example.com' && password === 'admin') {
            window.location.href = 'view/deploy.html'; 
        } else {
            alert('Usuario o contraseña incorrectos.');
        }
    });

  
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Registro exitoso.');
    
    });

    
    function showSurveyForm(categoryId) {
        
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
