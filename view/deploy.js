import { initialize } from '../controller/categoryController.js';
import { postSurvey } from '../model/surveyCategory/surveyAPI.js';
import { createChapter } from "../model/surveyCategory/chapterAPI.js";

document.addEventListener('DOMContentLoaded', () => {


// Selecciona los elementos del DOM
const surveyTypeSelect = document.getElementById('survey-type');
const dynamicForm = document.getElementById('dynamic-form');
const modalFormContainer = document.getElementById('modal-form-container');
const saveButton = document.getElementById('save-form');
const openModalButton = document.getElementById('open-modal');
const submitButton = document.getElementById('submit-answers');
const btAggSesion = document.getElementById('btAggSesion');

// Asegúrate de que los elementos existen antes de usarlos
if (surveyTypeSelect && saveButton) {
    saveButton.addEventListener('click', () => {
        const type = surveyTypeSelect.value;

        if (!type) {
            alert('Por favor, selecciona un tipo de encuesta.');
            return;
        }

        // Variables para verificar si la encuesta está completa
        let isValid = true;

        if (type === 'multiple-choice') {
            const questions = [];
            document.querySelectorAll('.dynamic-question').forEach((questionDiv, index) => {
                const questionText = questionDiv.querySelector(`#question${index + 1}`)?.value.trim();
                if (!questionText) {
                    alert(`Por favor, ingresa una pregunta para la pregunta ${index + 1}.`);
                    isValid = false;
                    return;
                }

                const options = [];
                questionDiv.querySelectorAll(`#options-container${index + 1} input`).forEach(input => {
                    const value = input.value.trim();
                    if (value) options.push(value);
                });
                if (options.length === 0) {
                    alert(`Por favor, añade al menos una opción para la pregunta ${index + 1}.`);
                    isValid = false;
                    return;
                }

                questions.push({ question: questionText, options: options });
            });

            if (questions.length === 0) {
                alert('Por favor, añade al menos una pregunta.');
                isValid = false;
            }

            if (!isValid) return;
            surveyData = { type: type, questions: questions, responses: [] };

        } else if (type === 'short-answer') {
            const question = document.getElementById('question')?.value.trim();
            if (!question) {
                alert('Por favor, ingresa una pregunta.');
                return;
            }
            surveyData = { type: type, questions: [{ question: question }], responses: [] };

        } else if (type === 'rating') {
            const scale = document.getElementById('scale')?.value.trim();
            if (!scale) {
                alert('Por favor, ingresa una escala.');
                return;
            }
            surveyData = { type: type, questions: [{ scale: scale }], responses: [] };
        }

        console.log('Formulario guardado:', surveyData);
        alert('Formulario guardado.');
    });
} else {
    console.error('Elementos del formulario no encontrados.');
}


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

function addContent() {
    const newDiv = document.createElement('div');
    newDiv.className = 'session-form';
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

    dynamicForm.appendChild(newDiv);
    setupSurveyTypeEvents();
}


// Add click event to the button
btAggSesion.addEventListener('click', addContent);

// Existing event listeners




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

detailsContainer.addEventListener('click', function (event) {
    if (event.target.tagName === 'A') {
        const selectedText = event.target.textContent;
        context.innerHTML = `<h1 class="animate__animated animate__fadeIn">${selectedText}</h1>`;
    }
});
});