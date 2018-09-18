// @flow
import './style.scss';
import commonLessonLayout from '../common/layout';
import { Point } from '../../../../js/diagram/tools/g2';

export default function lessonLayout() {
  const layout: Object = commonLessonLayout();
  layout.position = new Point(0, 0);
  layout.lines.position = new Point(0, 0);
  layout.complementary = {
    linesPosition: new Point(-0.5, -0.25),
    equationPosition: new Point(1.5, 0.4),
  };
  layout.equationScale = 0.7;
  layout.supplementary = {
    linesPosition: new Point(0, -0.45),
    equationPosition: new Point(0, -0.7),
  };
  layout.explementary = {
    linesPosition: new Point(-1, -0.45),
    equationPosition: new Point(0.5, -0.2),
  };
  layout.lines.complementaryPosition = new Point(-0.4, -0.45);
  layout.lines.supplementaryPosition = new Point(0, -0.6);
  layout.lines.explementaryPosition = new Point(0, 0);
  return layout;
}
