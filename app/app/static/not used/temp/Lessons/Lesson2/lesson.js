function Lesson2() {
    "use strict";
    Lesson.call(this);
    let _this = this;
    this.addDiagram(document.getElementById("c"), 
                    Lesson2Diagram, 
                    function() {
                        let textRect = _this.textBox.getBoundingClientRect();
                        return {left: textRect.right, 
                                top: textRect.top, 
                                width: _this.globals.dimensions['canvas-width'], 
                                height: textRect.height}
                    })
    this.setupLesson(LessonDirector, Lesson2Content, Lesson2Gestures);
    
    this.autoResize(false);
};
Lesson2.prototype = Object.create(Lesson.prototype)
