// @flow

const vertex = {
  simple: {
    source:
        'attribute vec2 a_position;' +
        'uniform mat3 u_matrix;' +
        'void main() {' +
          'gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);' +
        '}',
    varNames: ['a_position', 'u_matrix'],
  },
};

const fragment = {
  simple: {
    source:
      'precision mediump float;' +
      'uniform vec4 u_color;' +
      'void main() {' +
        'gl_FragColor = u_color;' +
      '}',
    varNames: ['u_color'],
  },
};

const getShaders = (vName: string = 'simple', fName: string = 'simple') => {
  if (Object.hasOwnProperty.call(vertex, vName) && Object.hasOwnProperty.call(fragment, fName)) {
    return {
      vertexSource: vertex[vName].source,
      fragmentSource: fragment[fName].source,
      varNames: vertex[vName].varNames.concat(fragment[fName].varNames),
    };
  }
  return {
    vertexSource: '',
    fragmentSource: '',
    varNames: [],
  };
};

export default getShaders;

