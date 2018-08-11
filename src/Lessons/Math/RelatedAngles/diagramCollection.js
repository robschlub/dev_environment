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
import { makeSelectorHTML } from '../../../LessonsCommon/tools/selector';

class RelatedAnglesCollection extends DiagramElementCollection {
  layout: Object;
  colors: Object;
  shapes: Object;
  diagram: Diagram;
  // varState: TypeVarStateExtended;
  // anglePairNames: Array<string>;
  // eqn: TypeMainTextEquation;

  constructor(diagram: Diagram, transform: Transform = new Transform()) {
    super(transform, diagram.limits);
    this.diagram = diagram;
    this.layout = lessonLayout();

    this.add('selector', makeSelectorHTML(
      {
        parallel: 'Parallel',
        opposite: 'Vertically Opposite',
        corresponding: 'Corresponding',
        alternate: 'Alternate',
        interior: 'Interior',
      },
      'opposite',
      'id_lesson__selector',
      this.diagram,
      this.selectorClicked.bind(this),
      1,
      '/',
    ));
  }

  selectorClicked(title: string) {
    console.log(title);
  }
}

export default RelatedAnglesCollection;
