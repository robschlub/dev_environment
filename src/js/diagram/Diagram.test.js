import {
  DiagramElementPrimative,
  DiagramElementCollection,
  AnimationPhase,
} from './Element';
import Diagram from './Diagram';
import { Point, Transform, TransformLimit, Rect } from './g2';
import webgl from '../__mocks__/WebGLInstanceMock';
import Polygon from './vertexObjects/Polygon';
import { linear, round } from './mathtools';
import Gesture from './Gesture';
import WebGLInstance from './webgl';
// import * as m2 from './m2';

jest.mock('./Gesture');
jest.mock('./webgl');

describe('Diagram', () => {
  let diagram;
  let canvas;
  beforeEach(() => {
    document.body.innerHTML =
      '<div>' +
      '  <canvas id="c">' +
      '  </canvas>' +
      '</div>';
    canvas = document.getElementById('c');
    diagram = new Diagram({}, canvas, -1, 1, 2, 2);
    diagram.webgl = webgl;
  });
  test('Diagram instantiation', () => {
    expect(diagram.elements.order).toHaveLength(0);
    expect(diagram.clipRect).toEqual(new Rect(-1, 1, 2, 2));
  });
});
