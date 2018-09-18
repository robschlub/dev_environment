// @flow
import './style.scss';
import commonLessonLayout from '../common/layout';
import { Point } from '../../../../js/diagram/tools/g2';

export default function lessonLayout() {
  const layout: Object = commonLessonLayout();
  layout.position = new Point(0, 0);
  layout.lines.position = new Point(0, 0);
  layout.complementary = {
    linesPosition: new Point(-0.5, -0.8),
    equationPosition: new Point(-0.3, 0.7),
  };
  layout.equationScale = 1;
  layout.supplementary = {
    linesPosition: new Point(0, -0.7),
    equationPosition: new Point(-0.3, 0.7),
  };
  layout.explementary = {
    linesPosition: new Point(0, -0.2),
    equationPosition: new Point(0, 1.15),
  };
  return layout;
}
