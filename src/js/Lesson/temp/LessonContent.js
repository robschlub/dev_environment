// // @ flow
/* eslint-disable */

function LessonContent(director) {
    "use strict";
    this.director = director;
    this.geometry = director.lesson.diagrams[0].geometry;
    this.diagram = director.lesson.diagrams[0];
    this.pages = [];


};
LessonContent.prototype.actionWord = function(text, id = '', classes = '') {
        return `<span id="${id}" class="${classes} action_word">${text}</span>`;
    }

LessonContent.prototype.formatString = function(text, id = '', classes = '') {
        return `<span id="${id}" class="${classes}">${text}</span>`;   
    }

LessonContent.prototype.equationDim = function(id='', classes=''){
        return `<dim id="${id}" class="${classes}"></dim>`;
    }

LessonContent.prototype.pulseNow = function(pulseObjs) {
    if(pulseObjs.constructor == Array){
        for (let i=0;i<pulseObjs.length;++i) {
            pulseObjs[i].pulseNow();
        }
    } else {
        pulseObjs.pulseNow();
    }
}

LessonContent.prototype.onClickRotatePulse = function(id, rotateObj, pulseObj, angle, time, direction = 0, preFunc = false) {
    let _this = this;
    document.getElementById(id).onclick = function() {
        if(preFunc)
            preFunc();
        rotateObj.animateRotationTo(angle, direction, time);
        _this.pulseNow(pulseObj);
    }
}

LessonContent.prototype.onClickRotate = function(id, geometryObj, angle, time, direction = 0, preFunc = false) {
    document.getElementById(id).onclick = function() {
        if(preFunc)
            preFunc();
        geometryObj.animateRotationTo(angle, direction, time);
    }
}
    
LessonContent.prototype.onClickPulse = function(id, geometryObj) { 
        if(geometryObj.constructor == Array){
            document.getElementById(id).onclick = function() {
                for (let i=0;i<geometryObj.length;++i) {
                    geometryObj[i].pulseNow();
                }
            }
        } else {
            document.getElementById(id).onclick = geometryObj.pulseNow.bind(geometryObj);
        }
    }
LessonContent.prototype.addPage = function(page) {
    newPage = new ContentPage();
    newPage.create(page);
    this.pages.push(page);
}


function ContentPage(){
    "use strict";
    this.title = '';
    this.text = '';
    this.modifiers = {};
    this.state = undefined;
    this.transitionNext = function(done) {
        done();
    }
    this.transitionPrev = function(done) {
        done();
    }
}
ContentPage.prototype.create = function(page) {
    if(page.hasOwnProperty('title')) {
        this.title = page.title;
    }
    if(page.hasOwnProperty('text')) {
        this.text = page.text;
    }
    if(page.hasOwnProperty('modifiers')) {
        this.modifiers = page.modifiers;
    }
    if(page.hasOwnProperty('state')) {
        this.state = page.state;
    }
    if(page.hasOwnProperty('transitionNext')) {
        this.transitionNext = page.transitionNext;
    }
    if(page.hasOwnProperty('transitionPrev')) {
        this.transitionPrev = page.transitionPrev;
    }
    if(page.hasOwnProperty('autoNext')) {
        this.autoNext = page.autoNext;
    }

}
