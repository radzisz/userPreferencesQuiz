//const FlvPlayer = require("mdbootstrap");
const superagent = require('superagent');
const htmlTemplate = require('./htmlTemplate');
const { QuizBackend } = require('./quizBuilder');

import 'bootstrap';
import './scss/app.scss';

class QuizWidget extends HTMLElement {
  constructor() {
    super();
  }

 static get observedAttributes() {
    return ["config"];
  }


 attributeChangesCallback(key, oldVal, newVal) {
 	this.setAttribute(key,newVal);
 }
 // We Can Get And Set Properties
 set config(val) {this.setAttribute('config', val);}
 get config() {this.getAttribute('config');}

 // We Have Lifecycle Hooks
 disconnectedCallBack(){}
 
 connectedCallback() {
    console.info("Initializing...")
    this.getConfiguration(this.processConfiguration, this)
  }



  getConfiguration(callBack, htmlContainer)  {
    //try to parse it might be an inline config
    const config = this.getAttribute('config')
    try {
      const configuration = JSON.parse(config)
      callBack(configuration, htmlContainer)
    } catch (e) {
      console.info(`configuration is not a valid JSON, trying as url: ${config}`);
        superagent.get(config)
    		.end((err, res) => {
    		    if (err) { return console.log("error geting configuration: " + err); }
     			  console.log(res.text);
  	        const configuration = JSON.parse(res.text)
  	        callBack(configuration, htmlContainer)
  	   });
    }
  }


  processConfiguration(configuration, htmlContainer) {
    htmlContainer.innerHTML = htmlTemplate.getTemplate(configuration.title, configuration.subtitle, configuration.resultsHeader)
    const quizBackend = new QuizBackend(configuration);
    quizBackend.buildQuiz() //slides element is modified....
    quizBackend.showSlide(0);
    quizBackend.registerEventListeners();
    console.log( "initialized!" );
  }
	

}// Register to the Browser from `customElements` API
window.customElements.define("quiz-widget", QuizWidget);
