// @flow
import getColors from '../diagram/colors';
import Diagram from '../diagram/Diagram';
import { DiagramElementColleciton } from '../diagram/Element';
import { Point } from '../diagram/tools/g2';

const colors = getColors();

function makeSquare(shapes: Object, location: Point) {
  const squareVertices = [
    new Point(-0.5, -0.5),
    new Point(0.5, -0.5),
    new Point(0.5, 0.5),
    new Point(-0.5, 0.5),
  ];

  const squareLines = shapes.polyLine(
    squareVertices,
    true,
    0.02,
    colors.colorBlue,
  );

  const squareCorners = shapes.polyLineCorners(
    squareVertices,
    true,
    0.1,
    0.04,
    colors.colorGreen,
  );

  const square = shapes.collection(location);
  square.add('lines', squareLines);
  square.add('corners', squareCorners);
  return square;
}

function makeTriangle(shapes: Object, location: Point) {
  const triVertices = [
    new Point(0, 0.5),
    new Point(0, 0.5).rotate(2 * Math.PI / 3),
    new Point(0, 0.5).rotate(4 * Math.PI / 3),
  ];
  const triangleLines = shapes.polyLine(
    triVertices,
    true,
    0.02,
    colors.colorBlue,
  );

  const triangleCorners = shapes.polyLineCorners(
    triVertices,
    true,
    0.1,
    0.04,
    colors.colorGreen,
  );

  const triangle = shapes.collection(location);
  triangle.add('lines', triangleLines);
  triangle.add('corners', triangleCorners);
  return triangle;
}

function shapesDiagram(id: string) {
  const diagram = new Diagram(`${id}_container`, 0, 0, 4, 2);
  const { shapes } = diagram;

  const square = makeSquare(shapes, new Point(0.75, 0.75));
  diagram.add('square', square);

  const triangle = makeTriangle(shapes, new Point(3, 0.75));
  diagram.add('triangle', triangle);
}

export default shapesDiagram;
