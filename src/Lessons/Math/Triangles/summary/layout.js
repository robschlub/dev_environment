// @flow
import commonLessonLayout from '../common/layout';
import { Point } from '../../../../js/diagram/tools/g2';

export default function lessonLayout() {
  const layout: Object = commonLessonLayout();
  layout.totalAngle.equation = {
    position: new Point(-1.3, -1.6),
    scale: 1.2,
  };
  return layout;
}
