// @flow

// import { Point } from '../../../js/diagram/tools/g2';
import getCssColors from '../../../js/tools/getCssColors';
import sinCosCircleLayout from '../../../LessonsCommon/SinCosCircle/layout';

const cssColorNames = [
];

/* eslint-disable key-spacing, comma-spacing, no-multi-spaces, space-in-parens */
export default function lessonLayout() {
  const colors = getCssColors(cssColorNames);
  console.log(colors)
  const layout: Object = sinCosCircleLayout();
  layout.colors = Object.assign(colors, layout.colors);
  return layout;
}
