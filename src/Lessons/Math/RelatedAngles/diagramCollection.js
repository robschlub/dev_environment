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
import {
  makeSelectorHTML, makeSelectorText, makeVerticalSelectorHTML,
  SelectorList, makeVerticalSelectorText,
} from '../../../LessonsCommon/tools/selector';

class RelatedAnglesCollection extends DiagramElementCollection {
  layout: Object;
  colors: Object;
  shapes: Object;
  diagram: Diagram;
  // varState: TypeVarStateExtended;
  // anglePairNames: Array<string>;
  // eqn: TypeMainTextEquation;

  makeSelector() {
    const list = new SelectorList();
    list.add('parallel', 'Parallel');
    list.add('opposite', 'Vertically Opposite');
    list.add('corresponding', 'Corresponding');
    list.add('alternate', 'Alternate');
    list.add('interior', 'Interior');
    return makeSelectorHTML(
      list,
      'opposite',
      'id_lesson__selector',
      this.diagram,
      this.selectorClicked.bind(this),
      1,
      '/',
    );
  }

  makeVerticalSelector() {
    const list = new SelectorList();
    list.add('parallel', 'Parallel');
    list.add('opposite', 'Vertically Opposite');
    list.add('corresponding', 'Corresponding');
    list.add('alternate', 'Alternate');
    list.add('interior', 'Interior');
    return makeVerticalSelectorHTML(
      list,
      'opposite',
      'id_lesson__vselector',
      this.diagram,
      this.selectorClicked.bind(this),
    );
  }

  makeVerticalSelectorText() {
    const font = this.layout.defaultFont._dup();
    font.size = 0.1;
    font.setColor(this.layout.colors.diagram.disabled);
    const list = new SelectorList();
    list.add('parallel', 'Parallel');
    list.add('opposite', 'Vertically Opposite');
    list.add('corresponding', 'Corresponding');
    list.add('alternate', 'Alternate');
    list.add('interior', 'Interior');
    const selector = makeVerticalSelectorText(
      list,
      'opposite',
      this.diagram,
      this.selectorClicked.bind(this),
      font,
      this.layout.colors.diagram.text.base,
      0.1,
    );
    selector.setPosition(-2, 0);
    return selector;
  }

  makeUnitsSelector() {
    const font = this.layout.defaultFont._dup();
    font.size = 0.1;
    font.setColor(this.layout.colors.diagram.disabled);
    const list = new SelectorList();
    list.add('deg', 'degrees');
    list.add('rad', 'radians');
    const selector = makeSelectorText(
      list,
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

  makeVerticalExandingSelector() {
    const all_content = [
      {
        title: 'Option 1',
        content: '<p>test content</p>',
      },
      {
        title: 'Option 2',
        content: '<p>test 2 content</p>',
      },
      {
        title: 'Option 2',
        content: '<p>test 3 content</p>',
      },
    ]
  }

  constructor(diagram: Diagram, transform: Transform = new Transform()) {
    super(transform, diagram.limits);
    this.diagram = diagram;
    this.layout = lessonLayout();

    this.add('selector', this.makeSelector());
    this.add('unitsSelector', this.makeUnitsSelector());
    this.add('vselector', this.makeVerticalSelector());
    this.add('vselectorText', this.makeVerticalSelectorText());
  }

  selectorClicked(title: string) {
    console.log(title);
  }
}

export default RelatedAnglesCollection;
