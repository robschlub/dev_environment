// @flow

import { cssColorToArray } from './tools';
import { getDefinedCSSVariables } from './getCssVariables';

const baseColors = [
  'blue',
  'red',
  'yellow',
  'green',
  'cyan',
  'brown',
  'orange',
  'violet',
  'grey',
  'black',
  'white',
];

const shades = [
  'base',
  'lighter',
  'light',
  'dark',
  'darker',
  'higher',
  'high',
  'low',
  'lower',
];

const paletteColorNames = [];
baseColors.forEach((color) => {
  shades.forEach((shade) => {
    paletteColorNames.push(`--palette-${color}-${shade}`);
  });
});

const diagramColorNames = [
  '--diagram-background',
  '--diagram-primary',
  '--diagram-warning',
  '--diagram-safe',
  '--diagram-passive',
  '--diagram-disabled',
  '--diagram-disabledDark',
  '--diagram-disabledDarkest',
  '--diagram-push',
  '--diagram-action',
  '--diagram-text-base',
  '--diagram-text-warning',
  '--diagram-text-plot',
  '--diagram-text-keyword',
  '--diagram-text-keyword2',
  '--diagram-text-latin',
  '--diagram-text-greek',
  '--diagram-text-english',
  '--diagram-quizCheck',
];

export default function getCSSColors(customColorNames: Array<string> = []): Object {
  let colors: Object = {};
  let paletteColors: Object = {};
  let diagramColors: Object = {};
  const colorNames = customColorNames.map(name => `--colors-${name}`);

  const { body } = document;
  if (body) {
    colors = getDefinedCSSVariables(
      body, colorNames, '--colors-', false,
      // $FlowFixMe
      cssColorToArray,
    );

    paletteColors = getDefinedCSSVariables(
      body, paletteColorNames, '--palette-', false,
      // $FlowFixMe
      cssColorToArray,
    );

    diagramColors = getDefinedCSSVariables(
      body, diagramColorNames, '--diagram-', false,
      // $FlowFixMe
      cssColorToArray,
    );
  }

  colors.palette = paletteColors;
  colors.diagram = diagramColors;
  return colors;
}

