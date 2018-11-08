// @flow
// import Diagram from '../Diagram';

import {
  Point, Transform, polarToRect,
} from '../tools/g2';
import { Equation } from '../DiagramElements/Equation/GLEquation';

// export type TypeEquationLabel = {
//   eqn: Equation;
//   updateRotation: (number, Point, number, number) => void;
//   setText: (string) => {};
//   getText: void => string;
//   // updateScale: (Point) => void;
// };

export default class EquationLabel {
  eqn: Equation;
  updateRotation: (number, Point, number, number) => void;
  setText: (string) => {};
  getText: void => string;

  constructor(
    equations: Object,
    // diagram: Diagram,
    labelTextOrEquation: string | Equation | Array<string> = '',
    color: Array<number>,
  ) {
    let eqn;
    if (typeof labelTextOrEquation === 'string') {
      eqn = equations.makeEqn();
      eqn.createElements({ base: labelTextOrEquation }, color);
      eqn.collection.transform = new Transform().scale(1, 1).rotate(0).translate(0, 0);
      eqn.formAlignment.fixTo = new Point(0, 0);
      eqn.formAlignment.hAlign = 'center';
      eqn.formAlignment.vAlign = 'middle';
      eqn.formAlignment.scale = 0.7;
      eqn.addForm('base', ['base']);
      eqn.setCurrentForm('base');
    } else if (labelTextOrEquation instanceof Equation) {
      eqn = labelTextOrEquation;
    } else {
      eqn = equations.makeEqn();
      const elements = {};
      labelTextOrEquation.forEach((labelText, index) => {
        elements[`_${index}`] = labelText;
      });
      eqn.createElements(elements, color);
      eqn.collection.transform = new Transform().scale(1, 1).rotate(0).translate(0, 0);
      eqn.formAlignment.fixTo = new Point(0, 0);
      eqn.formAlignment.hAlign = 'center';
      eqn.formAlignment.vAlign = 'middle';
      eqn.formAlignment.scale = 0.7;
      labelTextOrEquation.forEach((labelText, index) => {
        eqn.addForm(`${index}`, [`_${index}`]);
      });
      eqn.setCurrentForm('0');
    }
    this.eqn = eqn;
  }


  setText(text: string) {
    const form = this.eqn.getCurrentForm();
    if (form != null) {
      const key = Object.keys(form.collection.elements)[0];
      const textObject = form.collection.elements[key].drawingObject;
      if (textObject != null) {
        textObject.setText(text);
      }
      form.arrange(
        this.eqn.formAlignment.scale,
        this.eqn.formAlignment.hAlign,
        this.eqn.formAlignment.vAlign,
        this.eqn.formAlignment.fixTo,
      );
    }
  }

  getText(): string {
    let textToReturn = '';
    const form = this.eqn.getCurrentForm();
    if (form != null) {
      const key = Object.keys(form.collection.elements)[0];
      const textObject = form.collection.elements[key].drawingObject;
      if (textObject != null) {
        textToReturn = textObject.text[0].text;
      }
    }
    return textToReturn;
  }

  updateRotation(
    labelAngle: number,
    position: Point,
    offsetMag: number = 0,
    offsetAngle: number = 0,
  ) {
    if (offsetMag !== 0) {
      let labelWidth = 0;
      let labelHeight = 0;
      const currentForm = this.eqn.getCurrentForm();
      if (currentForm != null) {
        labelWidth = currentForm.width / 2 + 0.04;
        labelHeight = currentForm.height / 2 + 0.04;
      }
      const a = labelWidth + offsetMag;
      const b = labelHeight + offsetMag;
      const r = a * b / Math.sqrt((b * Math.cos(labelAngle - offsetAngle)) ** 2
        + (a * Math.sin(labelAngle - offsetAngle)) ** 2);
      this.eqn.collection.setPosition(position.add(polarToRect(r, offsetAngle)));
    } else {
      this.eqn.collection.setPosition(position);
    }
    this.eqn.collection.transform.updateRotation(labelAngle);
  }

  // const label = {
  //   eqn,
  //   updateRotation,
  //   setText,
  //   getText,
  //   // updateScale,
  // };

  // return label;
}

export type TypeEquationLabel;
