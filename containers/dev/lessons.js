
function entryPoints() {
  return {
    main: ['whatwg-fetch', 'babel-polyfill', './src/js/main.js'],
    'Lessons/Math/lesson1/lesson': './src/Lessons/circlesAndAngles/lesson.js',
    'Lessons/Math/test1/lesson': './src/Lessons/shapesAndCornersTest/lesson.js',
  };
}

module.exports = {
  entryPoints: entryPoints,
};
