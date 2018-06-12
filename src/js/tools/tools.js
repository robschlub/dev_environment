// @flow
import colorNames from './colorNames';  // official css color names

const Console = (text: string) => {
  console.log(text); // eslint-disable-line no-console
};

function add(a: number, b: number): number {
  return a + b;
}

function mulToString(a: number, b: number): string {
  return (a * b).toString();
}

const divide = (a: number, b: number): number => a / b;

const classify = (key: string, value: string) => {
  const nonEmpty = value || key;
  const withKey = nonEmpty[0] === '-' || nonEmpty.startsWith(`${key}-`) ?
    `${key} ${nonEmpty}` :
    nonEmpty;
  const joinStr = ` ${key}-`;
  return `${withKey.split(' -').join(joinStr)}`;
};


class ObjectKeyPointer {
  object: Object;
  key: string;
  constructor(object: Object, key: string) {
    this.object = object;
    this.key = '';
    if (key in object) {
      this.key = key;
    }
  }
  setValue(value: mixed) {
    if (this.key) {
      this.object[this.key] = value;
    }
  }
  execute(...args: mixed) {
    if (this.key) {
      return this.object[this.key].apply(null, args);
    }
    return undefined;
  }
  value() {
    if (this.key) {
      return this.object[this.key];
    }
    return undefined;
  }
}
//
function extractFrom(
  objectToExtractFrom: Object,
  keyValues: Object | Array<any> | string,
  keyPrefix: string = '',
) {
  const out = [];
  if (typeof keyValues === 'string') {
    if (keyPrefix + keyValues in objectToExtractFrom) {
      return new ObjectKeyPointer(objectToExtractFrom, keyPrefix + keyValues);
    }
    const keyHeirarchy = keyValues.split('_');
    const keys = keyHeirarchy.filter(k => k.length > 0);
    if (keys.length > 1) {
      if (keyPrefix + keys[0] in objectToExtractFrom) {
        return extractFrom(objectToExtractFrom[keyPrefix + keys[0]], keys.slice(1).join('_'), keyPrefix);
      }
    } else if (keys.length === 1) {
      if (keyPrefix + keys[0] in objectToExtractFrom) {
        return new ObjectKeyPointer(objectToExtractFrom, keyPrefix + keys[0]);
      }
    }
    return undefined;
  } else if (Array.isArray(keyValues)) {
    keyValues.forEach((kv) => {
      const result = extractFrom(objectToExtractFrom, kv, keyPrefix);
      if (result !== undefined) {
        out.push(result);
      }
    });
  } else {
    Object.keys(keyValues).forEach((key) => {
      if (keyPrefix + key in objectToExtractFrom) {
        out.push({
          obj: new ObjectKeyPointer(objectToExtractFrom, keyPrefix + key),
          // $FlowFixMe
          value: keyValues[key],
        });
      }
    });
  }
  return out;
}

function getElement(
  collection: Object,
  keyValues: Object | Array<any> | string,
) {
  return extractFrom(collection, keyValues, '_');
}

// Function that converts any rgb or rgba string to an array of rgba numbers
// between 0 and 1
function RGBToArray(color: string): Array<number> {
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
  let colHex: string = color.slice(1);
  if (colHex.length < 6) {
    colHex =
      `${colHex[0]}${colHex[0]}${colHex[1]}${colHex[1]}${colHex[2]}${colHex[2]}`;
  }
  const col: Array<number> = [
    parseInt(colHex.slice(0, 2), 16) / 255.0,
    parseInt(colHex.slice(2, 4), 16) / 255.0,
    parseInt(colHex.slice(4, 6), 16) / 255.0,
    1,
  ];
  return col;
}

function cssColorToArray(cssColorString: string): Array<number> | null {
  const oNames = colorNames();               // Official css color names
  let color = cssColorString.slice(0);

  // If the color is an official name, then replace it with the hex rgb
  // equivalent
  if (color in oNames) {
    color = oNames[color];
  }

  // colorValue is the rgba array of colors between 0 and 1
  let colorValue: Array<number> = [];

  // If color string starts with 'rgb' (and therefore also 'rgba')
  if (color.toLowerCase().startsWith('rgb')) {
    colorValue = RGBToArray(color);

  // If color string starts with '#' it is hex
  } else if (color.startsWith('#')) {
    colorValue = HexToArray(color);
  }

  // If the color value array is defined, then add it to the final
  // dictionary
  if (colorValue.length > 0) {
    return colorValue;
  }
  return null;
}

function colorArrayToRGBA(color: Array<number>) {
  return `rgba(${
    Math.floor(color[0] * 255)},${
    Math.floor(color[1] * 255)},${
    Math.floor(color[2] * 255)},${
    color[3]})`;
}

function colorArrayToRGB(color: Array<number>) {
  return `rgb(${
    Math.floor(color[0] * 255)},${
    Math.floor(color[1] * 255)},${
    Math.floor(color[2] * 255)})`;
}

export {
  divide, mulToString, add, Console,
  classify, extractFrom, ObjectKeyPointer, getElement,
  RGBToArray, HexToArray, cssColorToArray, colorArrayToRGB,
  colorArrayToRGBA,
};
