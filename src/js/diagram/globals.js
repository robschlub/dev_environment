// @flow

class GlobalVariables {
  data: Array<number>;
  static instance: Object;

  constructor() {
    if (!GlobalVariables.instance) {
      this.data = [];
      GlobalVariables.instance = this;
    }

    return GlobalVariables.instance;
  }

  add(item: number) {
    this.data.push(item);
  }

  get(id: number) {
    return this.data.find(d => d.id === id);
  }
}

const instance = new GlobalVariables();
Object.freeze(instance);

export default instance;




function GlobalVariablesObject() {
  this.animationId = 0;
  this.drawScene = null;
  this.canvas = null;
  this.isTouchDevice = (
    'ontouchstart' in window          // works on most browsers
    || navigator.maxTouchPoints       // works on IE10/11 and Surface
  );

  
  let _this = this;

  const requestNextAnimationFrame = window.requestAnimationFrame || 
            window.mozRequestAnimationFrame || 
            window.webkitRequestAnimationFrame || 
            window.msRequestAnimationFrame;

  // const elem = document.getElementsByTagName("body")[0];
  // const style = window.getComputedStyle(elem);
  this.dimensions = {};

  let cssProperties = [
  '--dim-diagram-height',
  '--dim-diagram-width',
  '--dim-learning-text-width',
  '--dim-canvas-width',
  '--dim-canvas-height',
  '--dim-header-height',
  '--dim-title-height',
  '--dim-subtitle-height',
  '--dim-navbar_height',

  '--color-stick',
  '--color-arc',
  '--color-rotation',
  '--color-hint_arrow',
  '--color-corners',
  '--color-shapes',
  '--color-axes',
  '--color-portions',
  '--color-anchor',
  '--color-anchor_text',
  '--color-corners_more_sharp',
  '--color-corners_less_sharp',
  '--color-angle',
  '--color-angle_text',
  '--color-start_stick',
  ]

  this.colors = {};
  this.animateNextFrameFlag = false;

  // this.colors['stick'] = style.getPropertyValue('--color-stick');
  // this.colors['corners'] = style.getPropertyValue('--color-corners');
  // console.log(style.getPropertyValue('--color-stick'))
  // console.log(style)
  for (let i=0,j=cssProperties.length;i<j;++i) {
    let styleElem = cssProperties[i];
    if(styleElem.substr(0,8) == '--color-'){
      let colorName = styleElem.substr(8);
      let colString = style.getPropertyValue(styleElem)
      // console.log(colString)
      // if(colorName == 'corners_more_sharp'){
      //   document.getElementById('headerbar').innerHTML = colString;
      //   colString = colString.replace(/.*\(/i,'')
      //   colString = colString.replace(/\)/i,'')
      //   document.getElementById('headerbar').innerHTML = colString;
      // }
      // colString = colString.substr(5,colString.length-6).split(",");
      colString = colString.replace(/.*\(/i,'')
      colString = colString.replace(/\)/i,'')
      colString = colString.split(",");
      // console.log(colString)
      // if(colorName == 'corners_more_sharp'){
        // document.getElementById('headerbar').innerHTML = colString;
      // }
      // console.log(colorName)
      for (let i=0, j=3;i<j;++i) {
        // console.log(colString[i]);
        colString[i] /= 255;

      }
      if (colString.length == 3) {
        colString.push(1);
      }
      this.colors[colorName]= colString;
      // console.log(colorName)
    }

    if(styleElem.substr(0,6) == '--dim-'){
      let dimName = styleElem.substr(6);
      let dimString = style.getPropertyValue(styleElem)
      this.dimensions[dimName] = dimString.substr(0,dimString.length-2);    
      // console.log(dimString)
    }
  }

  // for (let color in this.colors){
  //   this.colors[color] = this.colors[color].substr(5,this.colors[color].length-6).split(",");
  //   for (let i=0, j=this.colors[color].length;i<j;++i) {
  //     this.colors[color][i] /= 255;
  //   }
  // }


  function setDrawMethod(drawMethod) {
    _this.drawScene = drawMethod;
  }

  function animateNextFrame() {
    // console.log("Asdf");
    cancelAnimationFrame(_this.animationId);
    _this.animationId = requestNextAnimationFrame(_this.drawScene);
  }

  function updateCanvas(canvas) {
    _this.canvas = canvas;
    // _this.canvas = document.getElementById("c");
    _this.canvasRect = _this.canvas.getBoundingClientRect();
    _this.canvasWidth = _this.canvas.scrollWidth;
    _this.canvasHeight = _this.canvas.scrollHeight;

  }

  return {
  animationId:  this.animationId,
  animateNextFrame:   animateNextFrame,
  setDrawMethod:   setDrawMethod, 
    dimensions:   this.dimensions,
    colors:     this.colors,
    updateCanvas:  updateCanvas,
    canvas:     this.canvas,
  }

}


// Global Variables Singleton
var GlobalVariables = (function () {
  "use strict";
  var instance;

  function createInstance() {
    var object = new GlobalVariablesObject();
    return object;
  }
 
  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  }
})();