import LessonDescription from './lessonDescription';

export default function getLessonIndex() {
  const lessonIndex = [];

  lessonIndex.push(new LessonDescription(
    'Adjacent Angles',
    '/Lessons/Math/AdjacentAngles',
    [
      'important_angles',
    ],
  ));
  lessonIndex.push(new LessonDescription(
    'Angles',
    '/Lessons/Math/Angle',
    [
      'circles',
    ],
  ));
  lessonIndex.push(new LessonDescription(
    'Circles',
    '/Lessons/Math/Circle',
    [
      'why_study_shapes',
    ],
  ));
  lessonIndex.push(new LessonDescription(
    'Important Angles',
    '/Lessons/Math/ImportantAngles',
    [
      'measuring_angles',
    ],
  ));
  lessonIndex.push(new LessonDescription(
    'Why Study Shapes?',
    '/Lessons/Math/Introduction',
  ));
  lessonIndex.push(new LessonDescription(
    'Measuring Angles',
    '/Lessons/Math/MeasuringAngles',
    [
      'angles',
    ],
  ));
  lessonIndex.push(new LessonDescription(
    'Related Angles',
    '/Lessons/Math/RelatedAngles',
    [
      'adjacent_angles',
    ],
  ));
  lessonIndex.push(new LessonDescription(
    'Sine',
    '/Lessons/Math/Sine',
    [
      'adjacent_angles',
    ],
  ));
  return lessonIndex;
}
