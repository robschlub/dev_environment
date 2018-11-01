// @flow

import { Rect, Point } from '../../js/diagram/tools/g2';
import getCssColors from '../../js/tools/getCssColors';
// import angleCircleLayout from '../../../LessonsCommon/AngleCircle/layout';
import { DiagramFont } from '../../js/diagram/DrawingObjects/TextObject/TextObject';

// const cssColorNames = [
//   'latin',
//   'line',
//   'angleA',
//   'angleB',
//   'disabled',
// ];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function baseLayout() {
  const colors = getCssColors();
  const layout = {
    limits: new Rect(-3, -2, 6, 4),
    linewidth: 0.03,
    position: new Point(0, 0),

    selector: {
      y: 1.7,
    },

    quiz: {
      check: new Point(0, -1.7),
      position: new Point(0, 0),
      answer: new Point(0, -1.7),
      nextSteps: new Point(0, -1.9),
      newProblem: new Point(0, -1.7),
      showAnotherAnswer: new Point(-1, -1.7),
    },

    defaultFont: new DiagramFont(
      'helvetica, sans-serif',
      'normal',
      0.2,
      '400',
      'center',
      'middle',
      colors.diagram.text.base,
    ),

    colors,
  };
  return layout;
}
