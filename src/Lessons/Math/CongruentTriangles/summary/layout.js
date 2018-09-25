// @flow
import commonLessonLayout from '../common/layout';
import { Point } from '../../../../js/diagram/tools/g2';

export default function lessonLayout() {
  const layout: Object = commonLessonLayout();
  layout.triangles.congruent = {
    points: [
      new Point(-0.8, -0.5),
      new Point(0.8, -0.5),
      new Point(0.5, 0.5),
    ],
    tri1: {
      scenario: { position: new Point(-1.2, -0.8), rotation: 0 },
    },
    tri2: {
      scenario: { position: new Point(1.2, -0.8), rotation: 0 },
    },
  };
  return layout;
}
