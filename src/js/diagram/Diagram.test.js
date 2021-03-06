import {
  DiagramElementPrimative,
  DiagramElementCollection,
  // AnimationPhase,
} from './Element';
import Diagram from './Diagram';
import {
  Point, Transform, TransformLimit, Rect,
} from './tools/g2';
import webgl from '../__mocks__/WebGLInstanceMock';
import DrawContext2D from '../__mocks__/DrawContext2DMock';
import VertexPolygon from './DrawingObjects/VertexObject/VertexPolygon';

jest.mock('./Gesture');
jest.mock('./webgl/webgl');
jest.mock('./DrawContext2D');
jest.mock('../tools/tools');

describe('Diagram', () => {
  let diagrams;

  beforeEach(() => {
    document.body.innerHTML =
      '<div id="c">'
      + '  <canvas class="diagram__gl" id="id_diagram__gl__low">'
      + '  </canvas>'
      + '  <canvas class="diagram__text" id="id_diagram__text__low">'
      + '  </canvas>'
      + '  <div class="diagram__html">'
      + '  </div>'
      + '  <canvas class="diagram__gl" id="id_diagram__gl__high">'
      + '  </canvas>'
      + '  <canvas class="diagram__text" id="id_diagram__text__high">'
      + '  </canvas>'
      + '</div>';
    // canvas = document.getElementById('c');
    const diagramDefinitions = {
      landscapeCenter: {
        width: 1000,
        height: 500,
        limits: new Rect(-1, -1, 2, 2),
      },
      landscapeOffset: {
        width: 1000,
        height: 500,
        limits: new Rect(0, 0, 4, 2),
      },
      portraitCenter: {
        width: 500,
        height: 1000,
        limits: new Rect(-1, -1, 2, 2),
      },
      portraitOffset: {
        width: 500,
        height: 1000,
        limits: new Rect(0, 0, 2, 4),
      },
      squareCenter: {
        width: 1000,
        height: 1000,
        limits: new Rect(-1, -1, 2, 2),
      },
      squareOffset: {
        width: 1000,
        height: 1000,
        limits: new Rect(0, 0, 4, 4),
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
        // offsetLeft: 100,
        left: 100,
        // offsetTop: 200,
        top: 200,
        // width: definition.width,
        // height: definition.height,
        offsetWidth: definition.width,
        offsetHeight: definition.height,
        scrollLeft: 0,
        scrollTop: 0,
        // eslint-disable-next-line arrow-body-style
        getBoundingClientRect: () => {
          return {
            left: 100,
            top: 200,
            width: definition.width,
            height: definition.height,
          };
        },
      };
      const htmlCanvasMock = {
        style: {
          fontsize: 1,
        },
        offsetWidth: 100,
      };
      const { limits } = definition;
      const diagram = new Diagram('c', limits);
      diagram.webglLow = webgl;
      diagram.webglHigh = webgl;
      diagram.canvasLow = canvasMock;
      diagram.canvasHigh = canvasMock;
      diagram.htmlCanvas = htmlCanvasMock;
      diagram.isTouchDevice = false;
      diagram.draw2DLow = new DrawContext2D(definition.width, definition.height);
      diagram.draw2DHigh = new DrawContext2D(definition.width, definition.height);
      diagram.setSpaceTransforms();
      // create squares:
      const squares = {};
      const collection = new DiagramElementCollection(new Transform().scale(1, 1).rotate(0).translate(0, 0), 'c', diagram.limits);
      Object.keys(squareDefinitions).forEach((sKey) => {
        const def = squareDefinitions[sKey];
        const square = new VertexPolygon(
          diagram.webglLow,
          4,
          (def.sideLength / 2) * Math.sqrt(2), 0.05 * Math.sqrt(2),
          def.rotation, def.center,
        );
        const squareElement = new DiagramElementPrimative(
          square, def.transform,
          [0, 0, 1, 1], diagram.limits,
        );
        squareElement.isMovable = true;
        squareElement.isTouchable = true;
        squareElement.move.limitToDiagram = true;
        squares[sKey] = squareElement;
        collection.add(sKey, squareElement);
        collection.isTouchable = true;
      });
      diagram.moveTopElementOnly = false;
      diagram.elements = collection;
      diagram.dToGL = (x, y) => new Point(x, y)
        .transformBy(diagram.diagramToGLSpaceTransform.matrix());
      // diagram.dToP = (x, y) => new Point(x, y)
      //   .transformBy(diagram.diagramToPixelSpaceTransform.matrix());
      diagram.dToP = (p) => {
        const pixel = p
          .transformBy(diagram.diagramToPixelSpaceTransform.matrix());
        return pixel.add(new Point(diagram.canvasLow.left, diagram.canvasLow.top));
      };
      diagrams[key] = diagram;
    });
  });
  test('Diagram instantiation', () => {
    const d = diagrams.landscapeCenter;
    expect(d.elements.order).toHaveLength(3);
    expect(d.limits).toEqual(new Rect(-1, -1, 2, 2));
  });
  test('Diagram API', () => {
    const d = new Diagram('c', 0, 0, 4, 4);
    d.webglLow = webgl;      // needed for mocking only
    const squareVertices = new VertexPolygon(
      d.webglLow,            // gl instance
      4,                  // number of sides in polygon
      1,                  // radius to center of corner
      0.05,               // thickness of polygon border
      Math.PI / 4,        // rotation
      new Point(0, 0),    // offset
      4,                  // number of sides to draw
    );
    const square = new DiagramElementPrimative(squareVertices);
    d.add('square', square);
    expect(d.elements.order).toHaveLength(1);
  });
  // describe('pageToClip', () => {
  //   test.only('Landscape center at origin', () => {
  //     const d = diagrams.landscapeCenter;
  //     // top left of canvas of diagram1 should be -1, 1
  //     expect(d.pageToClip(new Point(100, 200))).toEqual(new Point(-1, 1));
  //     // bottom right
  //     expect(d.pageToClip(new Point(1100, 700))).toEqual(new Point(1, -1));
  //     // middle
  //     expect(d.pageToClip((new Point(600, 450))).round()).toEqual(new Point(0, 0));
  //   });
  //   test('Landscape all positive', () => {
  //     const d = diagrams.landscapeOffset;
  //     expect(d.pageToClip(new Point(100, 200))).toEqual(new Point(0, 2));
  //     expect(d.pageToClip(new Point(1100, 700))).toEqual(new Point(4, 0));
  //     expect(d.pageToClip((new Point(600, 450))).round()).toEqual(new Point(2, 1));
  //   });
  //   test('Portrait center at origin', () => {
  //     const d = diagrams.portraitCenter;
  //     expect(d.pageToClip(new Point(100, 200))).toEqual(new Point(-1, 1));
  //     expect(d.pageToClip(new Point(600, 1200))).toEqual(new Point(1, -1));
  //     expect(d.pageToClip((new Point(350, 700))).round()).toEqual(new Point(0, 0));
  //   });
  //   test('Landscape center at positive', () => {
  //     const d = diagrams.portraitOffset;
  //     expect(d.pageToClip(new Point(100, 200))).toEqual(new Point(0, 4));
  //     expect(d.pageToClip(new Point(600, 1200))).toEqual(new Point(2, 0));
  //     expect(d.pageToClip((new Point(350, 700))).round()).toEqual(new Point(1, 2));
  //   });
  //   test('Square center at origin', () => {
  //     const d = diagrams.squareCenter;
  //     expect(d.pageToClip(new Point(100, 200))).toEqual(new Point(-1, 1));
  //     expect(d.pageToClip(new Point(1100, 1200))).toEqual(new Point(1, -1));
  //     expect(d.pageToClip((new Point(600, 700))).round()).toEqual(new Point(0, 0));
  //   });
  //   test('Square center at positive', () => {
  //     const d = diagrams.squareOffset;
  //     expect(d.pageToClip(new Point(100, 200))).toEqual(new Point(0, 4));
  //     expect(d.pageToClip(new Point(1100, 1200))).toEqual(new Point(4, 0));
  //     expect(d.pageToClip((new Point(600, 700))).round()).toEqual(new Point(2, 2));
  //   });
  // });
  // describe('clipToPage', () => {
  //   test('Landscape center at origin', () => {
  //     const d = diagrams.landscapeCenter;
  //     // top left of canvas of diagram1 should be -1, 1
  //     expect(d.clipToPage(new Point(-1, 1))).toEqual(new Point(100, 200));
  //     // bottom right
  //     expect(d.clipToPage(new Point(1, -1))).toEqual(new Point(1100, 700));
  //     // middle
  //     expect(d.clipToPage((new Point(0, 0))).round()).toEqual(new Point(600, 450));
  //   });
  //   test('Landscape all positive', () => {
  //     const d = diagrams.landscapeOffset;
  //     expect(d.clipToPage(new Point(0, 2))).toEqual(new Point(100, 200));
  //     expect(d.clipToPage(new Point(4, 0))).toEqual(new Point(1100, 700));
  //     expect(d.clipToPage((new Point(2, 1))).round()).toEqual(new Point(600, 450));
  //   });
  //   test('Portrait center at origin', () => {
  //     const d = diagrams.portraitCenter;
  //     expect(d.clipToPage(new Point(-1, 1))).toEqual(new Point(100, 200));
  //     expect(d.clipToPage(new Point(1, -1))).toEqual(new Point(600, 1200));
  //     expect(d.clipToPage((new Point(0, 0))).round()).toEqual(new Point(350, 700));
  //   });
  //   test('Landscape center at positive', () => {
  //     const d = diagrams.portraitOffset;
  //     expect(d.clipToPage(new Point(0, 4))).toEqual(new Point(100, 200));
  //     expect(d.clipToPage(new Point(2, 0))).toEqual(new Point(600, 1200));
  //     expect(d.clipToPage((new Point(1, 2))).round()).toEqual(new Point(350, 700));
  //   });
  //   test('Square center at origin', () => {
  //     const d = diagrams.squareCenter;
  //     expect(d.clipToPage(new Point(-1, 1))).toEqual(new Point(100, 200));
  //     expect(d.clipToPage(new Point(1, -1))).toEqual(new Point(1100, 1200));
  //     expect(d.clipToPage((new Point(0, 0))).round()).toEqual(new Point(600, 700));
  //   });
  //   test('Square center at positive', () => {
  //     const d = diagrams.squareOffset;
  //     expect(d.clipToPage(new Point(0, 4))).toEqual(new Point(100, 200));
  //     expect(d.clipToPage(new Point(4, 0))).toEqual(new Point(1100, 1200));
  //     expect(d.clipToPage((new Point(2, 2))).round()).toEqual(new Point(600, 700));
  //   });
  // });
  describe('Test square locations', () => {
    // Show all squares are at the same clip location independent of canvas
    // and diagram offsets
    //
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
      expect(a.isBeingTouched(d.dToGL(-0.249, -0.249))).toBe(true);
      expect(a.isBeingTouched(d.dToGL(0.249, 0.249))).toBe(true);
      expect(a.isBeingTouched(d.dToGL(-0.251, -0.251))).toBe(false);
      expect(a.isBeingTouched(d.dToGL(0.251, 0.251))).toBe(false);
    });
    test('B Landscape Origin', () => {
      // canvasW=1000, canvasH=500, clipL=-1, clipW=2, clipT=1, clipH=2
      const d = diagrams.landscapeCenter;
      d.draw(0);
      const b = d.elements._b;
      expect(b.isBeingTouched(d.dToGL(0.76, 0.76))).toBe(true);
      expect(b.isBeingTouched(d.dToGL(1.24, 1.24))).toBe(true);
      expect(b.isBeingTouched(d.dToGL(0.74, 0.74))).toBe(false);
      expect(b.isBeingTouched(d.dToGL(1.26, 1.26))).toBe(false);
    });
    test('C Landscape Origin', () => {
      // canvasW=1000, canvasH=500, clipL=-1, clipW=2, clipT=1, clipH=2
      const d = diagrams.landscapeCenter;
      d.draw(0);
      const c = d.elements._c;
      expect(c.isBeingTouched(d.dToGL(0.001, 0.001))).toBe(true);
      expect(c.isBeingTouched(d.dToGL(0.99, 0.99))).toBe(true);
      expect(c.isBeingTouched(d.dToGL(-0.001, -0.001))).toBe(false);
      expect(c.isBeingTouched(d.dToGL(1.01, 1.01))).toBe(false);
    });
    test('B Landscape Offset', () => {
      // canvasW=1000, canvasH=500, clipL=0, clipW=4, clipT=2, clipH=2
      // b: square, center=(1, 1), sideLength=0.5
      const d = diagrams.landscapeOffset;
      d.draw(0);
      const b = d.elements._b;
      expect(b.isBeingTouched(d.dToGL(0.76, 0.76))).toBe(true);
      expect(b.isBeingTouched(d.dToGL(1.24, 1.24))).toBe(true);
      expect(b.isBeingTouched(d.dToGL(0.74, 0.74))).toBe(false);
      expect(b.isBeingTouched(d.dToGL(1.26, 1.26))).toBe(false);
    });
    test('C Landscape Offset', () => {
      // canvasW=1000, canvasH=500, clipL=0, clipW=4, clipT=2, clipH=2
      const d = diagrams.landscapeOffset;
      d.draw(0);
      const c = d.elements._c;
      expect(c.isBeingTouched(d.dToGL(0.001, 0.001))).toBe(true);
      expect(c.isBeingTouched(d.dToGL(0.99, 0.99))).toBe(true);
      expect(c.isBeingTouched(d.dToGL(-0.001, -0.001))).toBe(false);
      expect(c.isBeingTouched(d.dToGL(1.01, 1.01))).toBe(false);
    });
    test('B Portrait Origin', () => {
      // canvasW=500, canvasH=1000, clipL=-1, clipW=2, clipT=1, clipH=2
      const d = diagrams.portraitOffset;
      d.draw(0);
      const b = d.elements._b;
      expect(b.isBeingTouched(d.dToGL(0.76, 0.76))).toBe(true);
      expect(b.isBeingTouched(d.dToGL(1.24, 1.24))).toBe(true);
      expect(b.isBeingTouched(d.dToGL(0.74, 0.74))).toBe(false);
      expect(b.isBeingTouched(d.dToGL(1.26, 1.26))).toBe(false);
    });
    test('B Portrait Offset', () => {
      // canvasW=500, canvasH=1000, clipL=0, clipW=2, clipT=4, clipH=4
      const d = diagrams.portraitOffset;
      d.draw(0);
      const b = d.elements._b;
      expect(b.isBeingTouched(d.dToGL(0.76, 0.76))).toBe(true);
      expect(b.isBeingTouched(d.dToGL(1.24, 1.24))).toBe(true);
      expect(b.isBeingTouched(d.dToGL(0.74, 0.74))).toBe(false);
      expect(b.isBeingTouched(d.dToGL(1.26, 1.26))).toBe(false);
    });
    test('B Square Origin', () => {
      const d = diagrams.squareOffset;
      d.draw(0);
      const b = d.elements._b;
      expect(b.isBeingTouched(d.dToGL(0.76, 0.76))).toBe(true);
      expect(b.isBeingTouched(d.dToGL(1.24, 1.24))).toBe(true);
      expect(b.isBeingTouched(d.dToGL(0.74, 0.74))).toBe(false);
      expect(b.isBeingTouched(d.dToGL(1.26, 1.26))).toBe(false);
    });
    test('B Square Offset', () => {
      const d = diagrams.squareOffset;
      d.draw(0);
      const b = d.elements._b;
      expect(b.isBeingTouched(d.dToGL(0.76, 0.76))).toBe(true);
      expect(b.isBeingTouched(d.dToGL(1.24, 1.24))).toBe(true);
      expect(b.isBeingTouched(d.dToGL(0.74, 0.74))).toBe(false);
      expect(b.isBeingTouched(d.dToGL(1.26, 1.26))).toBe(false);
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
      expect(d.beingMovedElements[1]).toBe(d.elements._a);
      expect(d.beingMovedElements[0]).toBe(d.elements._c);
    });
    test('Touch on B and C square', () => {
      // canvasW=1000, canvasH=500, clipL=-1, clipW=2, clipT=1, clipH=2
      const d = diagrams.landscapeCenter;
      d.draw(0);
      expect(d.beingMovedElements).toHaveLength(0);
      d.touchDownHandler(new Point(1099, 201));         // Touch 0.99, 0.99
      expect(d.beingMovedElements).toHaveLength(2);
      expect(d.beingMovedElements[1]).toBe(d.elements._b);
      expect(d.beingMovedElements[0]).toBe(d.elements._c);
    });
    test('Touch on B and C square LandscapeOffset', () => {
      const d = diagrams.landscapeOffset;
      d.draw(0);
      expect(d.beingMovedElements).toHaveLength(0);
      d.touchDownHandler(new Point(349, 451));           // Touch 0.99, 0.99
      expect(d.beingMovedElements).toHaveLength(2);
      expect(d.beingMovedElements[1]).toBe(d.elements._b);
      expect(d.beingMovedElements[0]).toBe(d.elements._c);
    });
  });
  describe('Touch move', () => {
    test('Move just A on Landscape Center', () => {
      // canvasW=1000, canvasH=500, clipL=-1, clipW=2, clipT=1, clipH=2
      const d = diagrams.landscapeCenter;
      d.initialize();
      d.draw(0);

      // Touch A
      const t1 = d.dToP(new Point(-0.001, -0.001));
      // console.log(new Point(-0.001, -0.001).transformBy(d.diagramToPixelSpaceTransform.matrix()))
      // console.log(t1)
      // Move to 0.25, 0.25
      const t2 = d.dToP(new Point(0.25, 0.25));
      // A center will move to 0.25, 0.25
      const a2 = new Point(0.25, 0.25);

      // Move to 2, 0.25
      const t3 = d.dToP(new Point(2, 0.25));
      // A center will move to 0.75, 0.25 as will be clipped by canvas
      const a3 = new Point(0.75, 0.25);

      d.touchDownHandler(t1);          // Touch -0.01, -0.01
      expect(d.beingMovedElements).toHaveLength(1);
      expect(d.beingMovedElements[0]).toBe(d.elements._a);

      // Move to 0.25, 0.25
      d.touchMoveHandler(t1, t2);
      expect(d.beingMovedElements).toHaveLength(1);
      expect(d.beingMovedElements[0]).toBe(d.elements._a);
      expect(d.elements._a.transform.t().round(2)).toEqual(a2);

      // Move beyond border - should stop at 0.75 as side length is 0.5
      d.touchMoveHandler(t2, t3);
      expect(d.beingMovedElements).toHaveLength(1);
      expect(d.beingMovedElements[0]).toBe(d.elements._a);
      expect(d.elements._a.transform.t().round(2)).toEqual(a3);
    });
    test('Move A and C on Landscape Center', () => {
      // canvasW=1000, canvasH=500, clipL=-1, clipW=2, clipT=1, clipH=2
      const d = diagrams.landscapeCenter;
      d.initialize();
      d.draw(0);

      // Touch A and C
      const t1 = d.dToP(new Point(0.001, 0.001));

      // Move to 0.25, 0.25
      const t2 = d.dToP(new Point(-0.25, -0.25));
      // A center will move to -0.25, -0.25
      const a2 = new Point(-0.25, -0.25);
      // C corner will move to (-0.25, -0.25), and center to (0.25, 0.25)
      const c2 = new Point(0.25, 0.25);

      // Move to -2, -2
      const t3 = d.dToP(new Point(-2, -2));
      // A will get stuck at -0.75, -0.75
      const a3 = new Point(-0.75, -0.75);
      // C will get stuck at -0.5, -0.5
      const c3 = new Point(-0.5, -0.5);

      d.touchDownHandler(t1);          // Touch -0.01, -0.01
      expect(d.beingMovedElements).toHaveLength(2);
      expect(d.beingMovedElements[1]).toBe(d.elements._a);
      expect(d.beingMovedElements[0]).toBe(d.elements._c);
      d.draw(1);

      // Move to 0.25, 0.25
      d.touchMoveHandler(t1, t2);
      expect(d.beingMovedElements).toHaveLength(2);
      expect(d.elements._a.transform.t().round(2)).toEqual(a2);
      expect(d.elements._c.transform.t().round(2)).toEqual(c2);
      d.draw(2);

      // Move beyond border - should stop at 0.75 as side length is 0.5
      d.touchMoveHandler(t2, t3);
      expect(d.beingMovedElements).toHaveLength(2);
      expect(d.elements._a.transform.t().round(2)).toEqual(a3);
      expect(d.elements._c.transform.t().round(2)).toEqual(c3);
    });
    test('Move A and C on Landscape Offset', () => {
      // canvasW=1000, canvasH=500, clipL=0, clipW=4, clipT=2, clipH=2
      const d = diagrams.landscapeOffset;
      d.initialize();
      d.draw(0);

      // Touch A and C
      const t0 = d.dToP(new Point(0.001, 0.001));
      const a0 = new Point(0, 0);
      const c0 = new Point(0.5, 0.5);

      // Very small movement, will clip A back to in border, and touch
      // will now be in corner and not center of A
      const t1 = d.dToP(new Point(0.002, 0.002));
      const a1 = new Point(0.25, 0.25);
      const c1 = new Point(0.5, 0.5);

      // Move to 0.25, 0.25
      const t2 = d.dToP(new Point(0.25, 0.25));
      // A corner will move to (0.25, 0.25) and center to (0.5, 0.5)
      const a2 = new Point(0.5, 0.5);
      // C corner will move to (0.25, 0.25), and center to (0.75, 0.75)
      const c2 = new Point(0.75, 0.75);

      // Move to 4, 4
      const t3 = d.dToP(new Point(4, 4));
      // A will get stuck at 3.75, 1.75
      const a3 = new Point(3.75, 1.75);
      // C will get stuck at 3.5, 1.5
      const c3 = new Point(3.5, 1.5);

      d.touchDownHandler(t0);          // Touch -0.01, -0.01
      expect(d.beingMovedElements).toHaveLength(2);
      expect(d.beingMovedElements[1]).toBe(d.elements._a);
      expect(d.beingMovedElements[0]).toBe(d.elements._c);
      expect(d.elements._a.transform.t().round(2)).toEqual(a0);
      expect(d.elements._c.transform.t().round(2)).toEqual(c0);
      d.draw(0.1);

      d.touchMoveHandler(t0, t1);
      expect(d.beingMovedElements).toHaveLength(2);
      expect(d.elements._a.transform.t().round(2)).toEqual(a1);
      expect(d.elements._c.transform.t().round(2)).toEqual(c1);
      d.draw(1);

      // Move to 0.25, 0.25
      d.touchMoveHandler(t1, t2);
      expect(d.beingMovedElements).toHaveLength(2);
      expect(d.elements._a.transform.t().round(2)).toEqual(a2);
      expect(d.elements._c.transform.t().round(2)).toEqual(c2);
      d.draw(2);

      // Move beyond border - should stop at 0.75 as side length is 0.5
      d.touchMoveHandler(t2, t3);
      expect(d.beingMovedElements).toHaveLength(2);
      expect(d.elements._a.transform.t().round(2)).toEqual(a3);
      expect(d.elements._c.transform.t().round(2)).toEqual(c3);
    });
    test('Move A and C on Portrait Offset', () => {
      // canvasW=500, canvasH=1000, clipL=0, clipW=2, clipT=4, clipH=4
      const d = diagrams.portraitOffset;
      d.initialize();
      d.draw(0);

      // Touch A and C
      const t0 = d.dToP(new Point(0.001, 0.001));
      const a0 = new Point(0, 0);
      const c0 = new Point(0.5, 0.5);

      // Very small movement, will clip A back to in border, and touch
      // will now be in corner and not center of A
      const t1 = d.dToP(new Point(0.002, 0.002));
      const a1 = new Point(0.25, 0.25);
      const c1 = new Point(0.5, 0.5);

      // Move to 0.25, 0.25
      const t2 = d.dToP(new Point(0.25, 0.25));
      // A corner will move to (0.25, 0.25) and center to (0.5, 0.5)
      const a2 = new Point(0.5, 0.5);
      // C corner will move to (0.25, 0.25), and center to (0.75, 0.75)
      const c2 = new Point(0.75, 0.75);

      // Move to 4, 4
      const t3 = d.dToP(new Point(4, 4));
      // A will get stuck at 1.75, 3.75
      const a3 = new Point(1.75, 3.75);
      // C will get stuck at 1.5, 3.5
      const c3 = new Point(1.5, 3.5);

      d.touchDownHandler(t0);          // Touch -0.01, -0.01
      expect(d.beingMovedElements).toHaveLength(2);
      expect(d.beingMovedElements[1]).toBe(d.elements._a);
      expect(d.beingMovedElements[0]).toBe(d.elements._c);
      expect(d.elements._a.transform.t().round(2)).toEqual(a0);
      expect(d.elements._c.transform.t().round(2)).toEqual(c0);
      d.draw(0.1);

      d.touchMoveHandler(t0, t1);
      expect(d.beingMovedElements).toHaveLength(2);
      expect(d.elements._a.transform.t().round(2)).toEqual(a1);
      expect(d.elements._c.transform.t().round(2)).toEqual(c1);
      d.draw(1);

      // Move to 0.25, 0.25
      d.touchMoveHandler(t1, t2);
      expect(d.beingMovedElements).toHaveLength(2);
      expect(d.elements._a.transform.t().round(2)).toEqual(a2);
      expect(d.elements._c.transform.t().round(2)).toEqual(c2);
      d.draw(2);

      // Move beyond border - should stop at 0.75 as side length is 0.5
      d.touchMoveHandler(t2, t3);
      expect(d.beingMovedElements).toHaveLength(2);
      expect(d.elements._a.transform.t().round(2)).toEqual(a3);
      expect(d.elements._c.transform.t().round(2)).toEqual(c3);
    });
  });
  describe('Touch move freely', () => {
    test('Move A and let go', () => {
      const RealDate = Date.now;
      // canvasW=1000, canvasH=500, clipL=-1, clipW=2, clipT=1, clipH=2
      const d = diagrams.landscapeCenter;
      d.initialize();
      const a = d.elements._a;
      const decel = new TransformLimit(1, 1, 0.5);
      a.move.freely.deceleration = decel;

      // Touch A
      const t0 = d.dToP(new Point(-0.001, -0.001));
      const t1 = d.dToP(new Point(0, 0));

      // Move to 0.07, 0.07 in 0.1s - so velocity should be 0.7 clip unit / s
      // for each component, which is 0.989
      const t2 = d.dToP(new Point(0.07, 0.07));
      // A center will move to 0.07, 0.07
      const a2 = new Point(0.07, 0.07);
      const v2 = new Point(0.7, 0.7);

      // Starting at v = 0.7 clip unit / s (0.989 mag velocity)
      // and at position (0.07, 0.07)
      // after 1s, with a deceleration of 0.5 clip units/s)
      // v1 = v1 - at
      //    = 0.989 - 0.5 = 0.489
      //    = 0.345x + 0.345y
      const v3 = new Point(0.346, 0.346);
      // s = s0 + v0*t - 0.5*at^2
      //   = 0 + 0.989 - 0.5*0.5
      //   = 0.739
      //   = 0.523x, 0.523y
      const a3 = new Point(0.524 + 0.07, 0.524 + 0.07);

      // Then after 10 more seconds, it should be stopped, clipped
      // at 0.75, 0.75
      const v4 = new Point(0, 0);
      const a4 = new Point(0.75, 0.75);

      // Start at time 0
      Date.now = () => 0;
      d.draw(0);
      d.touchDownHandler(t0);

      // Initial small movement to get center at 0,0 for easier math
      Date.now = () => 1;
      d.touchMoveHandler(t0, t1);
      expect(d.beingMovedElements).toHaveLength(1);
      expect(d.beingMovedElements[0]).toBe(a);
      d.draw(0.001);

      // Move to (0.1, 0.1) in 0.1s, velocity should be approx 1
      Date.now = () => 101;
      d.touchMoveHandler(t1, t2);
      expect(d.beingMovedElements).toHaveLength(1);
      expect(d.beingMovedElements[0]).toBe(a);
      expect(a.transform.t().round(2)).toEqual(a2);
      expect(a.state.movement.velocity.t().round(2)).toEqual(v2);
      d.draw(0.101);

      // Double check moving state is correct
      expect(a.state.isMovingFreely).toBe(false);
      expect(a.state.isBeingMoved).toBe(true);

      // Lift up touch
      d.touchUpHandler();
      expect(a.transform.t().round(2)).toEqual(a2);
      expect(a.state.isMovingFreely).toBe(true);
      expect(a.state.isBeingMoved).toBe(false);
      d.draw(1);   // first frame is lost in moving freely
      d.draw(2);   // second frame is one second later
      // initial velocity of 1 units/s, with deceleration of 0.5*sqrt(2)
      //   - new velocity = 0.5 units/s
      expect(a.state.movement.velocity.t().round(3)).toEqual(v3);
      expect(a.transform.t().round(3)).toEqual(a3.round(3));

      d.draw(12);
      expect(a.state.movement.velocity.t()).toEqual(v4);
      expect(a.transform.t().round(3)).toEqual(a4);
      expect(a.state.isMovingFreely).toBe(false);

      Date.now = RealDate;
    });
  });
});
