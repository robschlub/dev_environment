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
  let diagram1;
  let canvas;
  let canvasMock;
  let diagram2;
  beforeEach(() => {
    document.body.innerHTML =
      '<div>' +
      '  <canvas id="c">' +
      '  </canvas>' +
      '</div>';
    canvas = document.getElementById('c');
    canvasMock = {};
    canvasMock.width = 1000;
    canvasMock.height = 500;
    canvasMock.offsetLeft = 100;
    canvasMock.offsetTop = 200;
    canvasMock.offsetWidth = canvasMock.width;
    canvasMock.offsetHeight = canvasMock.height;
    diagram1 = new Diagram({}, canvas, -1, 1, 2, 2);
    diagram1.webgl = webgl;
    diagram1.canvas = canvasMock;

    diagram2 = new Diagram({}, canvas, 0, 2, 4, 2);
    diagram2.webgl = webgl;
    diagram2.canvas = canvasMock;
  });
  test('Diagram instantiation', () => {
    expect(diagram1.elements.order).toHaveLength(0);
    expect(diagram1.clipRect).toEqual(new Rect(-1, 1, 2, 2));
  });
  test('screenToClip diagram1', () => {
    // top left of canvas of diagram1 should be -1, 1
    expect(diagram1.screenToClip(new Point(100, 200))).toEqual(new Point(-1, 1));
  });
  test('screenToClip diagram2', () => {
    // top left of canvas of diagram2 should be 0, 2
    expect(diagram2.screenToClip(new Point(100, 200))).toEqual(new Point(0, 2));
  });
  // test('screenToClip')
});
