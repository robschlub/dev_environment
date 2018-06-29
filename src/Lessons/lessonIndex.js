// @flow

import { Point } from '../js/diagram/tools/g2';

class LessonDescription {
  name: string;
  link: string;
  location: Point;

  constructor(name: string, link: string = '') {
    this.name = name;
    this.link = link;
    this.location = new Point(0, 0);
  }
}

const lessonIndex = [
  new LessonDescription('Why study shapes', '/Lessons/Math/Introduction'),
  new LessonDescription('Circle', '/Lessons/Math/Circle'),
  new LessonDescription('Angle', '/Lessons/Math/Angle'),
  new LessonDescription('Measuring Angle', '/Lessons/Math/DegreesAndRadians'),
  new LessonDescription('Triangles'),
  [
    new LessonDescription('Similar Triangles'),
    new LessonDescription('Pythagoras'),
    new LessonDescription('Calculating &pi;'),
    new LessonDescription('Triangle Area'),
    new LessonDescription('Circle Area'),
  ],
  new LessonDescription('sine'),
  [
    new LessonDescription('cosine'),
    new LessonDescription('tan'),
  ],
];

export { lessonIndex, LessonDescription };
