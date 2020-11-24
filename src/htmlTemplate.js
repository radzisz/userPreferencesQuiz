   
const getTemplate = (title="", subtitle="", resultsHeader="") => {
    return `
      <div class="container">
      <div class="row text-center">
        <div class="col-sm">
          <h2>${title}</h2>
        </div>
      </div>
      <div class="row text-center">
        <div class="col-sm">
            <h5>${subtitle}</h5>
        </div>
      </div>

      <div class="row">
        <div class="col-sm"  id="quizContainer">
             <div id="quiz"></div>
             <div id="chartContainer" class="text-center">
                <h3>${resultsHeader}</h3>
                <DIV><canvas id="myChart" class="text-center" style="max-width: 500px;"></canvas></DIV>
             </div>
        </div>
      </div>

      <div id="details">
      </div>

      <div class="row">
        <div class="col-sm text-left" style="margin:20px">
            <div class="btn-group invisible" id="buttonsContainer" role="group" aria-label="Action butons">
                <button type="button" id="previous" class=" btn btn-secondary ">Poprzednie pytanie</button>
                <button type="button" id="next" class=" btn btn-success">Następne pytanie</button>
                <button type="button" id="submit" class=" btn btn-success">Oblicz wynik</button>
            </div>
         </div>
      </div>
    `}

const htmlElements = () => {
  // Variables
  const quiz = document.getElementById('quiz');
  const resultsContainer  = document.getElementById('resultsContainer');
  const submitButton = document.getElementById('submit');
  const buttonsContainer = document.getElementById('buttonsContainer');
  const chartContainer = document.getElementById("chartContainer");  
  // Pagination
  const previousButton = document.getElementById("previous");
  const nextButton = document.getElementById("next");

  return {quiz, resultsContainer, submitButton, buttonsContainer, chartContainer, previousButton, nextButton}
}

const htmlSlides = () => { return document.querySelectorAll(".slide") }

const htmlAnswers = () => { return quiz.querySelectorAll('.answers') }

const htmlChart = () => { return document.getElementById("myChart") }

const htmlResultDetails = () => { return document.getElementById("details") }

export {htmlChart, htmlAnswers, htmlSlides, htmlElements, getTemplate, htmlResultDetails}
