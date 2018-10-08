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

function makeArrow(
  diagram: Diagram,
  width: number,
  height: number,
  spacing: number,
  color: Array<number>,
  rotation: number,
) {
  const arrow = diagram.shapes.arrow(
    width, 0, height, 0, color,
    new Transform().translate(0, spacing * Math.cos(rotation)), new Point(0, 0), rotation,
  );
  return arrow;
}

function makeRefresh(
  diagram: Diagram,
  sides: number,
  radius: number,
  lineWidth: number,
  angle: number,
  color: Array<number>,
) {
  const refresh = diagram.shapes.collection(new Transform('Triangle')
    .translate(0, 0));
  const refreshTop = diagram.shapes.collection(new Transform('Triangle')
    .rotate(0).translate(0, 0));

  const refreshLine = diagram.shapes.polygon(
    sides, radius,
    lineWidth, (Math.PI - angle) / 2,
    1, Math.floor(sides * angle / Math.PI / 2),
    color, new Transform().translate(0, 0),
  );
  refreshTop.add('line', refreshLine);

  const refreshArrow = diagram.shapes.arrow(
    lineWidth * 3, 0, lineWidth * 3, 0,
    color, new Transform().translate(
      (radius + lineWidth) * Math.cos((Math.PI - angle) / 2),
      (radius + lineWidth) * Math.sin((Math.PI - angle) / 2),
    ), new Point(0, -lineWidth * 3), (Math.PI - angle) / 2 + Math.PI,
  );
  refreshTop.add('arrow', refreshArrow);

  const refreshBottom = refreshTop._dup();
  refreshBottom.transform.updateRotation(Math.PI);

  refresh.add('top', refreshTop);
  refresh.add('bottom', refreshBottom);
  return refresh;
}

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

  const prev = makeArrow(diagram, arrowWidth, arrowHeight, spacing, color, 0);
  const next = makeArrow(diagram, arrowWidth, arrowHeight, spacing, color, Math.PI);

  const refresh = makeRefresh(
    diagram, refreshSides, refreshRadius, refreshLineWidth,
    refreshAngle, color,
  );
  navigator.add('prev', prev);
  navigator.add('next', next);
  navigator.add('refresh', refresh);
  return navigator;
}
