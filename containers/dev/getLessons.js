const fs = require('fs');
const path = require('path');

function walkSync(currentDirPath, fileIdentifier, callback) {
  fs.readdirSync(currentDirPath).forEach((name) => {
    const filePath = path.join(currentDirPath, name);
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      if (name === fileIdentifier) {
        callback(currentDirPath);
      }
    } else if (stat.isDirectory()) {
      walkSync(filePath, fileIdentifier, callback);
    }
  });
}

function getAllPaths(lessonsPath) {
  const lessons = [];
  walkSync(lessonsPath, 'lesson.js', (lessonPath) => {
    lessons.push(lessonPath);
  });
  return lessons;
}

function getAllLessons(lessonsPath) {
  const lessons = [];
  walkSync(lessonsPath, 'details.js', (lessonPath) => {
    lessons.push(lessonPath);
  });
  return lessons;
}

function entryPoints() {
  const points = {
    main: ['whatwg-fetch', 'babel-polyfill', './src/js/main.js'],
  };
  const lessons = getAllPaths('./src/Lessons');
  lessons.forEach((lessonPath) => {
    const p = lessonPath.replace(/src\/Lessons\//, '');
    points[`Lessons/${p}/lesson`] = `./${lessonPath}/lesson.js`;
  });
  // console.log(points)
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
    const detailsPath = `./${lessonPath}/details.js`;
    let title = '';
    let dependencies = [];
    let uid = '';
    const paths = getAllPaths(lessonPath);
    if (fs.existsSync(detailsPath)) {
      // const detailsPath = `./${lessonPath}/details.js`;
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const details = require(detailsPath);
      ({ title } = details.details);
      ({ dependencies } = details.details);
      ({ uid } = details.details);
    }
    if (title !== '') {
      outStr = `${outStr}\n  lessonIndex.push(new LessonDescription(`;
      outStr = `${outStr}\n    '${title}',`;
      outStr = `${outStr}\n    '${shortPath}',`;
      outStr = `${outStr}\n    '${uid}',`;
      outStr = `${outStr}\n    [`;
      paths.forEach((p) => {
        const shortP = p.replace(`${lessonPath}/`, '');
        outStr = `${outStr}\n      '${shortP}',`;
      });
      outStr = `${outStr}\n    ],`;
      if (dependencies.length > 0) {
        outStr = `${outStr}\n    [`;
        dependencies.forEach((dependency) => {
          outStr = `${outStr}\n      '${dependency}',`;
        });
        outStr = `${outStr}\n    ],`;
      }
      outStr = `${outStr}\n  ));`;
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
