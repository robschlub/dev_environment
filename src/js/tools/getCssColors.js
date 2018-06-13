// @flow

// import colorNames from './colorNames';  // official css color names
// import { HexToArray, RGBToArray } from './tools';
import { cssColorToArray } from './tools';
import getCSSVariables from './getCssVariables';

// function toCamelCase(input: string, prefix = 'ColorsColor') {
//   const reCamelCase = /-[a-z]/g;
//   const repl = str => str[1].toUpperCase();
//   const camelCase = input.replace(reCamelCase, repl);
//   const noDash = camelCase.replace(/-/g, '');
//   return noDash;
// }

export default function getCSSColors(): Object {
  const colors = {};
  const paletteColors = {};
  const { body } = document;
  if (body) {
    const cssColors = getCSSVariables(body, '--colors-');
    Object.keys(cssColors).forEach((key) => {
      // let value = cssColors[key];
      const value = cssColorToArray(cssColors[key]);
      if (value) {
        colors[key] = value;
      }
    });

    const cssPaletteColors = getCSSVariables(body, '--palette-');
    Object.keys(cssPaletteColors).forEach((key) => {
      // let value = cssColors[key];
      const value = cssColorToArray(cssPaletteColors[key]);
      if (value) {
        paletteColors[key] = value;
      }
    });
  }
  // // const style = window.getComputedStyle(document.body);
  // if (style) {
  //   const numProperties = style.length;
  //   for (let i = 0; i < numProperties; i += 1) {
  //     const propertyName = style[i];
  //     if (propertyName.startsWith('--colors-')) {
  //       const colorString = style.getPropertyValue(propertyName);
  //       const colorValue = cssColorToArray(colorString);
  //       if (colorValue) {
  //         const shortName = toCamelCase(propertyName);
  //         colors[shortName] = colorValue;
  //       }
  //     }
  //   }
  // }
  colors.palette = paletteColors;
  return colors;
}
