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


// clipValue clips a value to either 0 if it's small enough, or to a max value
// Value, and maxValue are sign independent. e.g.
//    * value, maxValue = 2, 1 => clips to 1
//    * value, maxValue = -2, -1 => clips to -1
//    * value, maxValue = -2, 1 => clips to -1
//    * value, maxValue = 2, -1 => clips to 1
function clipValue(
  value: number,
  zeroThreshold: number,
  maxValue: number = 0,
) {
  let result = value;
  let zero = zeroThreshold;
  if (zero < 0) {
    zero = -zero;
  }
  if (value > -zero && value < zero) {
    return 0;
  }
  let max = maxValue;
  if (max < 0) {
    max = -max;
  }

  if (value > max) {
    result = max;
  }
  if (value < -max) {
    result = -max;
  }
  return result;
}

// const dec = function(
//   position: number,
//   velocity: number,
//   magDeceleration: number,
//   time: number,
//   zeroThreshold: number = 0,
// ) {
//   // If the velocity is currently 0, then no further deceleration can occur, so
//   // return the current velocity and position
//   if (velocity == 0 || clipValue(velocity, zeroThreshold, velocity))
//     return {
//       p: position,
//       v: 0,
//     }

//   // If there is some initial velocity, then calc its sign and 
//   const sign = velocity / Math.abs(velocity);
//   let newVelocity = velocity - sign * magDeceleration * time;
//   newVelocity = clipValue(newVelocity, zeroThreshold, newVelocity);

//   const newPosition = 
//     position + velocity * time - sign * 0.5 * magDeceleration * time * time;

//   const newSign = newVelocity / Math.abs(newVelocity);
//   if (newSign !== sign) {
//     return 0;
//   }
//   return newVelocity;
// };
// }
// Decelerate a velocity by some deceleration over time
const decelerate = (velocity: number, deceleration: number, time: number) => {
  const sign = velocity / Math.abs(velocity);
  const newVelocity = velocity - sign * deceleration * time;
  const newSign = newVelocity / Math.abs(newVelocity);
  if (newSign !== sign) {
    return 0;
  }
  return newVelocity;
};

const linear = (percentTime: number) => percentTime;

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
  linear,
  clipValue,
};

