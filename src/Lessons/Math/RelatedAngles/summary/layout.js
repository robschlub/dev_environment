// @flow

// import { Rect, Point } from '../../../../js/diagram/tools/g2';
// import getCssColors from '../../../../js/tools/getCssColors';
import lessonLayoutCommon from '../common/layout';

// const cssColorNames = [
//   'latin',
//   'line',
//   'angleA',
//   'angleB',
//   'angleC',
//   'angleD',
//   'disabled',
//   'supplementary',
//   'intersectingLine',
//   'quizLine',
// ];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function lessonLayout() {
  const layout: Object = lessonLayoutCommon();
  // layout.colors = getCssColors(cssColorNames);

  return layout;
}
