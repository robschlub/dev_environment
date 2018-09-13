// @flow
import Diagram from '../../js/diagram/Diagram';

import {
  Point, Transform, polarToRect,
} from '../../js/diagram/tools/g2';
import { Equation } from '../../js/diagram/DiagramElements/Equation/GLEquation';

export type TypeEquationLabel = {
  eqn: Equation;
  updateRotation: (number, Point, number, number) => void;
};

export default function makeEquationLabel(
  diagram: Diagram,
  labelText: string = '',
  color: Array<number>,
) {
  const eqn = diagram.equation.makeEqn();
  eqn.createElements({ base: labelText }, color);
  eqn.collection.transform = new Transform().scale(1, 1).rotate(0).translate(0, 0);
  eqn.formAlignment.fixTo = new Point(0, 0);
  eqn.formAlignment.hAlign = 'center';
  eqn.formAlignment.vAlign = 'middle';
  eqn.formAlignment.scale = 0.7;
  eqn.addForm('base', ['base']);
  eqn.setCurrentForm('base');

  function updateRotation(
    labelAngle: number,
    position: Point,
    offsetMag: number = 0,
    offsetAngle: number = 0,
  ) {
    if (offsetMag !== 0) {
      let labelWidth = 0;
      let labelHeight = 0;
      if (eqn.currentForm != null) {
        labelWidth = eqn.currentForm.width / 2 + 0.04;
        labelHeight = eqn.currentForm.height / 2 + 0.04;
      }
      const a = labelWidth + offsetMag;
      const b = labelHeight + offsetMag;
      const r = a * b / Math.sqrt((b * Math.cos(labelAngle - offsetAngle)) ** 2
        + (a * Math.sin(labelAngle - offsetAngle)) ** 2);
      eqn.collection.setPosition(position.add(polarToRect(r, offsetAngle)));
    } else {
      eqn.collection.setPosition(position);
    }
    eqn.collection.transform.updateRotation(labelAngle);
  }

  const label = {
    eqn,
    updateRotation,
  };

  return label;
}
