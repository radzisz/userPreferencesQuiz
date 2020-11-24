
const htmlTemplate = require('./htmlTemplate');

const { Chart } = require("chart.js");

class QuizBackend {
  constructor(configuration) {
    this.configuration = configuration;
    this.htmlElements = htmlTemplate.htmlElements();
    this.currentSlide=0;
  }

 // Functions
  buildQuiz(){
    const quiz = this.htmlElements.quiz;
    const questions =  this.configuration.questions;
    const defaultQuestion = this.configuration.defaultQuestion;
    // shuffle questions and for each question... create an entry
    let questionNumber = 0
    quiz.innerHTML = questions.sort(() => Math.random() - 0.5).map(
      currentQuestion => {
        // store the list of possible answers
        // shuffle answers
        const answers = currentQuestion.sort(() => Math.random() - 0.5).map(
          currentAnswers => 
            `<div class="form-check">
              <input class="form-check-input" type="radio" name="question${questionNumber}" id="question${questionNumber}${currentAnswers.key}" value="${currentAnswers.key}" >
              <label class="form-check-label" for="question${questionNumber}${currentAnswers.key}">
                <B>${currentAnswers.name}</b> -  ${currentAnswers.description}
              </label>
            </div>`
          );        
      
        questionNumber++;  
        // add this question and its answers to the output
        return `<div class="slide">
            <h4 class="text-center"> ${defaultQuestion} (${questionNumber}/${questions.length})</h4>
            <div class="answers"> ${answers.join("\n")} </div>
        </div>`             
      }).join('\n');
  
    //update slides element
    this.htmlElements.slides = htmlTemplate.htmlSlides()
  }

   showResults(){
    const myQuestions=this.configuration.questions;

    // gather answer containers from our quiz
    const answerContainers = htmlTemplate.htmlAnswers()

    // keep track of user's answers
    const answers = this.configuration.answers.map(item=>{ return {key: item.key, count:0, name: item.name, description: item.description}} )  

    // for each question...
    let questionNumber=0;
    myQuestions.forEach( (currentQuestion) => {
      // find selected answer
      const answerContainer = answerContainers[questionNumber];
      const selector = `input[name=question${questionNumber}]:checked`;
      const userAnswer = (answerContainer.querySelector(selector) || {}).value;
      //update number of this answers
      // if ther is any answer set by the user
      if (userAnswer) {answers.find(item=>item.key == userAnswer).count++;}
      questionNumber++;
    });

    //coutn percentage
    const totalQuestionsCount =  myQuestions.length;
    answers.forEach( item => item.percentage = Math.round(item.count/totalQuestionsCount*100) );
  

    //hide questions
    this.htmlElements.buttonsContainer.style.display = 'none';
    this.htmlElements.quiz.style.display = 'none';    

    ///////////// Graph BAR
    //first show so the anmiation works
    this.htmlElements.chartContainer.style.display = 'inline-block'; 
    const labels = this.configuration.answers.map( item => item.name );
    const dataValues = answers.map( item => item.percentage  );

    console.info(JSON.stringify(labels) +  JSON.stringify(dataValues))

    const chart = htmlTemplate.htmlChart()
    new Chart(chart.getContext('2d'), {
            type: 'horizontalBar',
            data: {
                labels,
                datasets: [{
                  label: "",
                  data: dataValues,
                  backgroundColor: [
                      'rgba(255, 99, 132, 0.2)',
                      'rgba(54, 162, 235, 0.2)',
                      'rgba(255, 206, 86, 0.2)',
                      'rgba(75, 192, 192, 0.2)',
                      'rgba(153, 102, 255, 0.2)',
                      'rgba(255, 159, 64, 0.2)'
                  ],
                  borderColor: [
                      'rgba(255,99,132,1)',
                      'rgba(54, 162, 235, 1)',
                      'rgba(255, 206, 86, 1)',
                      'rgba(75, 192, 192, 1)',
                      'rgba(153, 102, 255, 1)',
                      'rgba(255, 159, 64, 1)'
                  ],
                  borderWidth: 1
               }]
            },
            options: {
               legend: {display: false},                        
               scales: {
                    xAxes: [{ticks: {beginAtZero: true,  suggestedMax: 100, suggestedMin: 0}}]               
               },

           }
        });





     /// show matching profiles  

    const profilesDetails = answers.filter(item=>item.count>0).sort( (a,b)=>b.count-a.count).map(item=>`<div class="row">
                <div class="col-sm">
                     <h4>${item.name} - ${item.percentage} % </h4>
                     <p class="text-justify">${item.description}</p>
                </div>
              </div>`)

    ///// show profiles details
    htmlTemplate.htmlResultDetails().innerHTML = profilesDetails.join("\n")       

  }

   showSlide(n) {
    const htmlElements = this.htmlElements    
    const slides = htmlTemplate.htmlSlides();

    console.log(`Showing slide: ${n} / ${slides.length}`)
    slides[this.currentSlide].classList.remove('active-slide');
    slides[n].classList.add('active-slide');
    this.currentSlide = n;
    const currentSlide = this.currentSlide

    if(currentSlide === 0){
      htmlElements.previousButton.style.display = 'none';
    }
    else{
      htmlElements.previousButton.style.display = 'inline-block';
    }
    if(currentSlide === slides.length-1){
      htmlElements.nextButton.style.display = 'none';
      htmlElements.submitButton.style.display = 'inline-block';
    }
    else{
      htmlElements.nextButton.style.display = 'inline-block';
      htmlElements.submitButton.style.display = 'none';
    }
  }

  showNextSlide() {
    this.showSlide(this.currentSlide + 1);
  }

  showPreviousSlide() {
    this.showSlide(this.currentSlide - 1);
  }

  registerEventListeners() {
    const htmlElements = this.htmlElements  
    // Event listeners
    htmlElements.submitButton.addEventListener('click',  this.showResults.bind(this) );
    htmlElements.previousButton.addEventListener("click", this.showPreviousSlide.bind(this) );
    htmlElements.nextButton.addEventListener("click", this.showNextSlide.bind(this) );
    htmlElements.chartContainer.style.display = 'none';
    htmlElements.buttonsContainer.classList.remove("invisible")    
  }
}


exports.QuizBackend = QuizBackend