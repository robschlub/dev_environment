import LessonDescription from './lessonDescription';

export default function getLessonIndex() {
  const lessonIndex = [];

  lessonIndex.push(new LessonDescription(
    'Adjacent Angles',
    '/Lessons/Math/AdjacentAngles',
    'adjacent_angles',
    [
      'important_angles',
    ],
  ));
  lessonIndex.push(new LessonDescription(
    'Angles',
    '/Lessons/Math/Angle',
    'angles',
    [
      'circles',
    ],
  ));
  lessonIndex.push(new LessonDescription(
    'Circles',
    '/Lessons/Math/Circle',
    'circles',
    [
      'why_study_shapes',
    ],
  ));
  lessonIndex.push(new LessonDescription(
    'Important Angles',
    '/Lessons/Math/ImportantAngles',
    'important_angles',
    [
      'measuring_angles',
    ],
  ));
  lessonIndex.push(new LessonDescription(
    'Why Study Shapes?',
    '/Lessons/Math/Introduction',
    'why_study_shapes',
  ));
  lessonIndex.push(new LessonDescription(
    'Measuring Angles',
    '/Lessons/Math/MeasuringAngles',
    'measuring_angles',
    [
      'angles',
    ],
  ));
  lessonIndex.push(new LessonDescription(
    'Related Angles',
    '/Lessons/Math/RelatedAngles',
    'related_angles',
    [
      'adjacent_angles',
    ],
  ));
  lessonIndex.push(new LessonDescription(
    'Sine',
    '/Lessons/Math/Sine',
    'sine',
    [
      'adjacent_angles',
    ],
  ));
  return lessonIndex;
}
