// var Lesson2Gestures = {}
// Lesson2Gestures.Lesson2Gestures = function(lesson) {
function Lesson1Gestures (lesson) {
    "use strict";
    Gesture.call(this, lesson);
}
Lesson1Gestures.prototype = Object.create(Gesture.prototype)
