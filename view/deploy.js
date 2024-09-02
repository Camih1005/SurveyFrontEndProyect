import { initialize } from '../controller/categoryController.js';
import { postSurvey } from '../model/surveyCategory/surveyAPI.js';
import {createChapter} from "../model/surveyCategory/chapterAPI.js";


const surveyTypeSelect = document.getElementById('survey-type');
const dynamicForm = document.getElementById('dynamic-form');
const modalFormContainer = document.getElementById('modal-form-container');
const saveButton = document.getElementById('save-form');
const openModalButton = document.getElementById('open-modal');
const submitButton = document.getElementById('submit-answers');
const btAggSesion = document.getElementById('btAggSesion');

let surveyData = {
    type: '',
    questions: [], // Array to store multiple questions
    responses: [] // Array to store user responses
};

// Event listener to handle survey type selection
function setupSurveyTypeEvents() {
    // Attach event listeners to all select elements with class 'survey-type'
    document.querySelectorAll('.survey-type').forEach(select => {
        select.addEventListener('change', (event) => {
            const type = event.target.value;
            const sessionForm = event.target.closest('.session-form');
            const dynamicFormContainer = sessionForm.querySelector('.dynamic-form-container');
            dynamicFormContainer.innerHTML = ''; // Clear previous fields

            if (type === 'multiple-choice') {
                dynamicFormContainer.innerHTML = `
                    <div id="questions-container"></div>
                    <button type="button" class="btn btn-secondary mb-3 add-question">Añadir pregunta</button>
                `;
                dynamicFormContainer.querySelector('.add-question').addEventListener('click', () => {
                    const questionsContainer = dynamicFormContainer.querySelector('#questions-container');
                    const questionIndex = questionsContainer.children.length + 1;
                    const newQuestion = document.createElement('div');
                    newQuestion.className = 'dynamic-question';
                    newQuestion.innerHTML = `
                        <div class="form-floating mb-3">
                            <input type="text" class="form-control" id="question${questionIndex}" placeholder="Pregunta ${questionIndex}" required>
                            <label for="question${questionIndex}">Pregunta ${questionIndex}:</label>
                        </div>
                        <div id="options-container${questionIndex}"></div>
                        <button type="button" class="btn btn-secondary mb-3 add-option" id="add-option${questionIndex}">Añadir opción</button>
                    `;
                    questionsContainer.appendChild(newQuestion);

                    document.getElementById(`add-option${questionIndex}`).addEventListener('click', () => {
                        const optionsContainer = document.getElementById(`options-container${questionIndex}`);
                        const optionIndex = optionsContainer.children.length + 1;
                        const newOption = document.createElement('div');
                        newOption.className = 'dynamic-option';
                        newOption.innerHTML = `
                            <div class="form-floating mb-2">
                                <input type="text" class="form-control" id="option${questionIndex}_${optionIndex}" placeholder="Opción ${optionIndex}" required>
                                <label for="option${questionIndex}_${optionIndex}">Opción ${optionIndex}:</label>
                            </div>
                        `;
                        optionsContainer.appendChild(newOption);
                    });
                });
            } else if (type === 'short-answer') {
                dynamicFormContainer.innerHTML = `
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="question" placeholder="Pregunta" required>
                        <label for="question">Pregunta:</label>
                    </div>
                `;
            } else if (type === 'rating') {
                dynamicFormContainer.innerHTML = `
                    <div class="form-floating mb-3">
                        <input type="text" class="form-control" id="scale" placeholder="Escala" required>
                        <label for="scale">Escala de Calificación (ej. 1-5):</label>
                    </div>
                `;
            }
        });
    });
}

// Function to add content dynamically
function addContent() {
    // Create a new div for the new session form
    const newDiv = document.createElement('div');
    newDiv.className = 'session-form'; // Add a class for specific styling
    newDiv.innerHTML = `
        <hr class="hrDiv">
        <div class="centrado">
            <div>
                <label for="chaptersesion" style="font-weight: bold;" class="form-label">Nombre de la sesión</label>
                <input class="form-control" list="datalistOptions" id="chaptersesion" placeholder="Ingresar el nombre">
            </div>
            <hr>
            <div class="form-floating mb-3">
                <select class="form-select survey-type" aria-label="Selecciona el tipo de encuesta">
                    <option selected>Selecciona el tipo de encuesta</option>
                    <option value="multiple-choice">Selección Múltiple</option>
                    <option value="short-answer">Respuesta Corta</option>
                    <option value="rating">Calificación</option>
                </select>
                <label for="survey-type">Selecciona el tipo de encuesta:</label>
            </div>
            <div class="dynamic-form-container"></div>
        </div>
    `;
    
    // Append the new div to the dynamic form container
    dynamicForm.appendChild(newDiv);
    setupSurveyTypeEvents(); // Set up events for the new select elements
}

// Add click event to the button
btAggSesion.addEventListener('click', addContent);

// Existing event listeners
document.addEventListener('DOMContentLoaded', function() {
    const createSurveyBtn = document.getElementById('create-survey-btn');
    const createCategoryBtn = document.getElementById('create-category-btn');
    const categorySection = document.getElementById('category-section');
    const surveySection = document.getElementById('survey-section');

    createSurveyBtn.addEventListener('click', function() {
        categorySection.classList.add('d-none');
        surveySection.classList.remove('d-none'); 
    });

    createCategoryBtn.addEventListener('click', function() {
        surveySection.classList.add('d-none'); 
        categorySection.classList.remove('d-none'); 
    });
});

/*chapter controller */



/**survey controller */
function enviarSurvey() {
    const name = document.getElementById('surveyName').value;
    const description = document.getElementById('surveyDesc').value;
    return { name: name, description: description };
}

document.getElementById('save-form').addEventListener('click', async () => {
    const surveyData = enviarSurvey();
    try {
        const result = await postSurvey(surveyData);
        console.log('Encuesta enviada con éxito:', result);
     

    } catch (error) {
        console.error('Error al enviar la encuesta:', error);
    }
});

// Initialize categories
initialize();
const detailsContainer = document.getElementById('listCat');
const context = document.querySelector(".catText");

detailsContainer.addEventListener('click', function(event) {
    if (event.target.tagName === 'A') {
        const selectedText = event.target.textContent;
        context.innerHTML = `<h1 class="animate__animated animate__fadeIn">${selectedText}</h1>`;
    }
});
