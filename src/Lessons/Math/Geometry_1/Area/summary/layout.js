// @flow
import commonLessonLayout from '../common/layout';
import { Point } from '../../../../../js/diagram/tools/g2';

export default function lessonLayout() {
  const layout: Object = commonLessonLayout();
  // layout.summaryMeasPosition = new Point(0, -0.3);
  layout.measurePosition = new Point(0, -0.3);
  layout.squareA.labelOffset = -1.15;
  layout.triangleA.labelOffset = -0.95;
  layout.circleA.labelOffset = -1.15;
  return layout;
}
