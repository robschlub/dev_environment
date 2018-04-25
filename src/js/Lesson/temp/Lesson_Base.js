// // @ flow
/* eslint-disable */

import LessonDirector from './LessonDirector';
import Diagram from '../diagram/Diagram';
import LessonContent from './LessonContent'

class Lesson {
  inTransition: boolean;
  director: LessonDirector | null;
  diagrams: Array<Diagram>;
  textBox: HTMLElement | null;

  constructor() {
    // this.globals = GlobalVariables.getInstance();
    this.inTransition = false;

    this.director = null;
    this.diagrams = [];
    // this.gestureHandler = null;

    this.textBox = document.getElementById('learning_text_container');

    // window.addEventListener('resize', this.autoResize.bind(this, event));
    // this.globals.setDrawMethod(this.draw.bind(this));
  }

  setupLesson(
    Director: LessonDirector,
    Content: LessonContent,
    // gestureHandler,
  ) {
    // this.globals.setDrawMethod(this.draw.bind(this));
    this.director = new Director(this);
    this.director.addContent(new Content(this.director));
    this.director.goToPage(0);

    // this.gestureHandler = new gestureHandler(this);
    // this.gestureHandler.setupEventHandlers();
  }

  addDiagram(canvas: HTMLCanvasElement, diagram: Diagram, getTargetRectFunction) {
    const diag = new diagram(this, canvas);
    // diag.autoResize(false);
    diag.getTargetRect = getTargetRectFunction;
    this.diagrams.push(diag);
  }

  // autoResize(event) {
  //   for (let i = 0, j = this.diagrams.length; i < j; i += 1) {
  //     this.diagrams[i].autoResize(event);
  //   }
  // }

  draw(now) {
    this.diagrams[0].webgl.gl.clearColor(0, 0, 0, 0);
    this.diagrams[0].webgl.gl.clear(this.diagrams[0].webgl.gl.COLOR_BUFFER_BIT);

    for (let i = 0, j = this.diagrams.length; i < j; i += 1) {
      this.diagrams[i].draw(now);
    }
  }
}
// Lesson.prototype.autoResize = function(event) {
//   this.canvas.width = this.canvas.clientWidth * this.devicePixelRatio;
//   this.canvas.height = this.canvas.clientHeight * this.devicePixelRatio;
//   this.webgl.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

//   this.textRect = this.textBox.getBoundingClientRect();
//   this.canvasRect = this.canvas.getBoundingClientRect();
//   this.targetRect = {left: this.textRect.right, top: this.textRect.top, width: this.globals.dimensions['canvas-width'], height: this.textRect.height};
//   let newZeroX = this.targetRect.left-this.canvasRect.left+this.targetRect.width/2;
//   let newZeroY = this.targetRect.top-this.canvasRect.top+this.targetRect.height/2;
//   let scale = geo.point(this.globals.dimensions['canvas-width']/this.canvasRect.width,
//                    this.globals.dimensions['canvas-width']/this.canvasRect.height)
//   this.diagram.geometry.setTransform(tools.Transform(d2.point(newZeroX/this.canvasRect.width*2-1,
//                             newZeroY/this.canvasRect.height*-2+1),
//                         scale));
//   this.diagram.geometry.updateBias(scale, 
//                geo.point(newZeroX/this.canvasRect.width*2-1,
//                    newZeroY/this.canvasRect.height*-2+1));  
//   this.globals.updateCanvas(this.canvas);
//   this.globals.animateNextFrame();
// }

export default Lesson;
