// @flow
import './style.scss';
import commonLessonLayout from '../common/layout';
import { Point } from '../../../../../js/diagram/tools/g2';

export default function lessonLayout() {
  const layout: Object = commonLessonLayout();
  layout.areaPosition = new Point(0, 0.5);
  layout.squareA.width = 0.05;
  layout.circleA.width = 0.05;
  layout.triangleA.width = 0.07;
  return layout;
}
