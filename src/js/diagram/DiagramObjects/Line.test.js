// import {
//   DiagramElementPrimative,
//   DiagramElementCollection,
//   // AnimationPhase,
// } from '../Element';
import Diagram from '../Diagram';
import {
  Point, Transform, TransformLimit, Rect,
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
    diagram.draw2DHigh = new DrawContext2D(definition.width, definition.height)
    diagram.draw2D = diagram.draw2DLow;
    diagram.setSpaceTransforms();
  });
  test('Diagram instantiation', () => {
    // const d = diagram;
    // expect(d.elements.order).toHaveLength(3);
    expect(diagram.limits).toEqual(new Rect(-1, -1, 2, 2));
  });
});
