
function Diagram(lesson, geometry, canvas) {
    "use strict";
    this.canvas = canvas;
    let webgl  = new WebGLInstance(this.canvas, 
                        "2d-vertex-shader", "2d-fragment-shader",
                       ["a_position", "u_matrix", "u_color"]);
    this.webgl = webgl;

    this.lesson = lesson;
    this.geometry = new geometry(this.webgl);

    this.activeObjectList = [];
    this.globals = GlobalVariables.getInstance();
    this.devicePixelRatio = window.devicePixelRatio*2;
}


Diagram.prototype.stopAnimating = function () {
    for (let i=0;i<this.activeObjectList.length;++i) {
        this.activeObjectList[i].stopAnimating();
    }
}
Diagram.prototype.getAllActiveObjectsNextFrame  = function (now) {
    let currentlyAnimating = false;
    // console.log(this.activeObjectList);
    for (let i=0, j=this.activeObjectList.length;i<j;++i) {
        let activeObject = this.activeObjectList[i];
        if(activeObject.show){
            if (activeObject.isAnimating || activeObject.isMovingFreely) {
                activeObject.setNextTransform(now);
                currentlyAnimating = true;
            }
        }
    }
    return currentlyAnimating;
}
Diagram.prototype.getTargetRect = function() {
    return {left: 0, top: 0, width: this.canvas.width, height: this.canvas.height}
}
Diagram.prototype.autoResize = function(event) {
    this.canvas.width = this.canvas.clientWidth * this.devicePixelRatio;
    this.canvas.height = this.canvas.clientHeight * this.devicePixelRatio;
    this.webgl.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    // this.textRect = this.textBox.getBoundingClientRect();
    this.canvasRect = this.canvas.getBoundingClientRect();
    // this.targetRect = {left: this.textRect.right, top: this.textRect.top, width: this.globals.dimensions['canvas-width'], height: this.textRect.height};
    this.targetRect = this.getTargetRect();
    let newZeroX = this.targetRect.left-this.canvasRect.left+this.targetRect.width/2;
    let newZeroY = this.targetRect.top-this.canvasRect.top+this.targetRect.height/2;
    let scale = d2.point(this.globals.dimensions['canvas-width']/this.canvasRect.width,
                                       this.globals.dimensions['canvas-width']/this.canvasRect.height)
    this.geometry.setTransform(tools.Transform(d2.point(newZeroX/this.canvasRect.width*2-1,
                                                        newZeroY/this.canvasRect.height*-2+1),
                                                scale));
    this.geometry.updateBias(scale, 
                             d2.point(newZeroX/this.canvasRect.width*2-1,
                                       newZeroY/this.canvasRect.height*-2+1));  
    this.globals.updateCanvas(this.canvas);
    this.globals.animateNextFrame();
}

// exports.geoState = geoState;