// @flow
import './style.scss';
import commonLessonLayout from '../common/layout';
import { Point } from '../../../../../js/diagram/tools/g2';

export default function lessonLayout() {
  const layout: Object = commonLessonLayout();
  layout.quadPosition = new Point(0, 0.3);
  return layout;
}
