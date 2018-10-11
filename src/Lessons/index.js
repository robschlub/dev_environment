import LessonDescription from './lessonDescription';

export default function getLessonIndex() {
  const lessonIndex = [];

  lessonIndex.push(new LessonDescription(
    'Adjacent Angles',
    '/Lessons/Math/Geometry1/AdjacentAngles',
    'adjacent_angles',
    [
      '1',
      'summary',
    ],
    [
      'important_angles',
    ],
    true,
  ));
  lessonIndex.push(new LessonDescription(
    'Angles',
    '/Lessons/Math/Geometry1/Angle',
    'angles',
    [
      '1',
    ],
    [
      'circles',
    ],
    true,
  ));
  lessonIndex.push(new LessonDescription(
    'Circles',
    '/Lessons/Math/Geometry1/Circle',
    'circles',
    [
      '1',
    ],
    [
      'why_study_shapes',
    ],
    true,
  ));
  lessonIndex.push(new LessonDescription(
    'Congruent Triangles',
    '/Lessons/Math/Geometry1/CongruentTriangles',
    'congruent_triangles',
    [
      '1',
      'quiz',
      'summary',
    ],
    [
      'triangle_introduction',
    ],
    true,
  ));
  lessonIndex.push(new LessonDescription(
    'Important Angles',
    '/Lessons/Math/Geometry1/ImportantAngles',
    'important_angles',
    [
      '1',
    ],
    [
      'measuring_angles',
    ],
    true,
  ));
  lessonIndex.push(new LessonDescription(
    'Why Study Shapes?',
    '/Lessons/Math/Geometry1/Introduction',
    'why_study_shapes',
    [
      '1',
    ],
    [
    ],
    true,
  ));
  lessonIndex.push(new LessonDescription(
    'Measuring Angles',
    '/Lessons/Math/Geometry1/MeasuringAngles',
    'measuring_angles',
    [
      '1',
    ],
    [
      'angles',
    ],
    true,
  ));
  lessonIndex.push(new LessonDescription(
    'Parallel Lines',
    '/Lessons/Math/Geometry1/ParallelLines',
    'parallel_lines',
    [
      '1',
      'quiz',
      'summary',
    ],
    [
      'adjacent_angles',
    ],
    true,
  ));
  lessonIndex.push(new LessonDescription(
    'Quadrangles',
    '/Lessons/Math/Geometry1/Quadrangles',
    'quadrangles',
    [
      '1',
      'quiz',
      'summary',
    ],
    [
      'congruent_triangles',
    ],
    true,
  ));
  lessonIndex.push(new LessonDescription(
    'Related Angles',
    '/Lessons/Math/Geometry1/RelatedAngles',
    'related_angles',
    [
      '1',
      'quiz',
      'summary',
    ],
    [
      'parallel_lines',
    ],
    true,
  ));
  lessonIndex.push(new LessonDescription(
    'Area',
    '/Lessons/Math/Geometry1/ToDo/Area',
    'area_introduction',
    [
      '1',
    ],
    [
      'quadrangles',
    ],
    false,
  ));
  lessonIndex.push(new LessonDescription(
    'Calculating Pi',
    '/Lessons/Math/Geometry1/ToDo/Calculating Pi',
    'calculating_pi',
    [
      '1',
    ],
    [
      'right_angle_triangles',
    ],
    false,
  ));
  lessonIndex.push(new LessonDescription(
    'Important Triangles',
    '/Lessons/Math/Geometry1/ToDo/ImportantTriangles',
    'important_triangles',
    [
      '1',
    ],
    [
      'congruent_triangles',
    ],
    false,
  ));
  lessonIndex.push(new LessonDescription(
    'Pythagorean Theorm',
    '/Lessons/Math/Geometry1/ToDo/Pythagoras',
    'pythagoras',
    [
      '1',
    ],
    [
      'right_angle_triangles',
    ],
    false,
  ));
  lessonIndex.push(new LessonDescription(
    'Right Angle Triangles',
    '/Lessons/Math/Geometry1/ToDo/RightAngleTriangles',
    'right_angle_triangles',
    [
      '1',
    ],
    [
      'important_triangles',
      'area_introduction',
    ],
    false,
  ));
  lessonIndex.push(new LessonDescription(
    'Similar Triangles',
    '/Lessons/Math/Geometry1/ToDo/SimilarTriangles',
    'area_introduction',
    [
      '1',
    ],
    [
      'congruent_triangles',
    ],
    false,
  ));
  lessonIndex.push(new LessonDescription(
    'Triangles',
    '/Lessons/Math/Geometry1/Triangles',
    'triangle_introduction',
    [
      '1',
      'quiz',
      'summary',
    ],
    [
      'related_angles',
    ],
    true,
  ));
  return lessonIndex;
}
