// @flow

import Diagram from '../../js/diagram/Diagram';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../js/diagram/Element';
import {
  Transform, Point,
} from '../../js/diagram/tools/g2';
import { Equation } from '../../js/diagram/DiagramElements/Equation/GLEquation';
import makeEquationLabel from './equationLabel';
import type { TypeEquationLabel } from './equationLabel';

export type TypeAngle = {
  eqn: Equation;
  _arc: DiagramElementPrimative;
  _label: {
    _base: DiagramElementPrimative
  } & DiagramElementCollection;
  label: null | {
    radius: number;
  } & TypeEquationLabel;
  curve: DiagramElementPrimative;
  right: DiagramElementPrimative;
  autoRightAngle: boolean;
  radius: number;
  addLabel: (string | Equation, number) => void;
  updateAngle: (number, number, ?number) => void;
  setLabel: (string) => void;
  showForm: (string) => void;
  setToCorner: (Point, Point, Point) => void;
  autoRightAngle: boolean;
  radius: number;
} & DiagramElementCollection;

export default function makeAngle(
  diagram: Diagram,
  radius: number,
  lineWidth: number,
  sides: number,
  color: Array<number>,
) {
  const curve = diagram.shapes.polygon(
    sides, radius, lineWidth,
    0, 1, sides, color,
    new Transform(),
  );
  // curve.angleToDraw = 0;
  const right = diagram.shapes.collection();
  const rightLength = radius / Math.sqrt(2);
  right.add('line1', diagram.shapes.horizontalLine(
    new Point(rightLength, 0),
    rightLength + lineWidth / 2, lineWidth,
    Math.PI / 2, color,
  ));
  right.add('line2', diagram.shapes.horizontalLine(
    new Point(0, rightLength),
    rightLength + lineWidth / 2, lineWidth,
    0, color,
  ));

  const arc = curve;
  const angle = diagram.shapes.collection(new Transform()
    .scale(1, 1).rotate(0).translate(0, 0));
  angle.add('arc', arc);
  angle.curve = curve;
  angle.right = right;
  angle.autoRightAngle = false;
  angle.radius = radius + lineWidth / 2;
  angle.label = null;

  angle.addLabel = (labelTextOrEquation: string | Equation = '', labelRadius: number) => {
    const eqnLabel = makeEquationLabel(diagram, labelTextOrEquation, color);
    // console.log(eqnLabel.eqn.collection.transform.matrix())
    angle.label = Object.assign({}, eqnLabel, {
      radius: labelRadius,
    });
    angle.add('label', eqnLabel.eqn.collection);
    // console.log(angle._label.transform.matrix())
    angle.showForm();
    // console.log(angle._label.transform.matrix())
    // angle.updateLabel();
  };

  angle.updateAngle = function updateAngle(
    start: number,
    size: number,
    labelRotationOffset: number = 0,
    angleToTestRightAngle: number = size,
  ) {
    if (angle.autoRightAngle
      && angleToTestRightAngle >= Math.PI / 2 * 0.995
      && angleToTestRightAngle <= Math.PI / 2 * 1.005
    ) {
      if (angle._arc.isShown && angle._arc === angle.curve) {
        angle._arc = angle.right;
        angle.elements.arc = angle.right;
        angle.right.show();
        angle.curve.hide();
        diagram.animateNextFrame();
      }
    } else if (angle._arc.isShown && angle._arc === angle.right) {
      angle._arc = angle.curve;
      angle.elements.arc = angle.curve;
      angle.curve.show();
      angle.right.hide();
      diagram.animateNextFrame();
    }
    angle._arc.angleToDraw = size;
    angle.transform.updateRotation(start);
    if (angle.label) {
      const labelPosition = new Point(0, 0);
      // angle._label.setPosition(labelPosition);
      angle.label.updateRotation(
        -start - labelRotationOffset,
        labelPosition,
        angle.label.radius,
        size / 2,
      );
    }
  };

  angle.setLabel = (newLabel: string) => {
    if (angle._lable._base) {
      angle._label._base.vertices.setText(newLabel);
    }
  };

  angle.showForm = (form: string = 'base') => {
    angle.label.eqn.showForm(form);
    const start = angle.transform.r();
    const size = angle._arc.angleToDraw;
    if (start != null) {
      angle.updateAngle(start, size);
    }
  };

  angle.setToCorner = (p: Point, q: Point, r: Point) => {
    angle.setPosition(q);
    const angleQP = p.sub(q).toPolar().angle;
    const angleQR = r.sub(q).toPolar().angle;
    let delta = angleQR - angleQP;
    if (delta < 0) {
      delta = Math.PI * 2 + delta;
    }
    angle.updateAngle(angleQP, delta);
  };
  return angle;
}
