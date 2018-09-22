// @flow
import LessonDiagram from './diagram';
import {
  Transform, polarToRect, getDeltaAngle,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementPrimative, DiagramElementCollection,
} from '../../../../js/diagram/Element';
import {
  rand,
} from '../../../../js/diagram/tools/mathtools';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';

import { makeAngle } from '../../../../LessonsCommon/tools/angle';
import type { TypeAngle } from '../../../../LessonsCommon/tools/angle';

type TypeCorner = {
  _angle: TypeAngle;
  _line: DiagramElementPrimative;
  side1: number;
  side2: number;
  // points: Array<Point>;
} & DiagramElementCollection;

export default class SASCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _corner1: TypeCorner;
  _corner2: TypeCorner;

  makeCorner() {
    const corner = this.diagram.shapes.collection(new Transform('Corner')
      .scale(1, 1)
      .rotate(0)
      .translate(0, 0));
    const line = this.diagram.shapes.polyLine(
      this.layout.corner.points, false,
      this.layout.corner.width, this.layout.colors.line,
      'onSharpAnglesOnly',
    );
    const angle = makeAngle(
      this.diagram, this.layout.corner.angleRadius,
      this.layout.corner.angleWidth, this.layout.triangle.angle.sides,
      this.layout.colors.angleA,
    );
    corner.side1 = 1;
    corner.side2 = 1;
    // corner.points = this.layout.corner.points.slice();
    corner.hasTouchableElements = true;
    angle.updateAngle(0, Math.PI / 2);
    angle.setPosition(this.layout.corner.points[1]);
    angle.showRealAngle = true;
    angle.addLabel('', this.layout.corner.angleLabelRadius);
    corner.add('angle', angle);
    corner.add('line', line);
    return corner;
  }

  updateCorner(corner: TypeCorner, angle: number, side1: number, side2: number) {
    const newP1 = polarToRect(side1, 0);
    const newP3 = polarToRect(side2, angle);
    const p2 = this.layout.corner.points[1];
    // eslint-disable-next-line no-param-reassign
    corner.side1 = newP1.sub(p2).distance();
    // eslint-disable-next-line no-param-reassign
    corner.side2 = newP3.sub(p2).distance();
    corner._line.vertices.change([newP1, p2, newP3]);
    // corner.points = [newP1, p2, newP3];
    const rotation = corner.transform.r();
    if (rotation != null) {
      corner._angle.updateAngle(0, angle, rotation);
    }
  }

  setCornerScenarios(scenarioName: string) {
    const points = [];
    [this._corner1, this._corner2].forEach((c, index) => {
      const {
        angle, scenario, side1, side2,
      } = this.layout.corner[scenarioName][`c${index + 1}`];
      this.setScenario(c, scenario);
      this.updateCorner(c, angle, side1, side2);
      points.push(scenario.position);
    });
  }

  growCorner2(
    fromLength: number | null,
    toLength: number | null,
    time: number = 1.5,
    finishOnCancel: boolean = true,
    callback: ?() => void = null,
  ) {
    let fromLengthToUse;
    if (fromLength != null) {
      fromLengthToUse = fromLength;
    } else {
      fromLengthToUse = this._corner2.side1;
    }
    let toLengthToUse;
    if (toLength == null) {
      if (this._corner2.side1 < 1.5) {
        toLengthToUse = rand(1.7, 2);
      } else {
        toLengthToUse = rand(0.5, 1.2);
      }
    } else {
      toLengthToUse = toLength;
    }
    const { currentAngle } = this._corner2._angle;
    const func = (percent) => {
      const side1 = percent * (toLengthToUse - fromLengthToUse) + fromLengthToUse;
      this.updateCorner(
        this._corner2, currentAngle,
        side1,
        this.layout.corner.SAS.c2.side2,
      );
      this._corner2.side1 = side1;
      if (side1 < this.layout.corner.angleRadius) {
        this._corner2._angle.hideAll();
      } else {
        this._corner2._angle.showAll();
      }
    };
    const done = () => {
      if (finishOnCancel) {
        func(1);
      }
      if (typeof callback === 'function' && callback) {
        callback();
      }
    };
    this._corner2.animateCustomTo(func, time, 0, done);
    this.diagram.animateNextFrame();
  }

  rotateCorner2(
    toAngle: number | null,
    time: number,
    finishOnCancel: boolean = true,
    callback: ?() => void = null,
  ) {
    const { currentAngle } = this._corner2._angle;
    let currentR = this._corner2.transform.r();
    if (currentR == null) {
      currentR = 0;
    }
    let toAngleToUse;
    if (toAngle == null) {
      if (currentAngle < Math.PI / 3) {
        toAngleToUse = rand(Math.PI / 3 * 1.2, Math.PI / 3 * 2.2);
      } else {
        toAngleToUse = rand(Math.PI / 3 * 0.4, Math.PI / 3 * 0.8);
      }
    } else {
      toAngleToUse = toAngle;
    }
    const delta = getDeltaAngle(toAngleToUse, currentAngle, 0);
    const func = (percent) => {
      const angle = percent * delta;

      this.updateCorner(
        this._corner2, currentAngle - angle,
        this._corner2.side1,
        this._corner2.side2,
      );
      this._corner2.transform.updateRotation(currentR + angle);
    };
    const done = () => {
      if (finishOnCancel) {
        func(1);
      }
      if (typeof callback === 'function' && callback) {
        callback();
      }
    };
    this._corner2._angle.showAll();
    this._corner2._angle.animateCustomTo(func, time, 0, done);
    this.diagram.animateNextFrame();
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.add('corner2', this.makeCorner());
    this.add('corner1', this.makeCorner());
    this.hasTouchableElements = true;
  }
}
