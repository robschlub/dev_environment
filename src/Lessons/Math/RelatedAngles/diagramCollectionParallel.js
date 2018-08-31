// @flow
import Diagram from '../../../js/diagram/Diagram';
import {
  Transform, minAngleDiff, Line, normAngleTo90, normAngle,
} from '../../../js/diagram/tools/g2';
import {
  DiagramElementCollection,
} from '../../../js/diagram/Element';

// eslint-disable-next-line import/no-cycle
import { makeMoveableLine } from './diagramCollectionCommon';
import type { MoveableLineType } from './diagramCollectionCommon';

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
    const angleSameThreshold = Math.PI / 300;
    const distanceThreshold = this.layout.parallelLine.width * 1.1;
    const r1 = this._line1.transform.r();
    const r2 = this._line2.transform.r();
    const t1 = this._line1.transform.t();
    const t2 = this._line2.transform.t();
    if (r1 != null && r2 != null && t1 != null && t2 != null) {
      let isParallel = true;
      const lineRotationDifference = Math.abs(minAngleDiff(r1, r2));
      if (lineRotationDifference > angleSameThreshold) {
        isParallel = false;
      }

      if (isParallel && makeRotationEqual) {
        if (!this._line2.state.isBeingMoved) {
          this._line1.transform.updateRotation(r2);
        } else if (!this._line1.state.isBeingMoved) {
          this._line2.transform.updateRotation(r1);
        }
      }

      if (isParallel) {
        const line2 = new Line(t2, t2.add(Math.cos(r2), Math.sin(r2)));
        const line2DistanceToLineCenter1 = line2.distanceToPoint(t1);
        if (line2DistanceToLineCenter1 < distanceThreshold) {
          isParallel = false;
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
    line._end1.movementAllowed = 'rotation';
    line._end2.movementAllowed = 'rotation';
    line._mid.movementAllowed = 'translation';
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

  // eslint-disable-next-line class-methods-use-this
  makeAnglesClose(
    element1: DiagramElementCollection,
    element2: DiagramElementCollection,
  ) {
    const r1 = element1.transform.r();
    const r2 = element2.transform.r();
    if (r1 != null && r2 != null) {
      if (Math.abs(minAngleDiff(r2, r1)) > Math.PI / 2) {
        element2.transform.updateRotation(normAngle(r2 + Math.PI));
      }
    }
  }

  rotateLine1ToParallel() {
    this._line1.stop();
    this._line2.stop();
    this.makeAnglesClose(this._line1, this._line2);
    // this.normalizeAngleTo90(this._line1);
    // this.normalizeAngleTo90(this._line2);
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
