// @flow
import commonLessonLayout from '../common/layout';
import { Point } from '../../../../../js/diagram/tools/g2';

export default function lessonLayout() {
  const layout: Object = commonLessonLayout();
  layout.triPosition = new Point(0, -0.2);
  layout.triLabelOffset = 0.04;
  layout.tri2AreaEqnPosition = new Point(-0.2, 0.8);
  return layout;
}
