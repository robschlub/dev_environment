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
  const withKey = nonEmpty[0] === '-' || nonEmpty.startsWith(`${key}-`)
    ? `${key} ${nonEmpty}` : nonEmpty;
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
  }

  if (Array.isArray(keyValues)) {
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
  const strArray = colString.split(',');
  // Go through each rgb(a) value and normalize to 1.0
  const value: Array<number> = strArray.map((x, index) => {
    if (index < 3) {
      return parseInt(x, 10) / 255.0;
    }
    return parseFloat(x);
  });

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

function addToObject(
  obj: Object,
  nameToAdd: string,
  valueToAdd: mixed,
  splitStr: string = '-',
) {
  const levels = nameToAdd.split(splitStr);
  let currentLevel: Object = obj;
  levels.forEach((level, index) => {
    if (index === levels.length - 1) {
      currentLevel[level] = valueToAdd;
      return;
    }
    if (!Object.prototype.hasOwnProperty.call(currentLevel, level)) {
      currentLevel[level] = {};
    }
    currentLevel = currentLevel[level];
  });
}

function duplicateFromTo(
  fromObject: Object,
  toObject: Object,
  exceptKeys: Array<string> = [],
) {
  const copyValue = (value) => {
    if (typeof value === 'number'
        || typeof value === 'boolean'
        || typeof value === 'string'
        || value == null
        || typeof value === 'function') {
      return value;
    }
    if (typeof value._dup === 'function') {
      return value._dup();
    }
    if (Array.isArray(value)) {
      const arrayCopy = [];
      value.forEach(arrayElement => arrayCopy.push(copyValue(arrayElement)));
      return arrayCopy;
    }
    if (typeof value === 'object') {
      const objectCopy = {};
      Object.keys(value).forEach((key) => {
        const v = copyValue(value[key]);
        objectCopy[key] = v;
      });
      return objectCopy;
    }
    return value;
  };

  Object.keys(fromObject).forEach((key) => {
    if (exceptKeys.indexOf(key) === -1) {
      // eslint-disable-next-line no-param-reassign
      toObject[key] = copyValue(fromObject[key]);
    }
  });
}

// joins objects like object.assign but goes as many levels deep as the object
// is. Objects later in the arrawy overwrite objects earlier.
function joinObjects(...objects: Array<Object>): Object {
  // if (typeof objects === 'object') {
  //   return objects;
  // }
  const assignObjectFromTo = (fromObject: Object, toObject: Object) => {
    Object.keys(fromObject).forEach((key) => {
      const value = fromObject[key];
      if (typeof value === 'number'
        || typeof value === 'boolean'
        || typeof value === 'string'
        || value == null
        || typeof value === 'function'
        || typeof value._dup === 'function'
        || Array.isArray(value)
      ) {
        // console.log(value, toObject[key])
        if (value !== undefined || toObject[key] === undefined) {
          // eslint-disable-next-line no-param-reassign
          toObject[key] = value;
        }
      } else {
        const toValue = toObject[key];
        if (typeof toValue === 'number'
          || typeof toValue === 'boolean'
          || typeof toValue === 'string'
          || toValue == null
          || typeof toValue === 'function'
          || Array.isArray(toValue)
        ) {
          // eslint-disable-next-line no-param-reassign
          toObject[key] = {};
        }
        assignObjectFromTo(value, toObject[key]);
      }
    });
  };

  const num = objects.length;
  const out = objects[0];
  for (let i = 1; i < num; i += 1) {
    const o = objects[i];
    if (o != null) {
      assignObjectFromTo(o, out);
    }
  }
  return out;
}

function generateUniqueId(seed: string = '') {
  const randomString = s => `${s}${Math.floor(Math.random() * 1000000)}`;
  let seedToUse = seed;
  if (seedToUse.length === 0) {
    seedToUse = 'id_random_';
  }
  let idExists = true;
  let newId = randomString(seedToUse);
  while (idExists) {
    newId = randomString(seedToUse);
    const element = document.getElementById(newId);
    if (element == null) {
      idExists = false;
    }
  }
  return newId;
}

function isTouchDevice() {
  const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
  const mq = query => window.matchMedia(query).matches;

  /* eslint-disable no-undef, no-mixed-operators */
  // $FlowFixMe
  if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
    return true;
  }
  /* eslint-enable no-undef, no-mixed-operators */

  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
  return mq(query);
}

function loadRemote(
  scriptId: string,
  url: string,
  callback: null | (string, string) => void = null,
) {
  const existingScript = document.getElementById(scriptId);
  if (!existingScript) {
    console.log('does not exist')
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.id = scriptId; // e.g., googleMaps or stripe
    if (document.body) {
      document.body.appendChild(script);
    }
    script.onload = () => {
      if (callback != null) {
        callback(scriptId, url);
      }
    };
  } else if (callback != null) {
    callback(scriptId, url);
  }
}

function loadRemoteCSS(
  id: string,
  url: string,
  callback: null | (string, string) => void = null,
) {
  const existingScript = document.getElementById(id);
  if (!existingScript) {
    console.log('does not exist')
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    link.id = id; // e.g., googleMaps or stripe
    if (document.body) {
      document.body.appendChild(link);
    }
    link.onload = () => {
      if (callback != null) {
        callback(id, url);
      }
    };
  } else if (callback != null) {
    callback(id, url);
  }
}

// function remoteLoadToObject(
//   scriptId: string,
//   url: string,
//   toObject: {},
//   callback: null | (string, string) => void = null,
// ) {
//   loadRemote(scriptId, url, callback);

// }

const cleanUIDs = (objectToClean: Object) => {
  const genericUID = '0000000000';
  if (objectToClean == null) {
    return;
  }
  if ('uid' in objectToClean) {
    if (objectToClean.uid === genericUID) {
      return;
    }
    // eslint-disable-next-line no-param-reassign
    objectToClean.uid = genericUID;
  }
  const keys = Object.keys(objectToClean);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const value = objectToClean[key];
    if (
      typeof value === 'object'
      && !Array.isArray(value)
      && value != null
      && typeof value !== 'function'
      && typeof value !== 'number'
      && typeof value !== 'boolean'
      && typeof value !== 'string'
    ) {
      cleanUIDs(value);
    }
  }
};

export {
  divide, mulToString, add, Console,
  classify, extractFrom, ObjectKeyPointer, getElement,
  RGBToArray, HexToArray, cssColorToArray, colorArrayToRGB,
  colorArrayToRGBA, addToObject, duplicateFromTo, isTouchDevice,
  generateUniqueId, joinObjects, cleanUIDs, loadRemote, loadRemoteCSS,
};
