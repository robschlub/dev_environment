// @flow
import getLessonIndex from './index';

export default function makeLessonTree() {
  const lessonIndex = getLessonIndex();
  const lessonTree = [];
  lessonIndex.forEach((lesson) => {
    lessonTree.push(lesson);
  });
  return lessonTree;
}
