function Lesson() {
    "use strict";
    this.globals        = GlobalVariables.getInstance();    
    this.inTransition = false;
    
    this.director = null;
    this.diagrams = [];
    this.gestureHandler = null;
    
    this.textBox = document.getElementById('learning_text_container')
    // this.canvasRect = this.canvas.getBoundingClientRect();
    // this.textRect = this.textBox.getBoundingClientRect();
    // this.targetRect = {left: this.textRect.right, top: this.textRect.top, width: this.textRect.width, height: this.textRect.height};
    window.addEventListener('resize', this.autoResize.bind(this,event));
    this.globals.setDrawMethod(this.draw.bind(this));
};
Lesson.prototype.setupLesson = function(director, content, gestureHandler) {
    // this.diagram          = new Lesson2Diagram(this, canvas);
    // this.globals.setDrawMethod(this.draw.bind(this));
    
    // this.globals.setDrawMethod(this.diagrams[0].draw.bind(this.diagrams[0]));
    this.globals.setDrawMethod(this.draw.bind(this));


    this.director       = new director(this);
    this.director.addContent( new content(this.director));
    this.director.goToPage(0);

    this.gestureHandler = new gestureHandler(this);
    this.gestureHandler.setupEventHandlers();
    
}
Lesson.prototype.addDiagram = function (canvas, diagram, getTargetRectFunction) {
    let diag = new diagram(this, canvas);
    diag.autoResize(false);
    diag.getTargetRect = getTargetRectFunction;
    this.diagrams.push(diag);

}
Lesson.prototype.autoResize = function(event) {
    for (let i = 0, j=this.diagrams.length; i<j; ++i) {
        this.diagrams[i].autoResize(event);
    }
}
Lesson.prototype.draw = function(now) {
    this.diagrams[0].webgl.gl.clearColor(0,0,0,0);
    this.diagrams[0].webgl.gl.clear(this.diagrams[0].webgl.gl.COLOR_BUFFER_BIT);

    for (let i = 0, j=this.diagrams.length; i<j; ++i) {
        this.diagrams[i].draw(now);
    }
}
// Lesson.prototype.autoResize = function(event) {
//     this.canvas.width = this.canvas.clientWidth * this.devicePixelRatio;
//     this.canvas.height = this.canvas.clientHeight * this.devicePixelRatio;
//     this.webgl.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

//     this.textRect = this.textBox.getBoundingClientRect();
//     this.canvasRect = this.canvas.getBoundingClientRect();
//     this.targetRect = {left: this.textRect.right, top: this.textRect.top, width: this.globals.dimensions['canvas-width'], height: this.textRect.height};
//     let newZeroX = this.targetRect.left-this.canvasRect.left+this.targetRect.width/2;
//     let newZeroY = this.targetRect.top-this.canvasRect.top+this.targetRect.height/2;
//     let scale = geo.point(this.globals.dimensions['canvas-width']/this.canvasRect.width,
//                                        this.globals.dimensions['canvas-width']/this.canvasRect.height)
//     this.diagram.geometry.setTransform(tools.Transform(d2.point(newZeroX/this.canvasRect.width*2-1,
//                                                         newZeroY/this.canvasRect.height*-2+1),
//                                                 scale));
//     this.diagram.geometry.updateBias(scale, 
//                              geo.point(newZeroX/this.canvasRect.width*2-1,
//                                        newZeroY/this.canvasRect.height*-2+1));  
//     this.globals.updateCanvas(this.canvas);
//     this.globals.animateNextFrame();
// }