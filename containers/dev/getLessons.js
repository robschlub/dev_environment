const fs = require('fs');
const path = require('path');

function walkSync(currentDirPath, callback) {
  fs.readdirSync(currentDirPath).forEach((name) => {
    const filePath = path.join(currentDirPath, name);
    const stat = fs.statSync(filePath);
    if (stat.isFile()) {
      if (name === 'lesson.js') {
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
  const lessonDescriptions = [];
  let outStr = `
import LessonDescription from './lessonIndex';
export default function getLessonIndex() {
  const lessonIndex = [];
  `;
  lessons.forEach((lessonPath) => {
    const path = lessonPath.replace(/src/, '');
    const content = `${lessonPath}/content.js`
    let title = '';
    if (fs.existsSync(content)) {
      const lines = fs.readFileSync(content).toString().split("\n");
      lines.forEach((line) => {
        if (line.match(/^ *this.title *= */)) {
            title = line.replace(/^ *this.title *= *['"]/, '');
            title = title.replace(/['"] *;/, '');
            return
          }
      })
    }
    if (title !== '') {
      // outStr = `${outStr}\n${path}  ${title}`
      outStr = `${outStr}\n  lessonIndex.push(new LessonDescription(\n    '${title}',\n    '${path}',\n  ));`
    }
  });
  outStr = `${outStr}\n  return lessonIndex;\n}\n`
  if (outStr !== '') {
    fs.writeFile('./src/Lessons/index.js', outStr, (err) => {
      if (err) {
        console.log(err)
      }
    });
  }
}

module.exports = {
  entryPoints, makeLessonIndex,
};

// entryPoints();
