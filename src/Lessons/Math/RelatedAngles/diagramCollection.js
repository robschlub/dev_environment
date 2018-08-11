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
import { makeSelectorHTML, makeSelectorText, makeVerticalSelectorHTML } from '../../../LessonsCommon/tools/selector';

class RelatedAnglesCollection extends DiagramElementCollection {
  layout: Object;
  colors: Object;
  shapes: Object;
  diagram: Diagram;
  // varState: TypeVarStateExtended;
  // anglePairNames: Array<string>;
  // eqn: TypeMainTextEquation;

  makeSelector() {
    return makeSelectorHTML(
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
    );
  }

  // makeVerticalSelector() {
  //   return makeVerticalSelectorHTML(
  //     {
  //       parallel: 'Parallel',
  //       opposite: 'Vertically Opposite',
  //       corresponding: 'Corresponding',
  //       alternate: 'Alternate',
  //       interior: 'Interior',
  //     },
  //     'opposite',
  //     'id_lesson__vselector',
  //     this.diagram,
  //     this.selectorClicked.bind(this),
  //   );
  // }

  makeUnitsSelector() {
    const font = this.layout.defaultFont._dup();
    font.size = 0.1;
    font.setColor(this.layout.colors.diagram.disabled);
    const selector = makeSelectorText(
      {
        deg: 'degrees',
        rad: 'radians',
      },
      'deg',
      this.diagram,
      this.selectorClicked.bind(this),
      0,
      font,
      this.layout.colors.diagram.text.base,
      '/',
      0.1,
    );
    selector.setPosition(this.layout.units.position);
    return selector;
  }

  constructor(diagram: Diagram, transform: Transform = new Transform()) {
    super(transform, diagram.limits);
    this.diagram = diagram;
    this.layout = lessonLayout();

    this.add('selector', this.makeSelector());
    this.add('unitsSelector', this.makeUnitsSelector());
    // this.add('vselector', this.makeVerticalSelector());
  }

  selectorClicked(title: string) {
    console.log(title);
  }
}

export default RelatedAnglesCollection;
