// @flow

import colorNames from './colorNames';  // official css color names
import cssColors from './cssColors';    // color definitions used in project

// Function that converts any rgb or rgba string to an array of rgba numbers
// between 0 and 1
function RGBtoArray(color: string): Array<number> {
  // Reduce the rgb(a) string to just numbers
  let colString: string = color;
  colString = colString.replace(/.*\(/i, '');
  colString = colString.replace(/\)/i, '');
  const strArray = colString.split(', ');

  // Go through each rgb(a) value and normalize to 1.0
  const value: Array<number> = strArray.map(x => parseInt(x, 10) / 255.0);

  // If an alpha value isn't included, then include it with default value 1.0
  if (value.length === 3) {
    value.push(1);
  }
  return value;
}

// Function that converts any hex color string to an array of rgba numbers
// between 0 and 1 (where alpha is always 1)
function HexToArray(color: string): Array<number> {
  const col: Array<number> = [
    parseInt(color.slice(1, 3), 16) / 255.0,
    parseInt(color.slice(3, 5), 16) / 255.0,
    parseInt(color.slice(5, 7), 16) / 255.0,
    1,
  ];
  return col;
}


// Gets the css color definitions from the project's scss files, converts them
// to rbga color arrays, and returns a dictionary of colors and values.
//
// Returns an dictionary of:
//    key: color name defined in css
//    value: rgba color array with each element between 0 and 1
const getColors = () => {
  const styles = cssColors();                // Colors from css
  const oNames = colorNames();               // Official css color names
  const colors: Object = {};                 // Object of colors and values

  // styles is a dictionary of "color name from css": "color value" where
  // the color value might be one of:
  //   - hex string e.g. #ff00ff
  //   - rgba string e.g. rgba(255, 0, 255, 128)
  //   - css color name e.g. "blue"
  // Go through each color from the css, and convert it to the four number
  // rgba array
  Object.keys(styles).forEach((key) => {
    let color: string = styles[key];
    // If the color is an official name, then replace it with the hex rgb
    // equivalent
    if (color in oNames) {
      color = oNames[color];
    }

    // colorValue is the rgba array of colors between 0 and 1
    let colorValue: Array<number> = [];

    // If color string starts with 'rgb' (and therefore also 'rgba')
    if (color.toLowerCase().startsWith('rgb')) {
      colorValue = RGBtoArray(color);

    // If color string starts with '#' it is hex
    } else if (color.startsWith('#')) {
      colorValue = HexToArray(color);
    }

    // If the color value array is defined, then add it to the final
    // dictionary
    if (colorValue.length > 0) {
      colors[key] = colorValue;
    }
  });
  return colors;
};

export default getColors;
