// @flow
import getColors from '../diagram/colors';
import Diagram from '../diagram/Diagram';
import { DiagramElementPrimative } from '../diagram/Element';
import { Transform, Point } from '../diagram/tools/g2';

const colors = getColors();

// import * as shapes from '../diagram/vertexObjects/shapes';

// import TextObject from './textObjects/TextObject';
// // import HorizontalLine from './vertexObjects/HorizontalLine';

// import GLParallelLines from './vertexObjects/glParallelLines';
// // import * as m2 from './m2';
// // import { Console } from '../tools/tools';

// // import GlobalVariables from './globals';
// import Diagram from './Diagram';
// import * as tools from './tools/mathtools';
// import TickMarks from './DiagramElements/TickMarks';
// // import Axis from './DiagramElements/Plot/Axis';
// import { AxisProperties } from './DiagramElements/Plot/AxisProperties';
// import { CartesianPlotProperties, TraceProperties } from './DiagramElements/Plot/CartesianPlotProperties';
// import CartesianPlot from './DiagramElements/Plot/CartesianPlot';
// import getColors from './colors';

// class ShapesCollection extends DiagramElementCollection {
//   _square: DiagramElementPrimative;
//   _triangle: DiagramElementPrimative;
//   _corners: DiagramElementPrimative;
//   _pline: DiagramElementPrimative;
//   _arrow: DiagramElementPrimative;
//   _radial: DiagramElementPrimative;
//   _helloText: DiagramElementPrimative;

//   constructor(webgl, ctx, transform, diagramLimits) {
//     super(transform);

//     const square = new shapes.Polygon(
//       webgl,
//       4,
//       0.475 * Math.sqrt(2), 0.05 * Math.sqrt(2),
//       Math.PI / 4, new Point(0, 0),
//     );

//     const triangle = new PolygonFilled(
//       webgl,
//       3,
//       0.2,
//       0, new Point(0, 0),
//     );

//     const corners = new VertexPolyLineCorners(
//       webgl,
//       [
//         new Point(1, 0),
//         new Point(0, 0),
//         new Point(0, 1),
//         new Point(1, 1),
//       ],
//       true,
//       0.25,
//       0.1,
//     );

//     const polyLine = new VertexPolyLine(
//       webgl,
//       [
//         new Point(0, 0),
//         new Point(0.5, 0.5),
//         new Point(0.5, 1),
//         new Point(0, 0.75),
//       ],
//       false,
//       0.1,
//     );

//     const radialVertices = new RadialLines(
//       webgl,
//       0,
//       0.5,
//       0.01,
//       Math.PI / 9,
//       Math.PI * 2,
//     );

//     const xTicks = new GLParallelLines(webgl, 20, 1, new Point(0, 0), 2, 0.004, true, false);

//     // const xMinorTicks = new GLParallelLines(webgl, 50,)

//     const arrowVertices = new Arrow(webgl);

//     const textObject = new TextObject(ctx, 'Hello World!', new Point(0.5, 1), ['left', 'top'], new Point(0.5, 0.5));

//     this.add('helloText', new DiagramElementPrimative(
//       textObject,
//       new Transform().translate(1, 1),
//       colors.colorBlue, diagramLimits,
//     ));
//     const hw = this._helloText;
//     hw.isTouchable = true;
//     hw.isMovable = true;

//     this.add('square', new DiagramElementPrimative(
//       square,
//       new Transform().scale(0.5, 0.5).rotate(0.1).translate(1, 1),
//       colors.colorBlue, diagramLimits,
//     ));

//     const sq = this._square;
//     sq.isTouchable = true;
//     sq.isMovable = true;

//     this.add('triangle', new DiagramElementPrimative(
//       triangle,
//       new Transform().scale(1.5, 1.5).translate(2, 1),
//       colors.colorGreen, diagramLimits,
//     ));

//     const tri = this._triangle;
//     tri.isTouchable = true;
//     tri.isMovable = true;

//     this.add('corners', new DiagramElementPrimative(
//       corners,
//       new Transform().translate(0.5, 0.5),
//       colors.colorYellow, diagramLimits,
//     ));

//     const corn = this._corners;
//     corn.isTouchable = true;
//     corn.isMovable = true;

//     this.add('pline', new DiagramElementPrimative(
//       polyLine,
//       new Transform().translate(1, 2),
//       colors.colorRed, diagramLimits,
//     ));

//     const pline = this._pline;
//     pline.isTouchable = true;
//     pline.isMovable = true;

//     this.add('arrow', new DiagramElementPrimative(
//       arrowVertices,
//       new Transform().scale(0.7, 0.4).translate(0.5, 1),
//       colors.colorRed, diagramLimits,
//     ));

//     const arrow = this._arrow;
//     arrow.isTouchable = true;
//     arrow.isMovable = true;

//     this.add('radial', new DiagramElementPrimative(
//       radialVertices,
//       new Transform().translate(2, 1),
//       colors.colorBlue, diagramLimits,
//     ));

//     const radial = this._radial;
//     radial.isTouchable = true;
//     radial.isMovable = true;


//     // this.add('yAxis1', axis2);
//     const trace = new TraceProperties(
//       'trace1',
//       colors.colorBlue,
//       [new Point(0, 0), new Point(10, 5), new Point(50, 10), new Point(80, 20)],
//     );
//     const plotProps = new CartesianPlotProperties();
//     plotProps.axes = [xProps, yProps];
//     plotProps.traces = [trace];
//     const plot = new CartesianPlot(
//       webgl, ctx, plotProps,
//       new Transform().translate(3, 1),
//       diagramLimits,
//     );
//     // plot._trace1.isTouchable = true;
//     // plot._trace1.isMovable = true;

//     plot.isTouchable = true;
//     plot.isMovable = true;
//     this.add('plot', plot);
//   }
// }

// class Diagram1 extends Diagram {
//   elements: ShapesCollection | DiagramElementCollection;

//   createDiagramElements() {
//     this.elements = new ShapesCollection(
//       this.webgl,
//       this.draw2D,
//       new Transform().rotate(0).translate(0, 0),
//       this.limits,
//     );
//   }
// }


function shapesDiagram(id: string) {
  const diagram = new Diagram(`${id}_container`, 0, 0, 4, 2);
  const shapes = Diagram.shapes();

  const squareVertices = [
    new Point(-0.5, -0.5),
    new Point(0.5, -0.5),
    new Point(0.5, 0.5),
    new Point(-0.5, 0.5),
  ];
  const squareLines = new shapes.VertexPolyLine(diagram.webgl, squareVertices, true, 0.02);
  const squareCorners = new shapes.VertexPolyLineCorners(diagram.webgl, squareVertices, true, 0.25, 0.1);

  const squareElement = new DiagramElementPrimative(
    squareLines, new Transform().translate(3, 0.75), colors.colorBlue,
    diagram.limits,
  );

  const squareCornerElement = new DiagramElementPrimative(
    squareCorners, new Transform().translate(3, 0.75), colors.colorRed,
    diagram.limits,
  );

  diagram.add('square', squareElement);
  diagram.add('squareCorners', squareCornerElement);

  if (diagram) {
    diagram.animateNextFrame();
  }
}

export default shapesDiagram;
