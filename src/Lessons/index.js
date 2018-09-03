
import LessonDescription from './lessonIndex';
export default function getLessonIndex() {
  const lessonIndex = [];
  
  lessonIndex.push(new LessonDescription(
    'Adjacent Angles',
    '/Lessons/Math/AdjacentAngles',
  ));
  lessonIndex.push(new LessonDescription(
    'Angles',
    '/Lessons/Math/Angle',
  ));
  lessonIndex.push(new LessonDescription(
    'Circles',
    '/Lessons/Math/Circle',
  ));
  lessonIndex.push(new LessonDescription(
    'Important Angles',
    '/Lessons/Math/ImportantAngles',
  ));
  lessonIndex.push(new LessonDescription(
    'Why study shapes?',
    '/Lessons/Math/Introduction',
  ));
  lessonIndex.push(new LessonDescription(
    'Measuring Angles',
    '/Lessons/Math/MeasuringAngles',
  ));
  lessonIndex.push(new LessonDescription(
    'Related Angles',
    '/Lessons/Math/RelatedAngles',
  ));
  lessonIndex.push(new LessonDescription(
    'Sine (work in progress)',
    '/Lessons/Math/Sine',
  ));
  return lessonIndex;
}
