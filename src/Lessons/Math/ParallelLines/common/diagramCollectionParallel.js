// @flow
import Diagram from '../../../../js/diagram/Diagram';
import {
  Transform, normAngleTo90,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementCollection,
} from '../../../../js/diagram/Element';

// eslint-disable-next-line import/no-cycle
import {
  makeAnglesClose, checkElementsForParallel,
} from './diagramCollectionCommon';

import { makeMoveableLine } from '../../../../LessonsCommon/tools/line';
import type { MoveableLineType } from '../../../../LessonsCommon/tools/line';

export default class ParallelCollection extends DiagramElementCollection {
  layout: Object;
  colors: Object;
  diagram: Diagram;
  _line1: MoveableLineType;
  _line2: MoveableLineType;
  _line3: MoveableLineType;

  checkForParallel(makeRotationEqual: boolean = false) {
    if (!this._line1 || !this._line2) {
      return;
    }
    const isParallel = checkElementsForParallel(
      this._line1, this._line2,
      makeRotationEqual, this.layout.parallelLine.width * 1.1,
    );
    if (isParallel) {
      this._line1.setColor(this.layout.colors.line);
      this._line2.setColor(this.layout.colors.line);
    } else {
      this._line1.setColor(this.layout.colors.disabled);
      this._line2.setColor(this.layout.colors.disabled);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  normalizeAngle(element: DiagramElementCollection, wrap: number = 2 * Math.PI) {
    let angle = element.transform.r();
    if (angle != null) {
      if (angle > wrap) {
        angle -= wrap;
      }
      element.transform.updateRotation(angle);
    }
  }

  makeLine() {
    const line = makeMoveableLine(
      this.diagram, this.layout.parallelLine,
      this.layout.colors.line,
    );
    line.setTransformCallback = (t: Transform) => {
      line.updateTransform(t);
      this.normalizeAngle(line);
      this.checkForParallel();
    };
    return line;
  }

  constructor(
    diagram: Diagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(transform, diagram.limits);
    this.diagram = diagram;
    this.layout = layout;
    this.setPosition(this.layout.position);
    this.add('line1', this.makeLine());
    this._line1.setPosition(this.layout.line1.parallel.position.x, 0);
    this.add('line2', this.makeLine());
    this._line2.setPosition(this.layout.line2.parallel.position.x, 0);

    this.hasTouchableElements = true;
  }

  pulseParallel() {
    this._line1.pulseWidth();
    this._line2.pulseWidth();
    this.diagram.animateNextFrame();
  }

  // eslint-disable-next-line class-methods-use-this
  normalizeAngleTo90(element: DiagramElementCollection) {
    let angle = element.transform.r();
    if (angle != null) {
      angle = normAngleTo90(angle);
      element.transform.updateRotation(angle);
    }
  }

  rotateLine1ToParallel() {
    this._line1.stop();
    this._line2.stop();
    makeAnglesClose(this._line1, this._line2);

    const r1 = this._line1.transform.r();
    const r2 = this._line2.transform.r();
    const velocity = this._line1.transform.constant(0);
    velocity.updateRotation(2 * Math.PI / 6);
    if (r1 != null && r2 != null) {
      this._line1.animateRotationTo(r2, 0, velocity, this.pulseParallel.bind(this));
    }
    this.diagram.animateNextFrame();
  }
}
