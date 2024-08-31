const surveyTypeSelect = document.getElementById('survey-type');
    const dynamicForm = document.getElementById('dynamic-form');
    const modalFormContainer = document.getElementById('modal-form-container');
    const saveButton = document.getElementById('save-form');
    const openModalButton = document.getElementById('open-modal');
    const submitButton = document.getElementById('submit-answers');

    let surveyData = {
        type: '',
        question: '',
        options: [],
        scale: '',
        responses: [] // Array to store user responses
    };

    // Event listener to handle survey type selection
    surveyTypeSelect.addEventListener('change', (event) => {
        const type = event.target.value;
        dynamicForm.innerHTML = ''; // Clear previous fields
        surveyData = { type: type, question: '', options: [], scale: '', responses: [] };

        if (type === 'multiple-choice') {
            dynamicForm.innerHTML = `
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="question" placeholder="Pregunta" required>
                    <label for="question">Pregunta:</label>
                </div>
                <div id="options-container"></div>
                <button type="button" class="btn btn-secondary mb-3" id="add-option">Añadir opción</button>
            `;
            document.getElementById('add-option').addEventListener('click', () => {
                const optionsContainer = document.getElementById('options-container');
                const optionIndex = optionsContainer.children.length + 1;
                const newOption = document.createElement('div');
                newOption.className = 'dynamic-option';
                newOption.innerHTML = `
                    <div class="form-floating mb-2">
                        <input type="text" class="form-control" id="option${optionIndex}" placeholder="Opción ${optionIndex}" required>
                        <label for="option${optionIndex}">Opción ${optionIndex}:</label>
                    </div>
                `;
                optionsContainer.appendChild(newOption);
            });
        } else if (type === 'short-answer') {
            dynamicForm.innerHTML = `
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="question" placeholder="Pregunta" required>
                    <label for="question">Pregunta:</label>
                </div>
            `;
        } else if (type === 'rating') {
            dynamicForm.innerHTML = `
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="scale" placeholder="Escala" required>
                    <label for="scale">Escala de Calificación (ej. 1-5):</label>
                </div>
            `;
        }
    });

    // Event listener to save the survey form
    saveButton.addEventListener('click', () => {
        const type = surveyTypeSelect.value;
        const question = document.getElementById('question') ? document.getElementById('question').value.trim() : '';
        if (question === '') {
            alert('Por favor, ingresa una pregunta.');
            return;
        }

        surveyData.question = question;

        if (type === 'multiple-choice') {
            const options = [];
            document.querySelectorAll('#options-container input').forEach(input => {
                const value = input.value.trim();
                if (value) options.push(value);
            });
            if (options.length === 0) {
                alert('Por favor, añade al menos una opción.');
                return;
            }
            surveyData.options = options;
        } else if (type === 'short-answer') {
            // No additional fields to validate
        } else if (type === 'rating') {
            const scale = document.getElementById('scale') ? document.getElementById('scale').value.trim() : '';
            if (scale === '') {
                alert('Por favor, ingresa una escala.');
                return;
            }
            surveyData.scale = scale;
        }

        console.log('Formulario guardado:', surveyData);
        alert('Formulario guardado.');
    });

    // Event listener to open the modal with the saved survey
    openModalButton.addEventListener('click', () => {
        modalFormContainer.innerHTML = ''; // Clear previous form
        if (surveyData.type === 'multiple-choice') {
            modalFormContainer.innerHTML = `
                <div class="mb-3">
                    <label for="modal-question" class="form-label">Pregunta:</label>
                    <input type="text" class="form-control" id="modal-question" value="${surveyData.question}" readonly>
                </div>
                <div id="modal-options-container"></div>
            `;
            surveyData.options.forEach((option, index) => {
                const newOption = document.createElement('div');
                newOption.className = 'modal-option';
                newOption.innerHTML = `
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="modal-options" id="modal-option${index}" value="${option}">
                        <label class="form-check-label" for="modal-option${index}">
                            ${option}
                        </label>
                    </div>
                `;
                document.getElementById('modal-options-container').appendChild(newOption);
            });
        } else if (surveyData.type === 'short-answer') {
            modalFormContainer.innerHTML = `
                <div class="mb-3">
                    <label for="modal-question" class="form-label">Pregunta:</label>
                    <input type="text" class="form-control" id="modal-question" value="${surveyData.question}" readonly>
                </div>
                <div class="mb-3">
                    <label for="modal-short-answer" class="form-label">Respuesta:</label>
                    <input type="text" class="form-control" id="modal-short-answer" placeholder="Respuesta">
                </div>
            `;
        } else if (surveyData.type === 'rating') {
            modalFormContainer.innerHTML = `
                <div class="mb-3">
                    <label for="modal-question" class="form-label">Pregunta:</label>
                    <input type="text" class="form-control" id="modal-question" value="${surveyData.question}" readonly>
                </div>
                <div class="mb-3">
                    <label for="modal-rating" class="form-label">Calificación:</label>
                    <input type="number" class="form-control" id="modal-rating" min="1" max="${surveyData.scale}" placeholder="Calificación (1-${surveyData.scale})">
                </div>
            `;
        }
    });

    // Event listener to submit responses
    submitButton.addEventListener('click', () => {
        const type = surveyData.type;
        const responses = [];

        if (type === 'multiple-choice') {
            const selectedOption = document.querySelector('input[name="modal-options"]:checked');
            if (!selectedOption) {
                alert('Por favor, selecciona una opción.');
                return;
            }
            responses.push(selectedOption.value);
        } else if (type === 'short-answer') {
            const answer = document.getElementById('modal-short-answer').value.trim();
            if (answer === '') {
                alert('Por favor, ingresa una respuesta.');
                return;
            }
            responses.push(answer);
        } else if (type === 'rating') {
            const rating = document.getElementById('modal-rating').value;
            if (rating === '' || rating < 1 || rating > surveyData.scale) {
                alert(`Por favor, ingresa una calificación válida entre 1 y ${surveyData.scale}.`);
                return;
            }
            responses.push(rating);
        }

        surveyData.responses = responses;
        console.log('Respuestas enviadas:', surveyData);

        // Aquí puedes enviar las respuestas al servidor
        // fetch('URL_DEL_SERVIDOR', { method: 'POST', body: JSON.stringify(surveyData) });

        alert('Respuestas enviadas.');
    });
    import { initialize } from '../controller/categoryController.js';

    document.addEventListener('DOMContentLoaded', () => {
        // Inicializar categorías
        initialize();
});
    // index.js

    /* CAMBIO DE PESTAÑA */
    const createCategoryBtn = document.getElementById('create-category-btn');
    const createCategoryForm = document.getElementById('form12');
    const surveySection = document.getElementById('survey-section');

    const createSurveyBtn = document.getElementById('create-survey-btn');
    const viewStatsBtn = document.getElementById('view-stats-btn');

    // Función para mostrar el formulario de creación de categoría y ocultar otros
    function showCreateCategoryForm() {
        createCategoryForm.classList.remove('hidden');
        surveySection.classList.add('hidden');
    }

    // Función para mostrar la sección de encuestas y ocultar otros
    function showSurveySection() {
        createCategoryForm.classList.add('hidden');
        surveySection.classList.remove('hidden');
    }

    // Eventos para mostrar y ocultar secciones
    createCategoryBtn.addEventListener('click', showCreateCategoryForm);
    createSurveyBtn.addEventListener('click', showSurveySection);
    viewStatsBtn.addEventListener('click', () => {
        // Agrega lógica para la vista de estadísticas aquí si es necesario
        alert('Vista de estadísticas no implementada.');
    });

    // Inicializa mostrando la sección de encuestas por defecto
    showSurveySection();

    