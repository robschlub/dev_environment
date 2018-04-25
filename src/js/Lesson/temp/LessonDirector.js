// // @ flow
/* eslint-disable */

import Lesson from './Lesson_Base';
import LessonContent from './LessonContent';

class LessonDirector {
  index: number;
  lesson: Lesson;
  skipTransition: boolean;
  content: LessonContent | null;
  sections: Array<>;
  leanrningTextContainter: HTMLElement;
  selectButton: HTMLElement;
  learningTextWidth: number;

  constructor(lesson) {
    this.index = 0;
    this.lesson = lesson;
    // let _this = this;
    this.skipTransition = false;
    this.content = false;
    this.sections = [];
    this.learningTextContainer = document.getElementById("learning_text_container");
    this.selectButton = document.getElementById("select_link");
    this.learningTextWidth = this.learningTextContainer.getBoundingClientRect().width;
    // this.totalWidth = this.lesson.canvas.getBoundingClientRect().width + this.learningTextWidth;
    this.pageNavigator = document.getElementById("nav_box");
    this.prevButton = document.getElementById("prev_link");
    this.nextButton = document.getElementById("next_link");
  }
  toggleCanvas(state) {
    if (state) {
      this.lesson.canvas.style.visibility = 'visible';
      document.getElementById("learning_text_container").setAttribute("style", "width:" + this.learningTextWidth + "px;");
      document.getElementById("learning_text_container").setAttribute("style", "width:" + this.lesson.globals.dimensions['learning-text-width'] + "px;");
    } else {
      this.lesson.canvas.style.visibility = 'hidden';
      document.getElementById("learning_text_container").setAttribute("style", "width:" + this.lesson.globals.dimensions['diagram-width'] + "px;");
    }
  }
  addContent(content) {
    let frag = document.createDocumentFragment();
    let div = document.createElement('div');
    div.innerHTML = "SECTION";
    div.classList.add("nav-box-title", "element")
    let currentSection=0;
    let pages = content.pages;
    document.getElementById('title').innerHTML = content.title;
    document.getElementById('sub-title').innerHTML = content.subTitle;
    frag.appendChild(div);
    for (let i = 0, j = pages.length; i < j; ++i) {
      let page = pages[i];
      if (page.modifiers) {
        for (modifier in page.modifiers) {
          let expression = new RegExp('\\|' + modifier + '\\|', 'gi');
          page.text = page.text.replace(expression, page.modifiers[modifier]);
        }
      }
      if (page.hasOwnProperty('title')) {
        let div = document.createElement('div');
        div.innerHTML = page.title;
        div.classList.add("nav-box-element", "element")
        div.setAttribute("id", "nav-box-index-" + i);
        div.onclick = this.skipTo.bind(this, i)
        frag.appendChild(div);
        currentSection = i;
        this.sections.push(i);
      }
      pages[i].section = currentSection;
    }
    this.content = pages;
    this.pageNavigator.appendChild(frag);
    this.hideSelect();
    this.pageNavigator.style.top = this.selectButton.getBoundingClientRect().height + this.selectButton.getBoundingClientRect().top - this.learningTextContainer.getBoundingClientRect().top + 5;
  }
  callback(result) {
  }
  getIndex(index) {
    return this.content[this.index].text;
  }
  checkAutoTransition() {
    if (!this.lesson.inTransition) {
      if (this.content[this.index].autoNext) {
        if (this.content[this.index].autoNext()) {
          this.skipTransition = true;
          this.next();
          this.skipTransition = false;
        }
      }
      if (this.content[this.index].autoPrev) {
        if (this.content[this.index].autoPrev()) {
          this.skipTransition = true;
          this.prev();
          this.skipTransition = false;
        }
      }
    }
  }
  updateState() {
    document.getElementById("lt1").innerHTML = this.content[this.index].text;
    this.content[this.index].state();
    // console.log(this.index);
    this.lesson.globals.animateNextFrame()
  }
  skipTo(index) {
    if (this.lesson.inTransition) {
      this.lesson.diagrams[0].stopAnimating(false);
    }

    // console.log(index < this.content.length - 1, this.index, this.content.length-1)
    if (index < this.content.length - 1) {
      if (this.skipTransition) {
        this.finishTransSkipTo(index);
      } else {
        this.lesson.inTransition = true;
        if (this.content[this.index].transitionSkipTo)
          this.content[this.index].transitionSkipTo(index, this.finishTransSkipTo.bind(this));
        else
          this.finishTransSkipTo(index);
      }
    }
  }
  next() {
    // console.log("Pressed Next");
    if (this.lesson.inTransition) {
      this.lesson.diagrams[0].stopAnimating(false);
    }
    if (this.index < this.content.length - 1) {
      if (this.skipTransition) {
        this.finishTransNext();
      } else {
        this.lesson.inTransition = true;
        if (this.content[this.index].transitionNext)
          this.content[this.index].transitionNext(this.finishTransNext.bind(this));
        else
          this.finishTransNext();
      }
    }
  }
  setButtonEnabled(button, enabled) {
    if (enabled && button.classList.contains('movement-link-disabled')){
      button.classList.remove('movement-link-disabled')
      button.classList.add('non_touch_hover')
      button.classList.add('movement-link-enabled')
    }
    if (!enabled && button.classList.contains('movement-link-enabled')){
      button.classList.add('movement-link-disabled')
      button.classList.remove('non_touch_hover')
      button.classList.remove('movement-link-enabled')
    }  
  }
  updateNavBox() {
    let inSection = this.content[this.index].section;
    let element; 
    for (let i=0, j=this.sections.length; i<j; ++i ) {
      element = document.getElementById("nav-box-index-"+this.sections[i]);
      if (element.classList.contains('nav-box-in-section')) {
        element.classList.remove('nav-box-in-section');
        break;
      }
    }
    element = document.getElementById("nav-box-index-"+inSection);
    element.classList.add('nav-box-in-section');
  };
  goToPage(index) {
    if (index >= 0 && index <= this.content.length) {
      this.index = index;
      if (index == 0) {
        this.setButtonEnabled(this.prevButton, false)
      }
      else {
        this.setButtonEnabled(this.prevButton, true)
      }
      if (index < this.content.length-1){
        this.setButtonEnabled(this.nextButton, true)
      }
      else {
        this.setButtonEnabled(this.nextButton, false)
      }
      this.updateNavBox();
      this.lesson.inTransition = false;
      this.updateState();
    }   
  }
  finishTransNext(animationResult = false) {
    this.goToPage(this.index + 1)
  }
  finishTransPrev(animationResult = false) {
    this.goToPage(this.index - 1)
  }
  finishTransSkipTo(index, animationResult = false) {
    this.goToPage(index)
  }
  prev() {
    if (this.lesson.inTransition){
      this.lesson.diagrams[0].stopAnimating(false);
    }
    if (this.index > 0){
    if (this.skipTransition) {
        this.finishTransPrev();
    }
    else {
      this.lesson.inTransition = true;
      if (this.content[this.index].transitionPrev)
      this.content[this.index].transitionPrev(this.finishTransPrev.bind(this));
      else
      this.finishTransPrev();
    }
    }
  }
  showSelect () {
    this.pageNavigator.classList.add('slide-down');
    this.pageNavigator.classList.remove('slide-up');  
  }
  hideSelect () {
    this.pageNavigator.classList.add('slide-up');
    this.pageNavigator.classList.remove('slide-down');
    
    document.removeEventListener('click', this.outsideSelectVariable)
  }
  outsideSelectThenHide (event) {
    if(this.select_counter == 0) {
      if (!this.pageNavigator.contains(event.target)) {
        this.hideSelect();
      }
    }
    this.select_counter = 0;
  }
  select () {
    if(this.pageNavigator.classList.contains('slide-up')){

    this.select_counter = 1;
    this.outsideSelectVariable = this.outsideSelectThenHide.bind(this)
    document.addEventListener('click', this.outsideSelectVariable);
    this.showSelect();
    }
    else {
    this.hideSelect();
    }
  }

}