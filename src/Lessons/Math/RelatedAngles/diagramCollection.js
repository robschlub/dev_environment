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

export type MoveableLineType = {
  _end1: DiagramElementPrimative;
  _end2: DiagramElementPrimative;
  _mid: DiagramElementPrimative
} & DiagramElementCollection;

class RelatedAnglesCollection extends DiagramElementCollection {
  layout: Object;
  colors: Object;
  shapes: Object;
  diagram: Diagram;
  _selector: DiagramElementPrimative;
  _line1: MoveableLineType;
  _line2: MoveableLineType;
  _line3: MoveableLineType;

  makeMoveableLine() {
    const { width } = this.layout.moveableLine;
    const { end, middle, full } = this.layout.moveableLine.length;

    const line = this.diagram.shapes.collection(new Transform()
      .rotate(0)
      .translate(0, 0));
    line.pulse.transformMethod = s => new Transform().scale(1, s);
    line.hasTouchableElements = true;
    line.isMovable = true;
    line.touchInBoundingRect = true;
    line.isTouchable = true;
    const bounds = this.layout.moveableLine.boundary;
    line.setTransformCallback = (t) => {
      const r = t.r();
      if (r != null) {
        const w = Math.abs(this.layout.moveableLine.length.full / 2 * Math.cos(r));
        const h = Math.abs(this.layout.moveableLine.length.full / 2 * Math.sin(r));
        line.move.maxTransform.updateTranslation(
          bounds.right - w,
          bounds.top - h,
        );
        line.move.minTransform.updateTranslation(
          bounds.left + w,
          bounds.bottom + h,
        );
      }
    };
    line.setTransform(new Transform().rotate(0).translate(0, 0));

    const end1 = this.diagram.shapes.horizontalLine(
      new Point(-full / 2, 0),
      end, width,
      0, this.layout.colors.line, new Transform(),
    );
    end1.isTouchable = true;
    // end1.isMovable = true;

    const end2 = this.diagram.shapes.horizontalLine(
      new Point(middle / 2, 0),
      end, width,
      0, this.layout.colors.line, new Transform(),
    );
    end2.isTouchable = true;
    // end2.isMovable = true;

    const mid = this.diagram.shapes.horizontalLine(
      new Point(-middle / 2, 0),
      middle, width,
      0, this.layout.colors.line, new Transform(),
    );
    mid.isTouchable = true;
    // mid.isMovable = true;

    const increaseBorderSize = (element: DiagramElementPrimative) => {
      for (let i = 0; i < element.vertices.border[0].length; i += 1) {
        // eslint-disable-next-line no-param-reassign
        element.vertices.border[0][i].y *= 5;
      }
    };

    increaseBorderSize(end1);
    increaseBorderSize(end2);
    increaseBorderSize(mid);

    line.add('end1', end1);
    line.add('mid', mid);
    line.add('end2', end2);
    return line;
  }

  // makeMoveableLine() {
  //   const { length, width } = this.layout.moveableLine;
  //   const line = this.diagram.shapes.horizontalLine(
  //     new Point(-length / 2, 0),
  //     length, width,
  //     0, this.layout.colors.line, new Transform().rotate(0).translate(0, 0),
  //   );
  //   line.pulse.transformMethod = s => new Transform().scale(1, s);
  //   line.isTouchable = true;
  //   line.isMovable = true;
  //   const bounds = this.layout.moveableLine.boundary;
  //   line.move.maxTransform = new Transform().rotate(Math.PI * 2)
  //     .translate(bounds.right, bounds.top);
  //   line.move.minTransform = new Transform().rotate(0)
  //     .translate(bounds.left, bounds.bottom);

  //   for (let i = 0; i < line.vertices.border[0].length; i += 1) {
  //     line.vertices.border[0][i].y *= 10;
  //   }
  //   return line;
  // }
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
    console.log(this._line2);
  }

  selectorClicked(title: string) {
    console.log(title);
  }
}

export default RelatedAnglesCollection;
