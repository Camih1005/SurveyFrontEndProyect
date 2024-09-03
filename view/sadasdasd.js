const openModalButton = document.getElementById('open-modal');
const submitButton = document.getElementById('submit-answers');



openModalButton.addEventListener('click', () => {
    modalFormContainer.innerHTML = ''; // Clear previous form
    if (surveyData.type === 'multiple-choice') {
        surveyData.questions.forEach((questionData, index) => {
            modalFormContainer.innerHTML += `
                <div class="mb-3">
                    <label for="modal-question${index}" class="form-label">Pregunta:</label>
                    <input type="text" class="form-control" id="modal-question${index}" value="${questionData.question}" readonly>
                </div>
                <div id="modal-options-container${index}"></div>
            `;
            questionData.options.forEach((option, optIndex) => {
                modalFormContainer.innerHTML += `
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="modal-options${index}" id="modal-option${index}_${optIndex}" value="${option}">
                        <label class="form-check-label" for="modal-option${index}_${optIndex}">
                            ${option}
                        </label>
                    </div>
                `;
            });
        });
    } else if (surveyData.type === 'short-answer') {
        modalFormContainer.innerHTML = `
            <div class="mb-3">
                <label for="modal-question" class="form-label">Pregunta:</label>
                <input type="text" class="form-control" id="modal-question" value="${surveyData.questions[0].question}" readonly>
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
                <input type="text" class="form-control" id="modal-question" value="${surveyData.questions[0].question}" readonly>
            </div>
            <div class="mb-3">
                <label for="modal-rating" class="form-label">Calificación:</label>
                <input type="number" class="form-control" id="modal-rating" min="1" max="${surveyData.questions[0].scale}" placeholder="Calificación (1-${surveyData.questions[0].scale})">
            </div>
        `;
    }
});




jsss




import { initialize } from '../controller/categoryController.js';
import { postSurvey } from '../model/surveyCategory/surveyAPI.js';

const surveyTypeSelect = document.getElementById('survey-type');
const dynamicForm = document.getElementById('dynamic-form');
const modalFormContainer = document.getElementById('modal-form-container');
const saveButton = document.getElementById('save-form');
const openModalButton = document.getElementById('open-modal');
const submitButton = document.getElementById('submit-answers');

let surveyData = {
    type: '',
    questions: [], // Array to store multiple questions
    responses: [] // Array to store user responses
};

// Event listener to handle survey type selection
surveyTypeSelect.addEventListener('change', (event) => {
    const type = event.target.value;
    dynamicForm.innerHTML = ''; // Clear previous fields
    surveyData = { type: type, questions: [], responses: [] };

    if (type === 'multiple-choice') {
        dynamicForm.innerHTML = `
            <div id="questions-container"></div>
            <button type="button" class="btn btn-secondary mb-3" id="add-question">Añadir pregunta</button>
        `;
        document.getElementById('add-question').addEventListener('click', () => {
            const questionsContainer = document.getElementById('questions-container');
            const questionIndex = questionsContainer.children.length + 1;
            const newQuestion = document.createElement('div');
            newQuestion.className = 'dynamic-question';
            newQuestion.innerHTML = `
                <div class="form-floating mb-3">
                    <input type="text" class="form-control" id="question${questionIndex}" placeholder="Pregunta ${questionIndex}" required>
                    <label for="question${questionIndex}">Pregunta ${questionIndex}:</label>
                </div>
                <div id="options-container${questionIndex}"></div>
                <button type="button" class="btn btn-secondary mb-3" id="add-option${questionIndex}">Añadir opción</button>
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

    if (type === 'multiple-choice') {
        const questions = [];
        document.querySelectorAll('.dynamic-question').forEach((questionDiv, index) => {
            const questionText = questionDiv.querySelector(`#question${index + 1}`).value.trim();
            if (questionText === '') {
                alert('Por favor, ingresa una pregunta.');
                return;
            }

            const options = [];
            questionDiv.querySelectorAll(`#options-container${index + 1} input`).forEach(input => {
                const value = input.value.trim();
                if (value) options.push(value);
            });
            if (options.length === 0) {
                alert('Por favor, añade al menos una opción.');
                return;
            }

            questions.push({ question: questionText, options: options });
        });

        if (questions.length === 0) {
            alert('Por favor, añade al menos una pregunta.');
            return;
        }

        surveyData = { type: type, questions: questions, responses: [] };
    } else if (type === 'short-answer') {
        const question = document.getElementById('question') ? document.getElementById('question').value.trim() : '';
        if (question === '') {
            alert('Por favor, ingresa una pregunta.');
            return;
        }
        surveyData = { type: type, questions: [{ question: question }], responses: [] };
    } else if (type === 'rating') {
        const scale = document.getElementById('scale') ? document.getElementById('scale').value.trim() : '';
        if (scale === '') {
            alert('Por favor, ingresa una escala.');
            return;
        }
        surveyData = { type: type, questions: [{ scale: scale }], responses: [] };
    }

    console.log('Formulario guardado:', surveyData);
    alert('Formulario guardado.');
});

// Event listener to open the modal with the saved survey
openModalButton.addEventListener('click', () => {
    modalFormContainer.innerHTML = ''; // Clear previous form
    if (surveyData.type === 'multiple-choice') {
        surveyData.questions.forEach((questionData, index) => {
            modalFormContainer.innerHTML += `
                <div class="mb-3">
                    <label for="modal-question${index}" class="form-label">Pregunta:</label>
                    <input type="text" class="form-control" id="modal-question${index}" value="${questionData.question}" readonly>
                </div>
                <div id="modal-options-container${index}"></div>
            `;
            questionData.options.forEach((option, optIndex) => {
                modalFormContainer.innerHTML += `
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="modal-options${index}" id="modal-option${index}_${optIndex}" value="${option}">
                        <label class="form-check-label" for="modal-option${index}_${optIndex}">
                            ${option}
                        </label>
                    </div>
                `;
            });
        });
    } else if (surveyData.type === 'short-answer') {
        modalFormContainer.innerHTML = `
            <div class="mb-3">
                <label for="modal-question" class="form-label">Pregunta:</label>
                <input type="text" class="form-control" id="modal-question" value="${surveyData.questions[0].question}" readonly>
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
                <input type="text" class="form-control" id="modal-question" value="${surveyData.questions[0].question}" readonly>
            </div>
            <div class="mb-3">
                <label for="modal-rating" class="form-label">Calificación:</label>
                <input type="number" class="form-control" id="modal-rating" min="1" max="${surveyData.questions[0].scale}" placeholder="Calificación (1-${surveyData.questions[0].scale})">
            </div>
        `;
    }
});

// Event listener to submit responses
submitButton.addEventListener('click', () => {
    const type = surveyData.type;
    const responses = [];

    if (type === 'multiple-choice') {
        surveyData.questions.forEach((questionData, index) => {
            const selectedOption = document.querySelector(`input[name="modal-options${index}"]:checked`);
            if (!selectedOption) {
                alert('Por favor, selecciona una opción.');
                return;
            }
            responses.push({
                question: questionData.question,
                response: selectedOption.value
            });
        });
    } else if (type === 'short-answer') {
        const answer = document.getElementById('modal-short-answer').value.trim();
        if (answer === '') {
            alert('Por favor, ingresa una respuesta.');
            return;
        }
        responses.push({
            question: surveyData.questions[0].question,
            response: answer
        });
    } else if (type === 'rating') {
        const rating = document.getElementById('modal-rating').value;
        if (rating === '' || rating < 1 || rating > surveyData.questions[0].scale) {
            alert(`Por favor, ingresa una calificación válida entre 1 y ${surveyData.questions[0].scale}.`);
            return;
        }
        responses.push({
            question: surveyData.questions[0].question,
            response: rating
        });
    }

    surveyData.responses = responses;
    console.log('Respuestas enviadas:', surveyData);
    alert('Respuestas enviadas.');
    
    // Call API to submit responses
    postSurvey(surveyData);
});

