// @flow
import Diagram from '../../js/diagram/Diagram';

import {
  Point, Transform,
} from '../../js/diagram/tools/g2';
// import { Equation } from '../../js/diagram/DiagramElements/Equation/GLEquation';

export default function makeEquationLabel(
  diagram: Diagram,
  label: string = '',
  color: Array<number>,
) {
  const eqn = diagram.equation.makeEqn();
  eqn.createElements({ base: label }, color);
  eqn.collection.transform = new Transform().scale(1, 1).rotate(0).translate(0, 0);
  eqn.formAlignment.fixTo = new Point(0, 0);
  eqn.formAlignment.hAlign = 'center';
  eqn.formAlignment.vAlign = 'middle';
  eqn.formAlignment.scale = 0.7;
  eqn.addForm('base', ['base']);
  return eqn;
}
