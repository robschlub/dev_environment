// @flow

export default function getCSSVariables(
  id: string,
  varNames: Array<string>,
  prefix: string = '',
): Object {
  const elem = document.getElementById('lesson__container_name');
  const output = {};
  if (elem) {
    const style = window.getComputedStyle(elem);
    if (style) {
      varNames.forEach((varName) => {
        const fullName = prefix + varName;
        output[varName] = parseInt(style.getPropertyValue(fullName), 10);
      });
    }
  }
  return output;
}
