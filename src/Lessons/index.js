import LessonDescription from './lessonDescription';

export default function getLessonIndex() {
  const lessonIndex = [];

  lessonIndex.push(new LessonDescription(
    'Adjacent Angles',
    '/Lessons/Math/AdjacentAngles',
    'adjacent_angles',
    [
      '1',
    ],
    [
      'important_angles',
    ],
  ));
  lessonIndex.push(new LessonDescription(
    'Angles',
    '/Lessons/Math/Angle',
    'angles',
    [
      '1',
      '2',
      '3',
      'quiz',
      'summary',
    ],
    [
      'circles',
    ],
  ));
  lessonIndex.push(new LessonDescription(
    'Circles',
    '/Lessons/Math/Circle',
    'circles',
    [
      '1',
    ],
    [
      'why_study_shapes',
    ],
  ));
  lessonIndex.push(new LessonDescription(
    'Important Angles',
    '/Lessons/Math/ImportantAngles',
    'important_angles',
    [
      '1',
    ],
    [
      'measuring_angles',
    ],
  ));
  lessonIndex.push(new LessonDescription(
    'Why Study Shapes?',
    '/Lessons/Math/Introduction',
    'why_study_shapes',
    [
      '1',
    ],
  ));
  lessonIndex.push(new LessonDescription(
    'Measuring Angles',
    '/Lessons/Math/MeasuringAngles',
    'measuring_angles',
    [
      '1',
    ],
    [
      'angles',
    ],
  ));
  lessonIndex.push(new LessonDescription(
    'Related Angles',
    '/Lessons/Math/RelatedAngles',
    'related_angles',
    [
      '1',
    ],
    [
      'adjacent_angles',
    ],
  ));
  lessonIndex.push(new LessonDescription(
    'Sine',
    '/Lessons/Math/Sine',
    'sine',
    [
      '1',
    ],
    [
      'adjacent_angles',
    ],
  ));
  return lessonIndex;
}
