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
import { makeSelectorHTML, makeSelectorText } from '../../../LessonsCommon/tools/selector';

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

    const font = this.layout.defaultFont._dup();
    console.log(font)
    font.size = 0.1;
    font.setColor(this.layout.colors.diagram.disabled);
    this.add('_selector', makeSelectorText(
      {
        parallel: 'Parallel1',
        opposite: 'Vertically Opposite1',
        corresponding: 'Corresponding1',
        alternate: 'Alternate',
        interior: 'Interior',
      },
      'opposite',
      this.diagram,
      this.selectorClicked.bind(this),
      -1,
      font,
      this.layout.colors.diagram.text.base,
      '/',
    ));
  }

  selectorClicked(title: string) {
    console.log(title);
  }
}

export default RelatedAnglesCollection;
