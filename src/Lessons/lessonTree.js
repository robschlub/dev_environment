// @flow
import getLessonIndex from './index';

// first array of arrays: all uids with no dependencies
// second array of arrays: all uids with dependencies alreay in the done list

export default function makeLessonTree() {
  const lessonIndex = getLessonIndex();
  const lessonTree = [];
  const remainingUIDs = {};
  let existingUIDs = {};
  lessonIndex.forEach((lesson) => {
    remainingUIDs[lesson.uid] = lesson;
  });

  let index = 0;
  const max = lessonIndex.length;
  while (Object.keys(remainingUIDs).length > 0 && index < max) {
    const lessonTreeNode = [];
    const newExisting = {};
    // eslint-disable-next-line no-loop-func
    Object.keys(remainingUIDs).forEach((uid) => {
      const lesson = remainingUIDs[uid];
      let canAddToExisting = true;
      lesson.dependencies.forEach((dependency) => {
        if (!(dependency in existingUIDs)) {
          canAddToExisting = false;
        }
      });
      if (canAddToExisting) {
        newExisting[uid] = uid;
        lessonTreeNode.push(lesson);
        delete remainingUIDs[uid];
      }
    });
    existingUIDs = Object.assign(newExisting, existingUIDs);
    lessonTree.push(lessonTreeNode);
    index += 1;

    // let outStr = ''
    // lessonTreeNode.forEach((lesson) => {
    //   outStr += lesson.name + ', ';
    // })
    // console.log(outStr);
  }
  return lessonTree;
}
