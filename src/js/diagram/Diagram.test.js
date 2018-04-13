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
  let diagrams;
  let canvas;

  beforeEach(() => {
    document.body.innerHTML =
      '<div>' +
      '  <canvas id="c">' +
      '  </canvas>' +
      '</div>';
    canvas = document.getElementById('c');
    const diagramDefinitions = {
      landscapeCenter: {
        width: 1000,
        height: 500,
        limits: [-1, 1, 2, 2],
      },
      landscapeOffset: {
        width: 1000,
        height: 500,
        limits: [0, 2, 4, 2],
      },
      portraitCenter: {
        width: 500,
        height: 1000,
        limits: [-1, 1, 2, 2],
      },
      portraitOffset: {
        width: 500,
        height: 1000,
        limits: [0, 4, 2, 4],
      },
      squareCenter: {
        width: 1000,
        height: 1000,
        limits: [-1, 1, 2, 2],
      },
      squareOffset: {
        width: 1000,
        height: 1000,
        limits: [0, 4, 4, 4],
      },
    };
    const squareDefinitions = {
      a: {
        center: new Point(0, 0),
        sideLength: 0.5,
        rotation: 0,
        transform: new Transform().scale(1, 1).rotate(0).translate(0, 0),
      },
      b: {
        center: new Point(1, 1),
        sideLength: 0.5,
        rotation: 0,
        transform: new Transform().scale(1, 1).rotate(0).translate(0, 0),
      },
      c: {
        center: new Point(1, 1),
        sideLength: 0.5,
        rotation: 0,
        transform: new Transform().scale(2, 2).rotate(0).translate(-0.5, -0.5),
      },
    };
    diagrams = {};

    Object.keys(diagramDefinitions).forEach((key) => {
      const definition = diagramDefinitions[key];
      const canvasMock = {
        width: definition.width,
        height: definition.height,
        offsetLeft: 100,
        offsetTop: 200,
        offsetWidth: definition.width,
        offsetHeight: definition.height,
      };
      const { limits } = definition;
      const diagram = new Diagram({}, canvas, limits[0], limits[1], limits[2], limits[3]);
      diagram.webgl = webgl;
      diagram.canvas = canvasMock;

      // create squares:
      const squares = {};
      const collection = new DiagramElementCollection(new Transform().scale(1, 1).rotate(0).translate(0, 0), 'c', diagram.clipRect);
      Object.keys(squareDefinitions).forEach((sKey) => {
        const def = squareDefinitions[sKey];
        const square = new Polygon(
          diagram.webgl,
          (def.sideLength - 0.025) * Math.sqrt(2), 4, 4, 0.05 * Math.sqrt(2),
          def.rotation, def.center,
        );
        const squareElement = new DiagramElementPrimative(
          square, def.transform,
          [0, 0, 1, 1], '', diagram.clipRect,
        );
        squares[sKey] = squareElement;
        collection.add(sKey, squareElement);
      });
      diagram.elements = collection;
      diagrams[key] = diagram;
    });
    // Square of side 0.5, at (0, 0)
    // const sq = Polygon(
    //   webgl,
    //   0.475 * Math.sqrt(2), 4, 4, 0.05 * Math.sqrt(2),
    //   Math.PI / 4, new Point(0, 0),
    // );

    // square1 = new DiagramElementPrimative(
    //   square, new.Transform().scale(1, 1).rotate(0).translate(0, 0),
    //   [0, 0, 1, 1])
  });
  test('Diagram instantiation', () => {
    const d = diagrams.landscapeCenter;
    expect(d.elements.order).toHaveLength(3);
    expect(d.clipRect).toEqual(new Rect(-1, 1, 2, 2));
  });
  describe('screenToClip', () => {
    test('Landscape center at origin', () => {
      const d = diagrams.landscapeCenter;
      // top left of canvas of diagram1 should be -1, 1
      expect(d.screenToClip(new Point(100, 200))).toEqual(new Point(-1, 1));
      // bottom right
      expect(d.screenToClip(new Point(1100, 700))).toEqual(new Point(1, -1));
      // middle
      expect(d.screenToClip((new Point(600, 450))).round()).toEqual(new Point(0, 0));
    });
    test('Landscape all positive', () => {
      const d = diagrams.landscapeOffset;
      expect(d.screenToClip(new Point(100, 200))).toEqual(new Point(0, 2));
      expect(d.screenToClip(new Point(1100, 700))).toEqual(new Point(4, 0));
      expect(d.screenToClip((new Point(600, 450))).round()).toEqual(new Point(2, 1));
    });
    test('Portrait center at origin', () => {
      const d = diagrams.portraitCenter;
      expect(d.screenToClip(new Point(100, 200))).toEqual(new Point(-1, 1));
      expect(d.screenToClip(new Point(600, 1200))).toEqual(new Point(1, -1));
      expect(d.screenToClip((new Point(350, 700))).round()).toEqual(new Point(0, 0));
    });
    test('Landscape center at positive', () => {
      const d = diagrams.portraitOffset;
      expect(d.screenToClip(new Point(100, 200))).toEqual(new Point(0, 4));
      expect(d.screenToClip(new Point(600, 1200))).toEqual(new Point(2, 0));
      expect(d.screenToClip((new Point(350, 700))).round()).toEqual(new Point(1, 2));
    });
    test('Square center at origin', () => {
      const d = diagrams.squareCenter;
      expect(d.screenToClip(new Point(100, 200))).toEqual(new Point(-1, 1));
      expect(d.screenToClip(new Point(1100, 1200))).toEqual(new Point(1, -1));
      expect(d.screenToClip((new Point(600, 700))).round()).toEqual(new Point(0, 0));
    });
    test('Square center at positive', () => {
      const d = diagrams.squareOffset;
      expect(d.screenToClip(new Point(100, 200))).toEqual(new Point(0, 4));
      expect(d.screenToClip(new Point(1100, 1200))).toEqual(new Point(4, 0));
      expect(d.screenToClip((new Point(600, 700))).round()).toEqual(new Point(2, 2));
    });
  });
  describe('Touch down', () => {
    
  });
});
