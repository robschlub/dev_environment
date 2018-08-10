// @flow

import Diagram from '../../../js/diagram/Diagram';
import {
  Transform, Point, minAngleDiff, polarToRect,
} from '../../../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../../js/diagram/Element';
import lessonLayout from './layout';
// import { Equation } from '../../../js/diagram/DiagramElements/Equation/GLEquation';


class RelatedAnglesCollection extends DiagramElementCollection {
  layout: Object;
  colors: Object;
  shapes: Object;
  diagram: Diagram;
  // varState: TypeVarStateExtended;
  // anglePairNames: Array<string>;
  // eqn: TypeMainTextEquation;

  // makeSelector(titles: Object, yPosition: number = )

  makeSelector(titles: Object, yPosition: number = 1.8) {
    const selector = this.diagram.shapes.collection();
    let width = 0;
    const widthRecord = [];

    Object.keys(titles).forEach((key) => {
      const text = this.diagram.shapes.text(
        titles[key],
        new Point(0, 0),
        this.layout.selectorFont.color,
        this.layout.selectorFont,
      );
      text.setFirstTransform(this.diagram.diagramToGLSpaceTransform);
      text.isTouchable = true;
      text.onClick = this.selectorClicked.bind(this, key);
      const bounds = text.getRelativeDiagramBoundingRect();
      width += bounds.width;
      widthRecord.push(bounds.width);
      selector.add(key, text);
    });

    const numTitles = Object.keys(titles).length;
    const spacing = (this.diagram.limits.width - width) / numTitles;
    let x = this.diagram.limits.left + spacing / 2;
    selector.order.forEach((key, index) => {
      // console.log(key, x, widthRecord[index])
      const element = selector.elements[key];
      element.setPosition(x + widthRecord[index] / 2, yPosition);
      x += widthRecord[index] + spacing;
    });
    selector.hasTouchableElements = true;
    this.add('_selector', selector);
  }

  constructor(diagram: Diagram, transform: Transform = new Transform()) {
    super(transform, diagram.limits);
    this.diagram = diagram;
    this.layout = lessonLayout();

    this.makeSelector({
      parallel: 'Parallel',
      opposite: 'Vertically Opposite',
      corresponding: 'Corresponding',
      alternate: 'Alternate',
      interior: 'Interior',
    });
  }

  selectorClicked(title: string) {
    console.log(title);
  }
  goToParallel() {
  }
  goToOpposite() {
  }
  goToCorresponding() {
  }
  goToAlternate() {
  }

  goToInterior() {
  }

}

export default RelatedAnglesCollection;
