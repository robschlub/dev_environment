// @flow

// import styles from '../../css/diagram.scss';
import colorDefs from './colorDefs';
import cssColors from './cssColors';

// function RGBAtoArray (color: string): Array<number> {
//   // const value: Array<number> = [0, 0, 0, 1];
  
//   // let colstring:string = string;
//   // colString = colString.replace(/.*\(/i,'');
//   // colString = colString.replace(/\)/i,'');
//   // colString = colString.split(",");
//   // return value;
// }

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
  // const colors = [];
  // const colorArray: Array<Array<number>> = [];
  const styles = cssColors();
  const defs = colorDefs();

  const colorOutput: Object = {};
  console.log("Styles:", styles);

  Object.keys(styles).forEach((key) => {
    let color: string = styles[key];
    if (color in defs) {
      color = defs[color];
    }
    let colorValue: Array<number> = [];
    if (color.startsWith('rgba')) {
      // colorValue = RGBAtoArray(color);
    } else if (color.startsWith('#')) {
      colorValue = HexToArray(color);
    }
    if (colorValue.length > 0) {
      colorOutput[key] = colorValue;
    }
    // color=
    // console.log('after: ', key, color);
  });
  // const colors = styles.map(color => )
  // console.log(styles);
  return colorOutput;
};

export default getColors;
