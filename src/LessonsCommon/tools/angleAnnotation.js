// @flow

import Diagram from '../../js/diagram/Diagram';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../js/diagram/Element';
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
  // color: Array<number>;
  label: {
    radius: number;
    //text: string | Equation;
  };
};

export type TypeAngleAnnotation = {
  eqn: Equation;
  _arc: DiagramElementPrimative;
  _label: {
    _base: DiagramElementPrimative
  } & DiagramElementCollection;
  updateAngle: (number, number, number) => void;
  setLabel: (string) => void;
  showForm: (string) => void;
  setToCorner: (Point, Point, Point) => void;
  autoRightAngle: boolean;
  radius: number;
} & DiagramElementCollection;

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
  const curve = diagram.shapes.polygon(
    layout.arc.sides, layout.arc.radius, layout.arc.width,
    0, 1, layout.arc.sides, color,
    new Transform(),
  );
  const right = diagram.shapes.collection();
  const rightLength = layout.arc.radius / Math.sqrt(2);
  right.add('line1', diagram.shapes.horizontalLine(
    new Point(rightLength, 0),
    rightLength + layout.arc.width / 2, layout.arc.width,
    Math.PI / 2, color,
  ));
  right.add('line2', diagram.shapes.horizontalLine(
    new Point(0, rightLength),
    rightLength + layout.arc.width / 2, layout.arc.width,
    0, color,
  ));

  const arc = curve;
  const angle = diagram.shapes.collection(new Transform()
    .scale(1, 1).rotate(0).translate(0, 0));
  angle.add('arc', arc);
  angle.add('label', label);
  angle.eqn = eqn;

  angle.curve = curve;
  angle.right = right;
  angle.autoRightAngle = false;
  angle.radius = layout.arc.radius + layout.arc.width / 2;

  angle.updateAngle = (start: number, size: number, labelRotationOffset: number = 0) => {
    if (angle.autoRightAngle
      && size >= Math.PI / 2 * 0.995
      && size <= Math.PI / 2 * 1.005
    ) {
      if (angle._arc.isShown && angle._arc === angle.curve) {
        angle._arc = angle.right;
        angle.elements['arc'] = angle.right;
        angle.right.show();
        angle.curve.hide();
        diagram.animateNextFrame();
      }
    } else if (angle._arc.isShown && angle._arc === angle.right) {
      angle._arc = angle.curve;
      angle.elements['arc'] = angle.curve;
      angle.curve.show();
      angle.right.hide();
      diagram.animateNextFrame();
    }
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
    if (angle._lable._base) {
      angle._label._base.vertices.setText(newLabel);
    }
  };

  angle.showForm = (form: string = 'base') => {
    eqn.showForm(form);
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

  angle.showForm();
  return angle;
}
