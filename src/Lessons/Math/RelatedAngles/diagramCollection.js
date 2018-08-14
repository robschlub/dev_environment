// @flow

import Diagram from '../../../js/diagram/Diagram';
import {
  Transform, Point, minAngleDiff, polarToRect,
} from '../../../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../../js/diagram/Element';
import lessonLayout from './layout';

import {
  makeSelectorText, addSelectorHTML, SelectorList,
} from '../../../LessonsCommon/tools/selector';

class RelatedAnglesCollection extends DiagramElementCollection {
  layout: Object;
  colors: Object;
  shapes: Object;
  diagram: Diagram;
  _selector: DiagramElementPrimative;
  _line1: DiagramElementPrimative;
  _line2: DiagramElementPrimative;
  _line3: DiagramElementPrimative;

  makeMoveableLine() {
    const { length, width } = this.layout.moveableLine;
    const line = this.diagram.shapes.horizontalLine(
      new Point(-length / 2, 0),
      length, width,
      0, this.layout.colors.line, new Transform().rotate(0).translate(0, 0),
    );
    line.pulse.transformMethod = s => new Transform().scale(1, s);
    line.isTouchable = true;
    line.isMovable = true;
    const bounds = this.layout.moveableLine.boundary;
    line.move.maxTransform = new Transform().rotate(Math.PI * 2)
      .translate(bounds.right, bounds.top);
    line.move.minTransform = new Transform().rotate(0)
      .translate(bounds.left, bounds.bottom);

    for (let i = 0; i < line.vertices.border[0].length; i += 1) {
      line.vertices.border[0][i].y *= 10;
    }
    return line;
  }
  // varState: TypeVarStateExtended;
  // anglePairNames: Array<string>;
  // eqn: TypeMainTextEquation;

  // makeSelector() {
  //   const list = new SelectorList();
  //   list.add('parallel', 'Parallel');
  //   list.add('opposite', 'Vertically Opposite');
  //   list.add('corresponding', 'Corresponding');
  //   list.add('alternate', 'Alternate');
  //   list.add('interior', 'Interior');
  //   return makeSelectorHTML(
  //     list,
  //     'opposite',
  //     'id_lesson__selector',
  //     this.diagram,
  //     this.selectorClicked.bind(this),
  //     1,
  //     '/',
  //   );
  // }

  // makeVerticalSelector() {
  //   const list = new SelectorList();
  //   list.add('parallel', 'Parallel');
  //   list.add('opposite', 'Vertically Opposite');
  //   list.add('corresponding', 'Corresponding');
  //   list.add('alternate', 'Alternate');
  //   list.add('interior', 'Interior');
  //   return makeVerticalSelectorHTML(
  //     list,
  //     'opposite',
  //     'id_lesson__vselector',
  //     this.diagram,
  //     this.selectorClicked.bind(this),
  //   );
  // }

  // makeVerticalSelectorText() {
  //   const font = this.layout.defaultFont._dup();
  //   font.alignH = 'left';
  //   font.size = 0.1;
  //   font.setColor(this.layout.colors.diagram.disabled);
  //   const list = new SelectorList();
  //   list.add('parallel', 'Parallel');
  //   list.add('opposite', 'Vertically Opposite');
  //   list.add('corresponding', 'Corresponding');
  //   list.add('alternate', 'Alternate');
  //   list.add('interior', 'Interior');
  //   const selector = makeVerticalSelectorText(
  //     list,
  //     'opposite',
  //     this.diagram,
  //     this.selectorClicked.bind(this),
  //     font,
  //     this.layout.colors.diagram.text.base,
  //     0.05,
  //   );
  //   selector.setPosition(-2, 0);
  //   return selector;
  // }

  addSelector() {
    addSelectorHTML(
      this.diagram,
      this,
      'selector',
      'lesson__related_angles_selector',
      this.selectorClicked.bind(this),
      'horizontal',
    );
    this._selector.setPosition(this.layout.selector.position);
  }

  // makeExpandingVerticalSelectorText() {
  //   const list = new SelectorList();
  //   list.add('parallel', 'Parallel', 'asdf');
  //   list.add('opposite', 'Vertically Opposite', 'qwer');
  //   list.add('corresponding', 'Corresponding', 'xcvb');
  //   list.add('alternate', 'Alternate', 'tyuity');
  //   list.add('interior', 'Interior', '23t4');
  //   const selector = makeExpandingVerticalSelectorHTML(
  //     list,
  //     'opposite',
  //     'id_expanding_v_selector',
  //     this.diagram,
  //     this.selectorClicked.bind(this),
  //   );
  //   selector.setPosition(this.layout.selector.position);
  //   return selector;
  // }

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
      0.2,
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

    // this.add('selector', this.makeSelector());
    this.add('unitsSelector', this.makeUnitsSelector());
    // this.add('vselector', this.makeVerticalSelector());
    // this.add('vselectorText', this.makeVerticalSelectorText());
    // this.add('veselectorText', this.makeExpandingVerticalSelectorText());
    // this.add('temp', this.makeTemp());
    this.addSelector();
    this.add('line1', this.makeMoveableLine());
    this.add('line2', this.makeMoveableLine());
    this.add('line3', this.makeMoveableLine());
  }

  selectorClicked(title: string) {
    console.log(title);
  }
}

export default RelatedAnglesCollection;
