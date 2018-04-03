// @flow

const roundNum = (value: number, precision: number = 5) => {
  const multiplier = 10 ** precision;
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
    result = roundNum(arrayOrValue, precision);
  }
  return result;
};

const decelerate = (velocity: number, deceleration: number, time: number) => {
  const sign = velocity / Math.abs(velocity);
  const newVelocity = velocity - sign * deceleration * time;
  const newSign = newVelocity / Math.abs(newVelocity);
  if (newSign !== sign) {
    return 0;
  }
  return newVelocity;
};

const easeinout = (percentTime: number) => {
  const x = percentTime;
  const percentDistance = (x ** 2) / ((x ** 2) + ((1 - x) ** 2));
  return percentDistance;
};

function easeout(percentTime: number) {
  const x = 0.5 + percentTime / 2;
  const power = 2;
  const percentDistance = (x ** power) / ((x ** power) + ((1 - x) ** power));
  return (percentDistance - 0.5) * 2;
}
function easein(percentTime: number) {
  const x = percentTime / 2;
  const power = 2;
  const percentDistance = (x ** power) / ((x ** power) + ((1 - x) ** power));
  return percentDistance * 2;
}

function sinusoid(
  deltaTime: number = 1,
  frequency: number = 1,
  bias: number = 0,
  mag: number = 1,
  phaseOffset: number = 0,
) {
  return bias + mag * Math.sin(deltaTime * frequency * 2.0 * Math.PI + phaseOffset);
}
// const animationPhase = (transform, time, rotDirection = 0, animationStyle = easeinout) => {
//     return {
//         transform: transform.copy(),
//         time: time,
//         rotDirection: rotDirection,
//         animationStyle: animationStyle,
//     }
// }

export {
  round,
  roundNum,
  decelerate,
  easeinout,
  easeout,
  easein,
  sinusoid,
};

