// @flow

import Diagram from '../../js/diagram/Diagram';
import {
  Transform, Point, polarToRect,
} from '../../js/diagram/tools/g2';
import { Equation } from '../../js/diagram/DiagramElements/Equation/GLEquation';

export type TypeAngleAnnotationLayout = {
  arc: {
    radius: number;
    width: number;
    sides: number;
  };
  label: {
    radius: number;
  };
};

export default function makeAnnotatedAngle(
  diagram: Diagram,
  layout: TypeAngleAnnotationLayout,
  color: Array<number>,
  labelTextOrEquation: string | Equation = '',
) {
  let eqn: Equation;
  if (typeof labelTextOrEquation === 'string') {
    eqn = diagram.equation.makeEqn();
    eqn.createElements({ base: labelTextOrEquation }, color);
    eqn.formAlignment.fixTo = new Point(0, 0);
    eqn.formAlignment.hAlign = 'center';
    eqn.formAlignment.vAlign = 'middle';
    eqn.formAlignment.scale = 0.7;

    eqn.addForm('base', ['base']);
  } else {
    eqn = labelTextOrEquation;
  }

  const label = eqn.collection;
  const arc = diagram.shapes.polygon(
    layout.arc.sides, layout.arc.radius, layout.arc.width,
    0, 1, layout.arc.sides, color,
    new Transform(),
  );
  const angle = diagram.shapes.collection(new Transform()
    .scale(1, 1).rotate(0).translate(0, 0));
  angle.add('arc', arc);
  angle.add('label', label);
  angle.eqn = eqn;

  angle.updateAngle = (start: number, size: number, labelRotationOffset: number = 0) => {
    angle._arc.angleToDraw = size;
    angle.transform.updateRotation(start);
    angle._label.transform.updateRotation(-start - labelRotationOffset);
    let labelWidth = 0;
    let labelHeight = 0;
    if (eqn.currentForm != null) {
      labelWidth = eqn.currentForm.width / 2 + 0.04;
      labelHeight = eqn.currentForm.height / 2 + 0.04;
    }
    const a = labelWidth + layout.label.radius;
    const b = labelHeight + layout.label.radius;
    const r = a * b / Math.sqrt((b * Math.cos(start + size / 2 + labelRotationOffset)) ** 2
      + (a * Math.sin(start + size / 2 + labelRotationOffset)) ** 2);
    const labelPosition = polarToRect(r, size / 2);
    angle._label.setPosition(labelPosition);
  };

  angle.setLabel = (newLabel: string) => {
    angle._label._vertices.setText(newLabel);
  };

  angle.showForm = (form: string = 'base') => {
    eqn.showForm(form);
    const start = angle.transform.r();
    const size = angle._arc.angleToDraw;
    if (start != null) {
      angle.updateAngle(start, size);
    }
  };

  angle.showForm();
  return angle;
}
