// @flow

const roundValue = (value: number, precision: number = 5) => {
  const multiplier = 10 ** precision;
  // if (value.constructor == d2.point(0,0).constructor) {}
  let result = Math.round(value * multiplier) / multiplier;
  if (Object.is(result, -0)) {
    result = 0;
  }
  return result;
};

const round = (arrayOrValue: number | Array<number>, precision: number = 5) => {
  let result = 0;
  if (arrayOrValue instanceof Array) {
    result = arrayOrValue.map(elem => round(elem, precision));
  // } else if (arrayOrValue.constructor == d2.point(0,0).constructor){
  //     result = roundPoint(arrayOrValue, precision);
  } else {
    result = roundValue(arrayOrValue, precision);
  }
  return result;
};

export default round;
