// @flow

import Diagram from '../diagram/Diagram';
import { DiagramElementCollection, DiagramElementPrimative } from '../diagram/Element';
import { Point } from '../diagram/tools/g2';
import styles from './lessonStyle.scss';
import getSCSSColors from '../tools/css';

const colors = getSCSSColors(styles);
const anchorColor = colors.colorAnchor;

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
    const anchor = shapes.polygonFilled(100, 0.1, 0, 100, anchorColor, origin);
    this.add('anchor', anchor);
  }
}

export default CircleDiagram;
