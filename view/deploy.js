import { initialize } from '../controller/categoryController.js';
import { postSurvey,getSurveysByCatId} from '../model/surveyCategory/surveyAPI.js';
import { createChapter} from "../model/surveyCategory/chapterAPI.js";
import {ImprimirSurveys} from "../model/surveyCategory/SurveyComponent.js"


    const surveyTypeSelect = document.getElementById('survey-type');
    const dynamicForm = document.getElementById('dynamic-form');
    const saveButton = document.getElementById('save-form');
    const btAggSesion = document.getElementById('btAggSesion');
    const confirmationModal = new bootstrap.Modal(document.getElementById('confirmationModal'));
    const confirmSaveButton = document.getElementById('confirmSave');

    export let idca = {
        "id":""
    }

    let surveyData = null; // Asegúrate de que surveyData esté definido

    if (saveButton) {
        saveButton.addEventListener('click', () => {
            const type = surveyTypeSelect.value;
            console.log(type)

            if (!type) {
                alert('Por favor, selecciona un tipo de encuesta.');
                return;
            }

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

            // Muestra el modal de confirmación
            confirmationModal.show();
        });
    }

    if (confirmSaveButton) {
        confirmSaveButton.addEventListener('click', () => {
            // Guarda el cuestionario
            console.log('Formulario guardado:', surveyData);


            // Limpia el formulario
            dynamicForm.textContent = "";
            document.querySelectorAll('.dynamic-form-container').forEach(container => container.innerHTML = '');
            surveyData = null; // Limpia los datos del cuestionario
            let name = document.getElementById('surveyName');
            let description = document.getElementById('surveyDesc');

            name.value = ""
            description.value = ""
            // Oculta el modal
            confirmationModal.hide();
        });
    }

    function setupSurveyTypeEvents() {
        document.querySelectorAll('.survey-type').forEach(select => {
            select.addEventListener('change', (event) => {
                const type = event.target.value;
                const sessionForm = event.target.closest('.session-form');
                const dynamicFormContainer = sessionForm.querySelector('.dynamic-form-container');
                dynamicFormContainer.innerHTML = '';

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

    const sessionsArray = [];

    function addContent() {
        const sessionCount = document.querySelectorAll('.session-form').length + 1;

        const newDiv = document.createElement('div');
        newDiv.className = 'session-form';
        newDiv.dataset.sessionId = sessionCount;
        newDiv.innerHTML = `
            <hr class="hrDiv">
            <div class="centrado">
                <div>
                    <label for="chaptersesion${sessionCount}" style="font-weight: bold;" class="form-label">Nombre de la sesión</label>
                    <input class="form-control" list="datalistOptions" id="chaptersesion${sessionCount}" placeholder="Ingresar el nombre">
                </div>
                <hr>
                <div class="form-floating mb-3">
                    <select class="form-select survey-type" aria-label="Selecciona el tipo de encuesta" data-session-id="${sessionCount}">
                        <option value="" selected>Selecciona el tipo de encuesta</option>
                        <option value="multiple-choice">Selección Múltiple</option>
                        <option value="short-answer">Respuesta Corta</option>
                        <option value="rating">Calificación</option>
                    </select>
                    <label for="survey-type${sessionCount}">Selecciona el tipo de encuesta:</label>
                </div>
                <div class="dynamic-form-container" id="dynamic-form-container${sessionCount}"></div>
            </div>
        `;

        dynamicForm.appendChild(newDiv);
        setupSurveyTypeEvents();
    }

    function saveSessions() {
        const sessionForms = document.querySelectorAll('.session-form');
        sessionForms.forEach(form => {
            const sessionId = form.dataset.sessionId;
            const type = form.querySelector('.survey-type').value;
            let questions = [];
            if (type === 'multiple-choice') {
                form.querySelectorAll('.dynamic-question').forEach((questionDiv, index) => {
                    const questionText = questionDiv.querySelector(`#question${index + 1}`)?.value.trim();
                    if (!questionText) return;
                    const options = [];
                    questionDiv.querySelectorAll(`#options-container${index + 1} input`).forEach(input => {
                        const value = input.value.trim();
                        if (value) options.push(value);
                    });
                    if (options.length > 0) {
                        questions.push({ question: questionText, options: options });
                    }
                });
            } else if (type === 'short-answer') {
                const question = form.querySelector('#question')?.value.trim();
                if (question) {
                    questions.push({ question: question });
                }
            } else if (type === 'rating') {
                const scale = form.querySelector('#scale')?.value.trim();
                if (scale) {
                    questions.push({ scale: scale });
                }
            }
            if (questions.length > 0) {
                sessionsArray.push({ name: form.querySelector(`#chaptersesion${sessionId}`).value, type: type, questions: questions });
            }
        });

        console.log('Sesiones guardadas:', sessionsArray);
        // Aquí puedes agregar la lógica para enviar `sessionsArray` al servidor
    }

    if (btAggSesion) {
        btAggSesion.addEventListener('click', addContent);
    }

    if (saveButton) {
        saveButton.addEventListener('click', () => {
            saveSessions();
            confirmationModal.show();
        });
    }




// Existing event listeners
// Funciones para manejar los datos del formulario
function enviarChapter() {
    const title = document.getElementById('chaptersesion1').value;

    // Genera un número aleatorio entre 1 y 1000 (ajustado correctamente)
    const randomChapterNumber = Math.floor(Math.random() * 1000) + 1;
    console.log(randomChapterNumber);

    return { chapter_title: title, chapter_number: randomChapterNumber };
}

function enviarSurvey() {
    const name = document.getElementById('surveyName').value;
    const description = document.getElementById('surveyDesc').value;
    return { name: name, description: description };
}

document.getElementById('save-form').addEventListener('click', async () => {
    const surveyData = enviarSurvey();
    const chapterData = enviarChapter();

    try {
        // Verifica que los campos no estén vacíos
        if (chapterData.chapter_title.trim() === "") {
            alert("Tienes que insertar el capítulo");
            return;
        }

        if (surveyData.name.trim() === "" || surveyData.description.trim() === "") {
            alert("Tienes que completar todos los campos de la encuesta");
            return;
        }

        const surveyResult = await postSurvey(surveyData,idca);
        console.log('Encuesta enviada con éxito, ID:', surveyResult);

        // Añade el ID de la encuesta a chapterData
        chapterData.surveyId = surveyResult;

        const chapterResult = await createChapter(chapterData);
        console.log('Capítulo creado:', chapterResult);
    } catch (error) {
        console.error('Error al enviar la encuesta o capítulo:', error);
    }
});

// Initialize categories
initialize();



const detailsContainer = document.getElementById('listCat');
const context = document.querySelector(".catText");
const idcatS = document.querySelectorAll(".dropdown-item")



// let selectedId = ""

detailsContainer.addEventListener('click', async function(event) {
    // Verificar si el elemento clicado es un enlace (a)
    if (event.target && event.target.tagName === 'A') {
        const clickedId = event.target.id.replace('idcat-', '');
        console.log('Clicked ID:', clickedId);
        
        // Aquí puedes hacer algo con el ID, como almacenarlo en una constante
         
          idca.id = clickedId;
          const BuscarSurveyByCatid = await getSurveysByCatId(idca.id);
          ImprimirSurveys(BuscarSurveyByCatid);
        // Puedes usar `selectedId` según tus necesidades
    }


});




detailsContainer.addEventListener('click', function (event) {
    if (event.target.tagName === 'A') {
        const selectedText = event.target.textContent;
        context.innerHTML = `<h1  class="animate__animated animate__fadeIn">${selectedText}</h1>`;
    }



});

// Array para almacenar el HTML del cuestionario
let formArray = [];

// Array para almacenar las respuestas
let responsesArray = [];

// Función para capturar el HTML del formulario
function getFormHTML() {
    const surveyForm = document.getElementById('survey-form');
    return surveyForm ? surveyForm.outerHTML : '';
}

// Función para guardar el HTML en el array
function saveFormToArray() {
    const formHTML = getFormHTML();
    if (formHTML) {
        formArray.push(formHTML);
        // console.log('Formulario guardado en el array:', formHTML);
    }
}

// Función para mostrar el cuestionario en el modal

function showSurveyInModal() {
    const modalFormContainer = document.getElementById('survey-form-response');
    if (formArray.length > 0) {
        // Muestra el último cuestionario guardado
        modalFormContainer.innerHTML = formArray[formArray.length - 1];
    } else {
        modalFormContainer.innerHTML = '<p>No hay encuestas disponibles para responder.</p>';
    }
}

// Función para obtener las respuestas del formulario
function getFormResponses() {
    const formElements = document.querySelectorAll('#modal-form-container input, #modal-form-container textarea');
    let responses = [];
    formElements.forEach(element => {
        responses.push({
            name: element.name,
            value: element.value
        });
    });
    return responses;
}


// Evento para guardar el formulario cuando se haga clic en el botón de guardar
document.getElementById('save-form').addEventListener('click', function () {
    saveFormToArray();
});

// Evento para mostrar el cuestionario en el modal cuando se haga clic en "Responder Encuesta"
document.getElementById('open-modal').addEventListener('click', function () {
    showSurveyInModal();
});

// Evento para enviar las respuestas cuando se haga clic en el botón de enviar
/*document.getElementById('submit-answers').addEventListener('click', function () {
    const responses = getFormResponses();
    responsesArray.push(responses);
    console.log('Respuestas guardadas en el array:', responses);
    // Opcional: Puedes hacer algo con las respuestas, como enviarlas a un servidor
});*/

// Función para mostrar el modal de edición
function showEditModal(sessionId) {
    const session = sessionsArray.find(s => s.sessionId === sessionId);
    if (session) {
        document.getElementById('edit-session-name').value = session.name;
        document.getElementById('edit-survey-type').value = session.type;
        // Configura el contenido del formulario dinámico según el tipo de encuesta
        configureDynamicForm(session);
        $('#editModal').modal('show');
    }
}

// Configura el formulario dinámico según el tipo de encuesta
function configureDynamicForm(session) {
    const formContainer = document.getElementById('edit-form-container');
    formContainer.innerHTML = ''; // Limpia el contenedor

    if (session.type === 'multiple-choice') {
        session.questions.forEach((q, index) => {
            const questionIndex = index + 1;
            const questionDiv = document.createElement('div');
            questionDiv.className = 'dynamic-question';
            questionDiv.innerHTML = `
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="edit-question${questionIndex}" value="${q.question}" placeholder="Pregunta ${questionIndex}" required>
                    <label for="edit-question${questionIndex}">Pregunta ${questionIndex}:</label>
                </div>
                <div id="edit-options-container${questionIndex}">
                    ${q.options.map((o, i) => `
                        <div class="dynamic-option">
                            <div class="form-floating mb-2">
                                <input type="text" class="form-control" id="edit-option${questionIndex}_${i + 1}" value="${o}" placeholder="Opción ${i + 1}" required>
                                <label for="edit-option${questionIndex}_${i + 1}">Opción ${i + 1}:</label>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <button type="button" class="btn btn-secondary mb-3 add-option" id="edit-add-option${questionIndex}">Añadir opción</button>
            `;
            formContainer.appendChild(questionDiv);

            document.getElementById(`edit-add-option${questionIndex}`).addEventListener('click', () => {
                const optionsContainer = document.getElementById(`edit-options-container${questionIndex}`);
                const optionIndex = optionsContainer.children.length + 1;
                const newOption = document.createElement('div');
                newOption.className = 'dynamic-option';
                newOption.innerHTML = `
                    <div class="form-floating mb-2">
                        <input type="text" class="form-control" id="edit-option${questionIndex}_${optionIndex}" placeholder="Opción ${optionIndex}" required>
                        <label for="edit-option${questionIndex}_${optionIndex}">Opción ${optionIndex}:</label>
                    </div>
                `;
                optionsContainer.appendChild(newOption);
            });
        });
    } else if (session.type === 'short-answer') {
        formContainer.innerHTML = `
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="edit-question" value="${session.questions[0].question}" placeholder="Pregunta" required>
                <label for="edit-question">Pregunta:</label>
            </div>
        `;
    } else if (session.type === 'rating') {
        formContainer.innerHTML = `
            <div class="form-floating mb-3">
                <input type="text" class="form-control" id="edit-scale" value="${session.questions[0].scale}" placeholder="Escala" required>
                <label for="edit-scale">Escala de Calificación (ej. 1-5):</label>
            </div>
        `;
    }
}

