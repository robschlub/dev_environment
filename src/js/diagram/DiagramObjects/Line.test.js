// import {
//   DiagramElementPrimative,
//   DiagramElementCollection,
//   // AnimationPhase,
// } from '../Element';
import Diagram from '../Diagram';
import {
  Point, Rect,
} from '../tools/g2';
import webgl from '../../__mocks__/WebGLInstanceMock';
import DrawContext2D from '../../__mocks__/DrawContext2DMock';
// import VertexPolygon from '../DrawingObjects/VertexObject/VertexPolygon';

jest.mock('../Gesture');
jest.mock('../webgl/webgl');
jest.mock('../DrawContext2D');
jest.mock('../../tools/tools');

describe('Diagram', () => {
  let diagram;

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
    const definition = {
      width: 1000,
      height: 500,
      limits: new Rect(-1, -1, 2, 2),
    };

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
    diagram = new Diagram('c', limits);
    diagram.webglLow = webgl;
    diagram.webglHigh = webgl;
    diagram.webgl = webgl;
    diagram.canvasLow = canvasMock;
    diagram.canvasHigh = canvasMock;
    diagram.htmlCanvas = htmlCanvasMock;
    diagram.isTouchDevice = false;
    diagram.draw2DLow = new DrawContext2D(definition.width, definition.height);
    diagram.draw2DHigh = new DrawContext2D(definition.width, definition.height);
    diagram.draw2D = diagram.draw2DLow;
    diagram.shapesLow = diagram.getShapes(false);
    diagram.shapesHigh = diagram.getShapes(true);
    diagram.shapes = diagram.shapesLow;
    diagram.equationLow = diagram.getEquations(false);
    diagram.equationHigh = diagram.getEquations(true);
    diagram.equation = diagram.equationLow;
    diagram.objectsLow = diagram.getObjects(false);
    diagram.objectsHigh = diagram.getObjects(true);
    diagram.objects = diagram.objectsLow;
    diagram.setSpaceTransforms();
  });
  test('Diagram instantiation', () => {
    expect(diagram.limits).toEqual(new Rect(-1, -1, 2, 2));
  });
  describe('Vertex Origin', () => {
    let position;
    let length;
    let angle;
    let width;
    let makeLine;
    beforeEach(() => {
      position = new Point(1, 1);
      length = 2;
      angle = 5;
      width = 0.2;
      makeLine = vertexOrigin => diagram.objects.lineNew(
        position, length, angle, width, [1, 0, 0, 1],
        vertexOrigin, true, true,
      );
    });

    test('End', () => {
      const line = makeLine('end');
      expect(line._line.drawingObject.points).toEqual([
        -1, -0.1,
        -1, 0.1,
        0, -0.1,
        0, 0.1,
      ]);
    });
    test('start', () => {
      const line = makeLine('start');
      expect(line._line.drawingObject.points).toEqual([
        0, -0.1,
        0, 0.1,
        1, -0.1,
        1, 0.1,
      ]);
    });
    test('center', () => {
      const line = makeLine('center');
      expect(line._line.drawingObject.points).toEqual([
        -0.5, -0.1,
        -0.5, 0.1,
        0.5, -0.1,
        0.5, 0.1,
      ]);
    });
    test('40%', () => {
      const line = makeLine(0.4);
      expect(line._line.drawingObject.points).toEqual([
        -0.4, -0.1,
        -0.4, 0.1,
        0.6, -0.1,
        0.6, 0.1,
      ]);
    });
    test('Point', () => {
      const line = makeLine(new Point(-1, 2));
      expect(line._line.drawingObject.points).toEqual([
        -1, 1.9,
        -1, 2.1,
        0, 1.9,
        0, 2.1,
      ]);
    });
  });
  // test('Simple Line', () => {
  //   const position = new Point(0, 0);
  //   const length = 1;
  //   const angle = 0;
  //   const width = 0.2;
  //   const vertexOrigin = 'end';
  //   const line = diagram.objects.lineNew(
  //     position, length, angle, width, [1, 0, 0, 1], vertexOrigin, true, true,
  //   );
  //   console.log(line._line.drawingObject)
  // });
});
