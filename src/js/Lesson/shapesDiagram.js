// @flow
import getColors from '../diagram/colors';
import Diagram from '../diagram/Diagram';
import { Point } from '../diagram/tools/g2';

const colors = getColors();

function shapesDiagram(id: string) {
  const diagram = new Diagram(`${id}_container`, 0, 0, 4, 2);
  const { shapes } = diagram;

  const squareVertices = [
    new Point(-0.5, -0.5),
    new Point(0.5, -0.5),
    new Point(0.5, 0.5),
    new Point(-0.5, 0.5),
  ];

  const square = shapes.polyLine(
    squareVertices,
    true,
    0.02,
    colors.colorBlue,
    new Point(0.75, 0.75),
  );

  const squareCorners = shapes.polyLineCorners(
    squareVertices,
    true,
    0.1,
    0.04,
    colors.colorBlueDark,
    new Point(0.75, 0.75),
  );

  diagram.add('square', square);
  diagram.add('squareCorners', squareCorners);
}

export default shapesDiagram;
