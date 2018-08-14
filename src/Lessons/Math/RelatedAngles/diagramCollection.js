// @flow

import Diagram from '../../../js/diagram/Diagram';
import {
  Transform, Point, minAngleDiff, rectToPolar,
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

  checkForParallel() {
    if (!this._line1 || !this._line2) {
      return;
    }
    const angleSameThreshold = Math.PI / 100;
    const r1 = this._line1.transform.r();
    const r2 = this._line2.transform.r();
    const t1 = this._line1.transform.t();
    const t2 = this._line2.transform.t();
    if (r1 != null && r2 != null && t1 != null && t2 != null) {
      let isParallel = false;
      if (Math.abs(minAngleDiff(r1, r2)) < angleSameThreshold) {
        // isParallel = true;
        // Check if r1 center is on r2 by looking at angle between line1 and
        // line2 centers. If angle is similar to r2, then it is on the line.
        const polar = rectToPolar(t2.sub(t1));
        if (Math.abs(minAngleDiff(polar.angle, r2)) > angleSameThreshold
          && Math.abs(minAngleDiff(polar.angle + Math.PI, r2)) > angleSameThreshold
        ) {
          isParallel = true;
        }
      }
      if (isParallel) {
        this._line1.setColor(this.layout.colors.line);
        this._line2.setColor(this.layout.colors.line);
      } else {
        this._line1.setColor(this.layout.colors.disabled);
        this._line2.setColor(this.layout.colors.disabled);
      }
    }
  }

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
      this.checkForParallel();
    };
    line.setTransform(new Transform().rotate(0).translate(0, 0));

    const end1 = this.diagram.shapes.horizontalLine(
      new Point(-full / 2, 0),
      end, width,
      0, this.layout.colors.line, new Transform(),
    );
    end1.isTouchable = true;

    const end2 = this.diagram.shapes.horizontalLine(
      new Point(middle / 2, 0),
      end, width,
      0, this.layout.colors.line, new Transform(),
    );
    end2.isTouchable = true;

    const mid = this.diagram.shapes.horizontalLine(
      new Point(-middle / 2, 0),
      middle, width,
      0, this.layout.colors.line, new Transform(),
    );
    mid.isTouchable = true;

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

  constructor(diagram: Diagram, transform: Transform = new Transform()) {
    super(transform, diagram.limits);
    this.diagram = diagram;
    this.layout = lessonLayout();

    this.add('unitsSelector', this.makeUnitsSelector());
    this.addSelector();
    this.add('line1', this.makeMoveableLine());
    this.add('line2', this.makeMoveableLine());
    this.add('line3', this.makeMoveableLine());
  }

  selectorClicked(title: string) {
    console.log(title);
  }

  rotateLine1ToParallel() {
    this._line1.stop();
    this._line2.stop();
    const r1 = this._line1.transform.r();
    const r2 = this._line2.transform.r();
    if (r1 != null && r2 != null) {
      this._line1.animateRotationTo(r2, 0, 1);
    }
    this.diagram.animateNextFrame();
  }
}

export default RelatedAnglesCollection;
