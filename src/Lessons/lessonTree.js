// @flow
import getLessonIndex from './index';

// first array of arrays: all uids with no dependencies
// second array of arrays: all uids with dependencies alreay in the done list

function splitIndexIntoTopics(lessonIndex: Object, pathDepth: number = 3) {
  const topics = {};
  lessonIndex.forEach((lesson) => {
    let topic = lesson.link;
    for (let i = 0; i < pathDepth; i += 1) {
      topic = topic.replace(/\/[^/]*/, '');
    }
    topic = lesson.link.replace(topic, '');
    for (let i = 0; i < pathDepth - 1; i += 1) {
      topic = topic.replace(/\/[^/]*/, '');
    }
    topic = topic.slice(1);
    if (!(topic in topics)) {
      topics[topic] = [];
    }
    topics[topic].push(lesson);
  });
  return topics;
}

export default function makeLessonTree() {
  const lessonIndex = getLessonIndex();
  const lessonTopics = splitIndexIntoTopics(lessonIndex);
  console.log(lessonTopics);
  const lessonTree = [];
  const remainingUIDs = {};
  let existingUIDs = {};
  lessonTopics['Geometry_1'].forEach((lesson) => {
    remainingUIDs[lesson.uid] = lesson;
  });

  let index = 0;
  const max = lessonTopics['Geometry_1'].length;
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
