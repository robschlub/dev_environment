function Lesson1() {
    "use strict";
    Lesson.call(this);
    let _this = this;
    
    this.addDiagram(document.getElementById("c"), 
                    Lesson1Diagram, 
                    function() {
                        let textRect = _this.textBox.getBoundingClientRect();
                        return {left: textRect.right, 
                                top: textRect.top, 
                                width: _this.globals.dimensions['canvas-width'], 
                                height: textRect.height}
                    })
    this.setupLesson(LessonDirector, Lesson1Content, Lesson1Gestures);
    
    this.autoResize(false);
};
Lesson1.prototype = Object.create(Lesson.prototype)
