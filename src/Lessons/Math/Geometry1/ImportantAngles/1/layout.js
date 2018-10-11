// @flow

import { Point } from '../../../../../js/diagram/tools/g2';
import getCssColors from '../../../../../js/tools/getCssColors';
import angleCircleLayout from '../../../../LessonsCommon/AngleCircle/layout';

const cssColorNames = [
  // 'radiusLight',
  'latin',
  'arcLight',
  'rotation',
  'action',
  'disabled',
  'angleArea',
  'axes',
  // 'degrees',
  // 'radians',
];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function lessonLayout() {
  const colors = getCssColors(cssColorNames);
  const layout: Object = angleCircleLayout();
  layout.colors = Object.assign(colors, layout.colors);
  // layout.radius = 0.9;
  // layout.radiusArc = {
  //   radius: 1.25,
  // };

  // layout.compare = {
  //   radiusOffset: 0.2,
  //   arcOffset: 0.3,
  //   textPosition: new Point(2.0, -0.42),
  // };

  layout.circle.right = new Point(1.4, -0.2);
  //   right: new Point(1.1, -0.3),
  //   mostRight: new Point(1.6, -0.3),
  //   middleMostRight: new Point(1.6, -0.2),
  //   summary: new Point(1.6, 0),
  //   angle: {
  //     small: 0.8,
  //     large: Math.PI * 1.4,
  //   },
  // };

  // layout.circEquation = {
  //   leftBottom: new Point(-1.6, -1.1),
  //   twoPiOffset: new Point(0.08, 0),
  //   summary: new Point(-1.55, -1.75),
  //   summaryScale: 0.8,
  // };
  // layout.arcEquation = {
  //   left: new Point(-2.3, -1.2),
  //   // leftMiddle: new Point(-2.5, -1.1),
  //   centerTop: new Point(-1.0, 0.9),
  //   centerBottom: new Point(-0.5, -1.0),
  //   center: new Point(-0.5, 0),
  //   leftBottom: new Point(-1.7, -1.3),
  //   scale: 1.2,
  //   summaryScale: 0.8,
  //   summary: new Point(-1.55, -1.1),
  // };
  // layout.sectionText = {
  //   position: new Point(-2.3, -0.3),
  // };
  // layout.angleEqualsText.leftCenter = new Point( -2.1, -0.2);
  // layout.angleEqualsText.left = new Point(-2.3, -0.6);
  // layout.angleEqualsText.top = new Point(0.7, 1.2);
  // layout.angleEqualsText.bottomMostRight = new Point(0.9, -1.7);
  // layout.angleEqualsText.bottomMostRightDeg = new Point(1.1, -1.7);
  // layout.angleEqualsText.summary = new Point(1.1, -1.6);
  layout.angleEqualsText.bottomRight = new Point(1.0, -1.7);
  layout.axes = {
    length: 1.3,
  };
  return layout;
}
