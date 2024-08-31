

document.addEventListener('DOMContentLoaded', () => {
    const surveyCategorySelect = document.getElementById('survey-category');
    const surveyFormContainer = document.getElementById('survey-form');
    const submitSurveyButton = document.getElementById('submit-survey');


    const surveys = [
        {
            id: 1,
            type: 'multiple-choice',
            question: '¿Cuál es tu color favorito?',
            options: ['Rojo', 'Verde', 'Azul', 'Amarillo']
        },
        {
            id: 2,
            type: 'short-answer',
            question: '¿Por qué te gusta ese color?'
        },
        {
            id: 3,
            type: 'rating',
            question: '¿Cómo calificarías nuestro servicio?',
            scale: '1-5'
        }
    ];

  
    surveyCategorySelect.innerHTML = `
        <option value="" selected>Selecciona la encuesta</option>
        ${surveys.map(survey => `<option value="${survey.id}">${survey.question}</option>`).join('')}
    `;

    
    surveyCategorySelect.addEventListener('change', (event) => {
        const selectedSurveyId = parseInt(event.target.value);
        const selectedSurvey = surveys.find(survey => survey.id === selectedSurveyId);

        if (selectedSurvey) {
            displaySurveyForm(selectedSurvey);
        } else {
            surveyFormContainer.innerHTML = ''; 
        }
    });

    function displaySurveyForm(survey) {
        let formHtml = '';

        if (survey.type === 'multiple-choice') {
            formHtml = `
                <div class="mb-3">
                    <label class="form-label">${survey.question}</label>
                    ${survey.options.map((option, index) => `
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="survey-option" id="option${index}" value="${option}">
                            <label class="form-check-label" for="option${index}">
                                ${option}
                            </label>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (survey.type === 'short-answer') {
            formHtml = `
                <div class="mb-3">
                    <label class="form-label">${survey.question}</label>
                    <input type="text" class="form-control" id="short-answer" placeholder="Escribe tu respuesta">
                </div>
            `;
        } else if (survey.type === 'rating') {
            formHtml = `
                <div class="mb-3">
                    <label class="form-label">${survey.question}</label>
                    <input type="number" class="form-control" id="rating" min="1" max="${survey.scale.split('-')[1]}" placeholder="Calificación (1-${survey.scale.split('-')[1]})">
                </div>
            `;
        }

        surveyFormContainer.innerHTML = formHtml;
    }

    submitSurveyButton.addEventListener('click', () => {
       
        const selectedSurveyId = parseInt(surveyCategorySelect.value);
        const selectedSurvey = surveys.find(survey => survey.id === selectedSurveyId);

        if (!selectedSurvey) {
            alert('Por favor, selecciona una encuesta.');
            return;
        }

        // Puedes implementar la lógica para recolectar y enviar las respuestas aquí

        const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));
        modal.show();
    });
});
