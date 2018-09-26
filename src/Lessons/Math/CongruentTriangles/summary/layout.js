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
      scenario: { position: new Point(-1.2, -0.6), rotation: 0 },
    },
    tri2: {
      scenario: { position: new Point(1.2, -0.6), rotation: 0 },
    },
    tri1CongruencyTests: {
      scenario: { position: new Point(1.4, -0.3), rotation: 0, scale: new Point(1.2, 1.2) },
    },
  };
  layout.label = {
    position: new Point(1.3, -1.3),
  };
  return layout;
}
