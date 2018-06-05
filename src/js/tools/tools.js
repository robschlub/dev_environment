// @flow

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
export {
  divide, mulToString, add, Console,
  classify, extractFrom, ObjectKeyPointer, getElement,
};
