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

module.exports = {
  entryPoints,
};

// entryPoints();
