import {DeleteSurvey} from "./surveyAPI.js";

export async function ImprimirSurveys(surveyList){
    const showSurveys = document.querySelector(".ShowSurveys");
    showSurveys.innerHTML = "";

    if(surveyList.length === 0){
        alert("No hay encuestas asignadas a esta Categoria");
    }

    for(let i=0;i<surveyList.length;i++){
        const divcontainer = document.createElement("div")
        divcontainer.setAttribute("class","surveyContainer");
        divcontainer.setAttribute("id",`survey-${surveyList[i].id}`)
    
        divcontainer.innerHTML = `
                        <div class="eliminarSurvey">X</div>
                        <img class="surveycontainerimg" src="../assets/surveyimg.png" alt="imagen encuesta">
                        <h1>${surveyList[i].name}</h1>
                        <p>${surveyList[i].description}</p>
        `
        showSurveys.appendChild(divcontainer);
    }

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




 
