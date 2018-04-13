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
        rotation: Math.PI / 4,
        transform: new Transform().scale(1, 1).rotate(0).translate(0, 0),
      },
      b: {
        center: new Point(1, 1),
        sideLength: 0.5,
        rotation: Math.PI / 4,
        transform: new Transform().scale(1, 1).rotate(0).translate(0, 0),
      },
      c: {
        center: new Point(0, 0),
        sideLength: 0.5,
        rotation: Math.PI / 4,
        transform: new Transform().scale(2, 2).rotate(0).translate(0.5, 0.5),
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
          (def.sideLength / 2 - 0.025) * Math.sqrt(2), 4, 4, 0.05 * Math.sqrt(2),
          def.rotation, def.center,
        );
        const squareElement = new DiagramElementPrimative(
          square, def.transform,
          [0, 0, 1, 1], '', diagram.clipRect,
        );
        squareElement.isMovable = true;
        squareElement.isTouchable = true;
        squares[sKey] = squareElement;
        collection.add(sKey, squareElement);
        collection.isTouchable = true;
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
  // Show all squares are at the same clip location independent of canvas
  // and diagram offsets
  describe('Test square locations', () => {
    // Square A should be from (-0.25, -0.25) to (0.25, 0.25)
    // Square B should be from (0, 0) to (1, 1)
    // Square C should be from (0.75, 0.75) to (1.25, 1.25)
    // pageLeft + canvasWidth*(clip - clipRect.left)/clipRect.width
    // pageHeight + canvasHeight*(clipRect.Top - clip)/clipRect.Height
    // clipToPage = function(x,y)
    //   {
    //     return 
    //       {
    //         x: 100 + canvasW*(x - clipL)/clipW, 
    //         y: 200 + canvasH*(clipT - y)/clipH,
    //       }
    //     }
    // pageToClip = function(x, y) {
    //      return {
    //        x: (x - 100)/canvasW * clipW + clipL,
    //        y: clipT - (y - 200)/canvasH * clipH,
    //      } 
    //   }
    test('A Landscape Origin', () => {
      // canvasW=1000, canvasH=500, clipL=-1, clipW=2, clipT=1, clipH=2
      const d = diagrams.landscapeCenter;
      d.draw(0);
      const a = d.elements._a;
      expect(a.isBeingTouched(new Point(-0.249, -0.249))).toBe(true);
      expect(a.isBeingTouched(new Point(0.249, 0.249))).toBe(true);
      expect(a.isBeingTouched(new Point(-0.251, -0.251))).toBe(false);
      expect(a.isBeingTouched(new Point(0.251, 0.251))).toBe(false);
    });
    test('B Landscape Origin', () => {
      // canvasW=1000, canvasH=500, clipL=-1, clipW=2, clipT=1, clipH=2
      const d = diagrams.landscapeCenter;
      d.draw(0);
      const b = d.elements._b;
      expect(b.isBeingTouched(new Point(0.76, 0.76))).toBe(true);
      expect(b.isBeingTouched(new Point(1.24, 1.24))).toBe(true);
      expect(b.isBeingTouched(new Point(0.74, 0.74))).toBe(false);
      expect(b.isBeingTouched(new Point(1.26, 1.26))).toBe(false);
    });
    test('C Landscape Origin', () => {
      // canvasW=1000, canvasH=500, clipL=-1, clipW=2, clipT=1, clipH=2
      const d = diagrams.landscapeCenter;
      d.draw(0);
      const c = d.elements._c;
      expect(c.isBeingTouched(new Point(0.001, 0.001))).toBe(true);
      expect(c.isBeingTouched(new Point(0.99, 0.99))).toBe(true);
      expect(c.isBeingTouched(new Point(-0.001, -0.001))).toBe(false);
      expect(c.isBeingTouched(new Point(1.01, 1.01))).toBe(false);
    });
    test('B Landscape Offset', () => {
      // canvasW=1000, canvasH=500, clipL=0, clipW=4, clipT=2, clipH=2
      const d = diagrams.landscapeOffset;
      d.draw(0);
      const b = d.elements._b;
      expect(b.isBeingTouched(new Point(0.76, 0.76))).toBe(true);
      expect(b.isBeingTouched(new Point(1.24, 1.24))).toBe(true);
      expect(b.isBeingTouched(new Point(0.74, 0.74))).toBe(false);
      expect(b.isBeingTouched(new Point(1.26, 1.26))).toBe(false);
    });
    test('C Landscape Offset', () => {
      const d = diagrams.landscapeOffset;
      d.draw(0);
      const c = d.elements._c;
      expect(c.isBeingTouched(new Point(0.001, 0.001))).toBe(true);
      expect(c.isBeingTouched(new Point(0.99, 0.99))).toBe(true);
      expect(c.isBeingTouched(new Point(-0.001, -0.001))).toBe(false);
      expect(c.isBeingTouched(new Point(1.01, 1.01))).toBe(false);
    });
    test('B Portrait Origin', () => {
      const d = diagrams.portraitOffset;
      d.draw(0);
      const b = d.elements._b;
      expect(b.isBeingTouched(new Point(0.76, 0.76))).toBe(true);
      expect(b.isBeingTouched(new Point(1.24, 1.24))).toBe(true);
      expect(b.isBeingTouched(new Point(0.74, 0.74))).toBe(false);
      expect(b.isBeingTouched(new Point(1.26, 1.26))).toBe(false);
    });
    test('B Portrait Offset', () => {
      const d = diagrams.portraitOffset;
      d.draw(0);
      const b = d.elements._b;
      expect(b.isBeingTouched(new Point(0.76, 0.76))).toBe(true);
      expect(b.isBeingTouched(new Point(1.24, 1.24))).toBe(true);
      expect(b.isBeingTouched(new Point(0.74, 0.74))).toBe(false);
      expect(b.isBeingTouched(new Point(1.26, 1.26))).toBe(false);
    });
    test('B Square Origin', () => {
      const d = diagrams.squareOffset;
      d.draw(0);
      const b = d.elements._b;
      expect(b.isBeingTouched(new Point(0.76, 0.76))).toBe(true);
      expect(b.isBeingTouched(new Point(1.24, 1.24))).toBe(true);
      expect(b.isBeingTouched(new Point(0.74, 0.74))).toBe(false);
      expect(b.isBeingTouched(new Point(1.26, 1.26))).toBe(false);
    });
    test('B Square Offset', () => {
      const d = diagrams.squareOffset;
      d.draw(0);
      const b = d.elements._b;
      expect(b.isBeingTouched(new Point(0.76, 0.76))).toBe(true);
      expect(b.isBeingTouched(new Point(1.24, 1.24))).toBe(true);
      expect(b.isBeingTouched(new Point(0.74, 0.74))).toBe(false);
      expect(b.isBeingTouched(new Point(1.26, 1.26))).toBe(false);
    });
  });
  describe('Touch down', () => {
    test('Touch on A square only', () => {
      // canvasW=1000, canvasH=500, clipL=-1, clipW=2, clipT=1, clipH=2
      const d = diagrams.landscapeCenter;
      d.draw(0);
      expect(d.beingMovedElements).toHaveLength(0);
      d.touchDownHandler(new Point(599, 451));          // Touch -0.01, -0.01
      expect(d.beingMovedElements).toHaveLength(1);
      expect(d.beingMovedElements[0]).toBe(d.elements._a);
    });
    test('Touch on A and C square', () => {
      // canvasW=1000, canvasH=500, clipL=-1, clipW=2, clipT=1, clipH=2
      const d = diagrams.landscapeCenter;
      d.draw(0);
      expect(d.beingMovedElements).toHaveLength(0);
      d.touchDownHandler(new Point(601, 449));          // Touch 0.01, 0.01
      expect(d.beingMovedElements).toHaveLength(2);
      expect(d.beingMovedElements[0]).toBe(d.elements._a);
      expect(d.beingMovedElements[1]).toBe(d.elements._c);
    });
    test('Touch on B and C square', () => {
      // canvasW=1000, canvasH=500, clipL=-1, clipW=2, clipT=1, clipH=2
      const d = diagrams.landscapeCenter;
      d.draw(0);
      expect(d.beingMovedElements).toHaveLength(0);
      d.touchDownHandler(new Point(1099, 201));         // Touch 0.99, 0.99
      expect(d.beingMovedElements).toHaveLength(2);
      expect(d.beingMovedElements[0]).toBe(d.elements._b);
      expect(d.beingMovedElements[1]).toBe(d.elements._c);
    });
    test('Touch on B and C square LandscapeOffset', () => {
      const d = diagrams.landscapeOffset;
      d.draw(0);
      expect(d.beingMovedElements).toHaveLength(0);
      d.touchDownHandler(new Point(349, 451));           // Touch 0.99, 0.99
      expect(d.beingMovedElements).toHaveLength(2);
      expect(d.beingMovedElements[0]).toBe(d.elements._b);
      expect(d.beingMovedElements[1]).toBe(d.elements._c);
    });
  });
  describe('Touch Move', () => {
    test('Move just A', () => {
      // canvasW=1000, canvasH=500, clipL=-1, clipW=2, clipT=1, clipH=2
      const d = diagrams.landscapeCenter;
      d.draw(0);
      d.touchDownHandler(new Point(599, 451));          // Touch -0.01, -0.01
      expect(d.beingMovedElements).toHaveLength(1);
      expect(d.beingMovedElements[0]).toBe(d.elements._a);
      
      // Move to 0.25, 0.25
      d.touchMoveHandler(new Point(599, 451), new Point(725, 387.5));
      expect(d.beingMovedElements).toHaveLength(1);
      expect(d.beingMovedElements[0]).toBe(d.elements._a);
      expect(d.elements._a.transform.t().round(2)).toEqual(new Point(0.25, 0.25));

      // Move beyond border - should stop at 0.75 as side length is 0.5
      d.touchMoveHandler(new Point(725, 387.5), new Point(1600, 387.5));
      expect(d.beingMovedElements).toHaveLength(1);
      expect(d.beingMovedElements[0]).toBe(d.elements._a);
      expect(d.elements._a.transform.t().round(2)).toEqual(new Point(0.75, 0.25));
    })
  })
});
