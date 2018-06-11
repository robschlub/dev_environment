// @flow

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
  id: string,
  prefix: string = '',
): Object {
  const variables = {};
  const elem = document.getElementById(id);
  if (elem) {
    const style = window.getComputedStyle(elem);
    if (style) {
      const numProperties = style.length;
      for (let i = 0; i < numProperties; i += 1) {
        const propertyName = style[i];
        if (prefix === '' || propertyName.startsWith(prefix)) {
          const value = style.getPropertyValue(propertyName);
          const fValue = parseFloat(value);
          const shortName = toCamelCase(propertyName, prefix);
          if (!Number.isNaN(fValue)) {
            variables[shortName] = fValue;
          } else {
            variables[shortName] = value;
          }
        }
      }
    }
  }
  return variables;
}
