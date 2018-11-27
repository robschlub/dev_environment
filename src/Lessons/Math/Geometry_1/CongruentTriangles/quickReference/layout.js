// @flow
import './style.scss';
import commonLessonLayout from '../common/layout';
import { Point } from '../../../../../js/diagram/tools/g2';

export default function lessonLayout() {
  const layout: Object = commonLessonLayout();
  layout.triangles.congruent = {
    points: [
      new Point(-0.8, -0.5),
      new Point(0.8, -0.5),
      new Point(0.5, 0.5),
    ],
    tri1: {
      scenario: { position: new Point(-0.9, -0.1), rotation: 0 },
    },
    tri2: {
      scenario: { position: new Point(0.9, -0.1), rotation: 0 },
    },
  };
  layout.triangles.aaa = {
    points: [
      new Point(-0.8, -0.5),
      new Point(0.8, -0.5),
      new Point(0.5, 0.5),
    ],
    tri1: {
      scenario: { position: new Point(-0.9, -0.1), rotation: 0 },
    },
    tri2: {
      scenario: { position: new Point(0.9, -0.1), rotation: 0, scale: new Point(0.7, 0.7) },
    },
  };
  layout.triangles.saa = {
    tri1: {
      scenario: { position: new Point(-0.2, -0.2), rotation: 0, scale: (0.9, 0.9) },
      points: [
        new Point(-1.5, 0),
        new Point(-0.5, 0),
        new Point(0, 1),
      ],
    },
    tri2: {
      points: [
        new Point(-1.5, 0),
        new Point(-0.5, 0),
        new Point(0, 1),
      ],
      scenario: { position: new Point(1.4, -0.2), rotation: 0, scale: (0.9, 0.9) },
    },
  };
  // layout.triangles.congruentRot = {
  //   tri1: {
  //     scenario: { position: new Point(-1.05, 0.4), rotation: 0 },
  //   },
  //   tri2: {
  //     scenario: { position: new Point(1.05, 0.4), rotation: Math.PI },
  //   },
  // };
  return layout;
}
