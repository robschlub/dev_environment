// @flow
import { Point } from '../../../../js/diagram/tools/g2';
import commonLessonLayout from '../common/layout';

export default function lessonLayout() {
  const layout: Object = commonLessonLayout();

  layout.lines.position = new Point(1.4, 0);
  layout.equationPosition = new Point(-2, -1.1);
  return layout;
}
