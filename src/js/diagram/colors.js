// @flow

// import styles from '../../css/diagram.scss';
import colorDefs from './colorDefs';
import cssColors from './cssColors';

function RGBtoArray(color: string): Array<number> {
  let colString: string = color;
  colString = colString.replace(/.*\(/i, '');
  colString = colString.replace(/\)/i, '');
  const strArray = colString.split(', ');

  const value: Array<number> = strArray.map(x => parseInt(x, 10) / 255.0);

  if (value.length === 3) {
    value.push(1);
  }
  return value;
}

function HexToArray(color: string): Array<number> {
  const col: Array<number> = [
    parseInt(color.slice(1, 3), 16) / 255.0,
    parseInt(color.slice(3, 5), 16) / 255.0,
    parseInt(color.slice(5, 7), 16) / 255.0,
    1,
  ];
  return col;
}

const getColors = () => {
  const styles = cssColors();
  const defs = colorDefs();

  const colorOutput: Object = {};
  Object.keys(styles).forEach((key) => {
    let color: string = styles[key];
    if (color in defs) {
      color = defs[color];
    }
    let colorValue: Array<number> = [];
    if (color.toLowerCase().startsWith('rgb')) {
      colorValue = RGBtoArray(color);
    } else if (color.startsWith('#')) {
      colorValue = HexToArray(color);
    }
    if (colorValue.length > 0) {
      colorOutput[key] = colorValue;
    }
  });
  return colorOutput;
};

export default getColors;
