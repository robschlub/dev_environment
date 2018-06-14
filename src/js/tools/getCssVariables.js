// @flow
import { addToObject } from './tools';
// export default function getCSSVariables(
//   id: string,
//   varNames: Array<string>,
//   prefix: string = '',
// ): Object {
//   const elem = document.getElementById('lesson__container_name');
//   const output = {};
//   if (elem) {
//     const style = window.getComputedStyle(elem);
//     if (style) {
//       varNames.forEach((varName) => {
//         const fullName = prefix + varName;
//         output[varName] = parseFloat(style.getPropertyValue(fullName));
//       });
//     }
//   }
//   return output;
// }

function toCamelCase(input: string, prefix) {
  const rePrefix = new RegExp(prefix, 'g');
  const reCamelCase = /-[a-z]/g;
  const repl = str => str[1].toUpperCase();
  const noPrefix = input.replace(rePrefix, '');
  const camelCase = noPrefix.replace(reCamelCase, repl);
  const noDash = camelCase.replace(/-/g, '');
  return noDash;
}

export default function getCSSVariables(
  idOrElement: string | HTMLElement,
  prefix: string = '',
  makeFlat: boolean = true,
): Object {
  const variables = {};
  let elem = idOrElement;
  if (typeof idOrElement === 'string') {
    elem = document.getElementById(idOrElement);
  }
  if (elem instanceof HTMLElement) {
    const style = window.getComputedStyle(elem);

    if (style) {
      const numProperties = style.length;
      for (let i = 0; i < numProperties; i += 1) {
        const propertyName = style[i];
        if (prefix === '' || propertyName.startsWith(prefix)) {
          const value = style.getPropertyValue(propertyName).trim();
          const fValue = parseFloat(value);
          let valueToAdd = value;
          if (!Number.isNaN(fValue)) {
            valueToAdd = fValue;
          }
          if (makeFlat) {
            const shortName = toCamelCase(propertyName, prefix);
            variables[shortName] = valueToAdd;
          } else {
            const rePrefix = new RegExp(prefix, 'g');
            const noPrefix = propertyName.replace(rePrefix, '');
            addToObject(variables, noPrefix, valueToAdd, '-');
          }
        }
      }
    }
  }
  return variables;
}
