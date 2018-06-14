// @flow

import { cssColorToArray } from './tools';
import getCSSVariables from './getCssVariables';

export default function getCSSColors(): Object {
  const colors = {};
  const paletteColors = {};
  const diagramColors = {};

  const { body } = document;
  if (body) {
    const cssColors = getCSSVariables(body, '--colors-');
    Object.keys(cssColors).forEach((key) => {
      const value = cssColorToArray(cssColors[key]);
      if (value) {
        colors[key] = value;
      }
    });

    const cssPaletteColors = getCSSVariables(body, '--palette-');
    Object.keys(cssPaletteColors).forEach((key) => {
      const value = cssColorToArray(cssPaletteColors[key]);
      if (value) {
        paletteColors[key] = value;
      }
    });

    const cssDiagramColors = getCSSVariables(body, '--diagram-');
    Object.keys(cssDiagramColors).forEach((key) => {
      const value = cssColorToArray(cssDiagramColors[key]);
      if (value) {
        diagramColors[key] = value;
      }
    });
  }

  colors.palette = paletteColors;
  colors.diagram = diagramColors;
  return colors;
}
