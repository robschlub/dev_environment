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


// // clipValue clips a value to either 0 if it's small enough, or to a max value
// // Value, and maxValue are sign independent. e.g.
// //    * value, maxValue = 2, 1 => clips to 1
// //    * value, maxValue = -2, -1 => clips to -1
// //    * value, maxValue = -2, 1 => clips to -1
// //    * value, maxValue = 2, -1 => clips to 1
// function clipValue(
//   value: number,
//   zeroThreshold: number,
//   maxValue: number = 0,
// ) {
//   let result = value;
//   let zero = zeroThreshold;
//   if (zero < 0) {
//     zero = -zero;
//   }
//   if (value > -zero && value < zero) {
//     return 0;
//   }
//   let max = maxValue;
//   if (max < 0) {
//     max = -max;
//   }

//   if (value > max) {
//     result = max;
//   }
//   if (value < -max) {
//     result = -max;
//   }
//   return result;
// }


// Clip a value to either max velocity, or 0 once under the minimum
// threashold.
//  * velocity: can be positive or negative
//  * maxVelocity will clip velocity to:
//      * |maxVelocity| if velocity > 0
//      * -|maxVelocity| if velcity < 0
//  * zeroThreshold will clip velocity to:
//       * 0 if velocity is larger than -|zeroThreshold| and smaller than
//         |zeroThreshold|.
function clipMag(
  value: number,
  zeroThreshold: number | null,
  maxValue: number | null,
): number {
  let result = value;
  let zeroT = zeroThreshold;
  let maxV = maxValue;

  if (zeroT === null) {
    zeroT = 0;
  }
  if (zeroT < 0) {
    zeroT = -zeroT;
  }
  if (maxV === null) {
    return result;
  }
  if (maxV < 0) {
    maxV = -maxV;
  }
  if (value >= -zeroT && value <= zeroT) {
    result = 0;
  }
  if (value > maxV) {
    result = maxV;
  }
  if (value < -maxV) {
    result = -maxV;
  }
  return result;
}

function clipValue(
  value: number,
  minValue: number | null,
  maxValue: number | null,
): number {
  let clipped = value;
  if (minValue !== null) {
    if (value < minValue) {
      clipped = minValue;
    }
  }

  if (maxValue !== null) {
    if (value > maxValue) {
      clipped = maxValue;
    }
  }
  return clipped;
}

const decelerate = function getPositionVelocityFromDecAndTime(
  position: number,
  velocity: number,
  magDeceleration: number | null,
  time: number,
  zeroThreshold: number | null,
) {
  let zeroT: number = 0;
  if (zeroThreshold !== null) {
    zeroT = zeroThreshold;
  }
  let decel: number = 0;
  if (magDeceleration !== null) {
    decel = magDeceleration;
  }
  // If the velocity is currently 0, then no further deceleration can occur, so
  // return the current velocity and position
  const v = clipMag(velocity, zeroT, velocity);
  if (v === 0) {
    return {
      p: position,
      v: 0,
    };
  }

  let d = decel;
  if (decel < 0) {
    d = -d;
  }
  // If there is some initial velocity, then calc its sign and
  const sign = velocity / Math.abs(velocity);
  let newVelocity = velocity - sign * d * time;

  // if the new velocity changes sign, then it should go to 0. If it doesn't
  // change sign, then clip incase it should go to 0 because it is below
  // the zero velocity threshold.
  const newSign = newVelocity / Math.abs(newVelocity);
  if (newSign !== sign) {
    newVelocity = 0;
  } else {
    newVelocity = clipMag(newVelocity, zeroT, newVelocity);
  }

  // If the new velocity is clipped, then we need to use the time to where the
  // velocity crosses the clipping point.
  // v_new = v_init + a*t
  // Therefore, if v_new = zeroT: t = (zeroT - vi)/a
  let t = time;
  if (newVelocity === 0) {
    let z = zeroT;
    const zSign = z / Math.abs(z);
    if (zSign !== sign) {
      z = -z;
    }
    t = Math.abs((z - velocity) / d);
  }
  // Now can calculate the new position
  const newPosition = position + velocity * t - sign * 0.5 * d * t * t;

  return {
    p: newPosition,
    v: newVelocity,
  };
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
  clipMag,
  clipValue,
};
