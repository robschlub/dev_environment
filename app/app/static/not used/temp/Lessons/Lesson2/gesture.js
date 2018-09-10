// var Lesson2Gestures = {}
// Lesson2Gestures.Lesson2Gestures = function(lesson) {
function Lesson2Gestures (lesson) {
    "use strict";
    Gesture.call(this, lesson);
}
Lesson2Gestures.prototype = Object.create(Gesture.prototype)
