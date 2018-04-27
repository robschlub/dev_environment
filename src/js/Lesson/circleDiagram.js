// @flow

import Diagram from '../diagram/Diagram';
import { DiagramElementCollection, DiagramElementPrimative } from '../diagram/Element';
import { Point } from '../diagram/tools/g2';
import styles from './lessonStyle.scss';
import getSCSSColors from '../tools/css';

const colors = getSCSSColors(styles);
const anchorColor = colors.colorAnchor;
const radiusColor = colors.colorRadius;
const anchorRadius = 0.05;
const anchorPoints = 50;
const circleRadius = 0.8;
const lineWidth = 0.02;

type typeCircleDiagramCollection = {
  _anchor: DiagramElementPrimative;
} & DiagramElementCollection ;

// function makeAnchor(shapes: Object, location: Point) {
//   const anchor = shapes.polygon(vertices, true, lineWidth, lineColor);

//   return square;
// }
// $FlowFixMe
class CircleDiagram extends Diagram {
  elements: typeCircleDiagramCollection;

  constructor(id: string) {
    super(`${id}_container`, -1, -1, 2, 2);
  }
  createDiagramElements() {
    const { shapes } = this;
    this.elements = shapes.collection();
    const origin = new Point(0, 0);

    const radius = shapes.horizontalLine(
      origin, circleRadius, lineWidth,
      0, radiusColor, origin,
    );
    this.add('radius', radius);

    const anchor = shapes.polygonFilled(
      anchorPoints, anchorRadius, 0,
      anchorPoints, anchorColor, origin,
    );
    this.add('anchor', anchor);
  }
}

export default CircleDiagram;
