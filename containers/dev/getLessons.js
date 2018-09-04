const fs = require('fs');
const path = require('path');

function walkSync(currentDirPath, callback) {
  fs.readdirSync(currentDirPath).forEach((name) => {
    const filePath = path.join(currentDirPath, name);
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      if (name === 'details.js') {
        callback(currentDirPath);
      }
    } else if (stat.isDirectory()) {
      walkSync(filePath, callback);
    }
  });
}

function getAllLessons(lessonsPath) {
  const lessons = [];
  walkSync(lessonsPath, (lessonPath) => {
    lessons.push(lessonPath);
  });
  return lessons;
}

function entryPoints() {
  const points = {
    main: ['whatwg-fetch', 'babel-polyfill', './src/js/main.js'],
  };
  const lessons = getAllLessons('./src/Lessons');
  lessons.forEach((lessonPath) => {
    const p = lessonPath.replace(/src\/Lessons\//, '');
    points[`Lessons/${p}/lesson`] = `./${lessonPath}/lesson.js`;
  });
  // console.log(entryPoints)
  // console.log({
  //   main: ['whatwg-fetch', 'babel-polyfill', './src/js/main.js'],
  //   'Lessons/Math/lesson1/lesson': './src/Lessons/circlesAndAngles/lesson.js',
  //   'Lessons/Math/test1/lesson': './src/Lessons/shapesAndCornersTest/lesson.js',
  // });
  return points;
}

function makeLessonIndex() {
  const lessons = getAllLessons('./src/Lessons');
  // const lessonDescriptions = [];
  let outStr =
`import LessonDescription from './lessonDescription';

export default function getLessonIndex() {
  const lessonIndex = [];
`;
  lessons.forEach((lessonPath) => {
    const shortPath = lessonPath.replace(/src/, '');
    const content = `${lessonPath}/content.js`;
    let title = '';
    let dependencies = [];
    let uid = '';
    if (fs.existsSync(content)) {
      const detailsPath = `./${lessonPath}/details.js`;
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const details = require(detailsPath);
      ({ title } = details.details);
      ({ dependencies } = details.details);
      ({ uid } = details.details);
    }
    if (title !== '') {
      outStr = `${outStr}\n  lessonIndex.push(new LessonDescription(\n    '${title}',\n    '${shortPath}',\n    '${uid}',\n`;
      if (dependencies.length > 0) {
        outStr = `${outStr}    [`;
        dependencies.forEach((dependency) => {
          outStr = `${outStr}\n      '${dependency}',\n`;
        });
        outStr = `${outStr}    ],\n`;
      }
      outStr = `${outStr}  ));`;
    }
  });
  outStr = `${outStr}\n  return lessonIndex;\n}\n`;
  if (outStr !== '') {
    fs.writeFile('./src/Lessons/index.js', outStr, (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log(err);
      }
    });
  }
}

module.exports = {
  entryPoints, makeLessonIndex,
};
