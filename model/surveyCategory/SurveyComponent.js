import {DeleteSurvey} from "./surveyAPI.js";

export async function ImprimirSurveys(surveyList) {
    const showSurveys = document.querySelector(".ShowSurveys");
    showSurveys.innerHTML = "";

    if (surveyList.length === 0) {
        alert("No hay encuestas asignadas a esta Categoria");
        return; // Salir si no hay encuestas
    }

    for (let i = 0; i < surveyList.length; i++) {
        const divContainer = document.createElement("div");
        divContainer.setAttribute("class", "surveyContainer animate__animated animate__flipInX");
        divContainer.setAttribute("id", `survey-${surveyList[i].id}`);

        divContainer.innerHTML = `
            <div class="eliminarSurvey">X</div>
            <img class="surveyContainerImg" src="../assets/surveyimg.png" alt="imagen encuesta">
            <h2 style = "font-size:1.5rem">${[i+1]}. ${surveyList[i].name}</h2>
            <p>${surveyList[i].description}</p>
        `;

        showSurveys.appendChild(divContainer);
    }

    // Asegúrate de que la función eventoEliminarSurvey esté definida en otro lugar
    eventoEliminarSurvey();
}



function eventoEliminarSurvey(){
    const botonEliminar = document.querySelectorAll(".eliminarSurvey");
    
    botonEliminar.forEach((element)=>{
        element.addEventListener("click",async (e)=>{
            const divPadre = e.target.parentElement;
            let idContenedor = divPadre.getAttribute("id");
            let surveyId = idContenedor.split("-")[1];
            let encuestaEliminada = await DeleteSurvey(surveyId);
            const parent = divPadre.parentElement;
            parent.removeChild(divPadre);

        })
    })
}




 
