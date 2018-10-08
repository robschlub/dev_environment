// @flow

import Diagram from '../../js/diagram/Diagram';
import {
  Transform, Point,
} from '../../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../js/diagram/Element';
import { Equation } from '../../js/diagram/DiagramElements/Equation/GLEquation';

export type TypeEquationNavigator = {
} & DiagramElementCollection;

export default function makeEquationNavigator(
  diagram: Diagram,
  equation: eqn,
  size: number,
  color: Array<number>,
) {
  const arrowWidth = size * 1.5;
  const arrowHeight = size * 1.5;
  const refreshRadius = size;
  const refreshAngle = Math.PI / 3 * 2;
  const refreshSides = 100;
  const refreshLineWidth = size / 5;
  const spacing = size * 3.5;

  const navigator = diagram.shapes.collection(new Transform('Triangle')
    .scale(1, 1)
    .translate(0, 0));

  const prev = diagram.shapes.arrow(
    arrowWidth, 0, arrowHeight, 0, color,
    new Transform().translate(0, spacing), new Point(0, 0), 0,
  );

  const next = diagram.shapes.arrow(
    arrowWidth, 0, arrowHeight, 0, color,
    new Transform().translate(0, -spacing), new Point(0, 0), Math.PI,
  );

  const refresh = diagram.shapes.collection(new Transform('Triangle')
    .translate(0, 0));
  const refreshTop = diagram.shapes.collection(new Transform('Triangle')
    .rotate(0).translate(0, 0));

  const refreshLine = diagram.shapes.polygon(
    refreshSides, refreshRadius,
    refreshLineWidth, (Math.PI - refreshAngle) / 2,
    1, Math.floor(refreshSides * refreshAngle / Math.PI / 2),
    color, new Transform().translate(0, 0),
  );
  refreshTop.add('line', refreshLine);

  const refreshArrow = diagram.shapes.arrow(
    refreshLineWidth * 3, 0, refreshLineWidth * 3, 0,
    color, new Transform().translate(
      (refreshRadius + refreshLineWidth) * Math.cos((Math.PI - refreshAngle) / 2),
      (refreshRadius + refreshLineWidth) * Math.sin((Math.PI - refreshAngle) / 2),
    ), new Point(0, -refreshLineWidth * 3), (Math.PI - refreshAngle) / 2 + Math.PI,
  );
  refreshTop.add('arrow', refreshArrow);

  const refreshBottom = refreshTop._dup();
  refreshBottom.transform.updateRotation(Math.PI);

  refresh.add('top', refreshTop);
  refresh.add('bottom', refreshBottom);

  navigator.add('prev', prev);
  navigator.add('next', next);
  navigator.add('refresh', refresh);
  return navigator;
}
