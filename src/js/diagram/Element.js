// @flow

import * as g2 from './g2';
import * as m2 from './m2';
import * as tools from './mathtools';
// import GlobalVariables from './globals';
import VertexObject from './vertexObjects/vertexObject';

// Planned Animation
class AnimationPhase {
  targetTransform: g2.Transform;            // The target transform to animate to
  time: number;                       // animation time
  rotDirection: number;               // Direction of rotation
  animationStyle: (number) => number; // Animation style

  startTime: number;                 // Time when phase started
  startTransform: g2.Transform;       // Transform at start of phase
  deltaTransform: g2.Transform;       // Transform delta from start to target

  constructor(
    transform: g2.Transform = new g2.Transform(),
    time: number = 1,
    rotDirection: number = 0,
    animationStyle: (number) => number = tools.easeinout,
  ) {
    this.targetTransform = transform.copy();
    this.time = time;
    this.rotDirection = rotDirection;
    this.animationStyle = animationStyle;

    this.startTime = -1;
    this.startTransform = new g2.Transform();
    this.deltaTransform = new g2.Transform();
  }

  start(currentTransform: g2.Transform) {
    this.startTransform = currentTransform.copy();
    this.deltaTransform = this.targetTransform.sub(this.startTransform);
    let rotDiff = this.deltaTransform.r() || 0;
    if (rotDiff * this.rotDirection < 0) {
      rotDiff = this.rotDirection * Math.PI * 2.0 + rotDiff;
    }
    this.deltaTransform.updateRotation(rotDiff);
    this.startTime = -1;
  }
}

// A diagram is composed of multiple diagram elements.
//
// A diagram element can either be a:
//  - Primative: a basic element that has the webGL vertices, color
//  - Collection: a group of elements (either primatives or collections)
//
// A diagram element can be:
//  - transformed (resized, offset, rotated)
//  - animated (planned transform over time)
//  - moved with control (like dragging)
//  - moving freely (dragged then let go with an initial velocity)
//  - Pulsed
//
// This class manages:
//  - The diagram element
//  - Its current transformation
//  - Its animation plan, animation control and animation state
//  - Its movement state
//  - Its pulsing parameters
//
// A diagram element has an associated persistant transform that describes how
// to draw it. The transform includes any translation, rotation and/or scaling
// the element should be transformed by before drawing.
//
// If the diagram element is a collection of elements, then this transform is
// applied to all the child elements. Each child element will have it's own
// transform as well, and it will be multiplied by the parent transform.
//
// Whenever an element animated or moved, it's persistant transform is updated.
//
// Pulsing does not update an element's persistant transform, but does alter
// the element's current transform used for drawing itself and any children
// elements it has.
//
class DiagramElement {
  transform: g2.Transform;        // Transform of diagram element
  presetTransforms: Object;       // Convenience dict of transform presets
  lastDrawTransformMatrix: Array<number>; // Transform matrix used in last draw

  show: boolean;                  // True if should be shown in diagram
  name: string;                   // Used to reference element in a collection

  isMovable: boolean;             // Element is able to be moved
  isTouchable: boolean;           // Element can be touched

  // Callbacks
  callback: ?(?mixed) => void;             // ending animation or moving freely
  setTransformCallback: (g2.Transform) => void; // element.transform is updated

  animationPlan: Array<AnimationPhase>;    // Animation plan

  maxVelocity: g2.Transform;            // Maximum velocity allowed

  // When moving freely, the velocity decelerates until it reaches a threshold,
  // then it is considered 0 - at which point moving freely ends.
  moveFreelyProperties: {                 // Moving Freely properties
    zeroVelocityThreshold: g2.Transform,  // Velocity considered 0
    deceleration: g2.Transform,           // Deceleration
  }

  pulse: {
    time: number,
    frequency: number,
    A: number,
    B: number,
    C: number,
    style: (number) => number,
    num: number,
    transformMethod: (number) => g2.Transform,
  };

  // Current animation/movement state of element
  state: {
    isAnimating: boolean,
    animation: {
      currentPhaseIndex: number,
      currentPhase: AnimationPhase,
    },
    isBeingMoved: boolean,
    isMovingFreely: boolean,
    movement: {
      previousTime: number,
      previousTransform: g2.Transform,
      velocity: g2.Transform,           // current velocity - will be clipped
                                        // at max if element is being moved
                                        // faster than max.
    },
    isPulsing: boolean,
    pulse: {
      startTime: number,
    },
  };

  pulse: Object;                  // Pulse animation state

  constructor(
    // translation: g2.Point = g2.Point.zero(),
    // rotation: number = 0,
    // scale: g2.Point = g2.Point.Unity(),
    transform: g2.Transform = new g2.Transform(),
    name: string = '',
  ) {
    this.transform = transform.copy();
    this.setTransformCallback = () => {};
    this.show = true;
    this.lastDrawTransformMatrix = this.transform.matrix();
    this.name = name;

    this.isMovable = false;
    this.isTouchable = false;

    this.callback = null;
    this.animationPlan = [];
    this.maxVelocity = this.transform.constant(100);
    this.moveFreelyProperties = {
      zeroVelocityThreshold: this.transform.constant(0.001),
      deceleration: this.transform.constant(1),
    };

    this.pulse = {
      time: 1,
      frequency: 0.5,
      A: 1,
      B: 0,
      C: 0,
      style: tools.sinusoid,
      num: 1,
      transformMethod: s => new g2.Transform().scale(s, s),
    };

    this.state = {
      isAnimating: false,
      animation: {
        currentPhaseIndex: 0,         // current animation phase index in plan
        currentPhase: new AnimationPhase(),  // current animation phase
      },

      isBeingMoved: false,
      isMovingFreely: false,
      movement: {
        previousTime: -1,
        previousTransform: this.transform.copy(),
        velocity: this.transform.zero(),
      },

      isPulsing: false,
      pulse: {
        startTime: -1,
      },
    };

    this.presetTransforms = {};
  }

  vertexToClip(vertex: g2.Point) {
    return vertex.transformBy(this.lastDrawTransformMatrix);
  }

  // Remove?
  // vertexToScreen(vertex: g2.Point, canvas: HTMLCanvasElement): g2.Point {
  //   const canvasRect = canvas.getBoundingClientRect();
  //   const canvasWidth = canvas.scrollWidth;
  //   const canvasHeight = canvas.scrollHeight;
  //   const transformedVertex = vertex.transformBy(this.lastDrawTransformMatrix);
  //   // const transformedVertex = m2.pointTransform(this.lastDraw, vertex);
  //   return g2.point(
  //     (transformedVertex.x + 1.0) * canvasWidth / 2.0 + canvasRect.left,
  //     (-transformedVertex.y + 1.0) * canvasHeight / 2.0 + canvasRect.top,
  //   );
  // }
  // static isBeingTouched(): boolean {
  //   return false;
  // }

  // Calculate the next transform due to a progressing animation
  calcNextAnimationTransform(elapsedTime: number): g2.Transform {
    const phase = this.state.animation.currentPhase;
    const start = phase.startTransform;
    const delta = phase.deltaTransform;
    const percentTime = elapsedTime / phase.time;
    const percentComplete = phase.animationStyle(percentTime);

    const p = percentComplete;
    let next = new g2.Transform();
    next = start.add(delta.mul(next.scale(p, p).rotate(p).translate(p, p)));
    // next.translation.x = start.translation.x + percentComplete * delta.translation.x;
    // next.translation.y = start.translation.y + percentComplete * delta.translation.y;
    // next.scale.x = start.scale.x + percentComplete * delta.scale.x;
    // next.scale.y = start.scale.y + percentComplete * delta.scale.y;

    // next.rotation = start.rotation + percentComplete * delta.rotation;
    return next;
  }

  // Use this method to set the element's transform in case a callback has been
  // connected that is tied to an update of the transform.
  setTransform(transform: g2.Transform): void {
    this.transform = transform.copy();
    if (this.setTransformCallback) {
      this.setTransformCallback(this.transform);
    }
  }

  // Set the next transform (and velocity if moving freely) for the next
  // animation frame.
  //
  // If animating, this transform will be the next frame determined by
  // the currently executing animation phase. If time exceeds the current
  // phase, then either the next phase will be started, or if there are no
  // more phases, the animation will complete.
  //
  // If moving freely, this method will set the next velocity and transform
  // based on the current velocity, current transform, elapsed time,
  // deceleration (in moveFreelyProperties) and zeroVelocityThreshold.
  // Once the velocity goes to zero, this metho will stop the element moving
  // freely.
  setNextTransform(now: number): void {
    // If animation is happening
    if (this.state.isAnimating) {
      const phase = this.state.animation.currentPhase;

      // If an animation hasn't yet started, the start time will be -1.
      // If this is so, then set the start time to the current time and
      // return the current transform.
      if (phase.startTime < 0) {
        phase.startTime = now;
        return;
      }

      // If we have got here, that means the animation has already started,
      // so calculate the time delta between now and the startTime
      const deltaTime = now - phase.startTime;

      // If this time delta is larger than the phase's planned time, then
      // either progress to the next animation phase, or end animation.
      if (deltaTime > phase.time) {
        // If there are more animation phases in the plan:
        //   - set the current transform to be the end of the current phase
        //   - start the next phase
        if (this.state.animation.currentPhaseIndex < this.animationPlan.length - 1) {
          // Set current transform to the end of the current phase
          this.setTransform(this.calcNextAnimationTransform(phase.time));

          // Get the amount of time that has elapsed in the next phase
          const nextPhaseDeltaTime = deltaTime - phase.time;

          // Start the next animation phase
          this.state.animation.currentPhaseIndex += 1;
          this.animatePhase(this.state.animation.currentPhaseIndex);
          this.state.animation.currentPhase.startTime =
            now - nextPhaseDeltaTime;
          this.setNextTransform(now);
          return;
        }
        // This needs to go before StopAnimating, as stopAnimating clears
        // the animation plan (incase a callback is used to start another
        // animation)
        const endTransform = this.calcNextAnimationTransform(phase.time);
        this.stopAnimating(true);
        this.setTransform(endTransform);
        return;
      }
      // If we are here, that means the time elapsed is not more than the
      // current animation phase plan time, so calculate the next transform.
      this.setTransform(this.calcNextAnimationTransform(deltaTime));
      return;
    }

    // If the element is moving freely, then calc it's next velocity and
    // transform. Save the new velocity into state.movement and return the
    // transform.
    if (this.state.isMovingFreely) {
      // If this is the first frame of moving freely, then record the current
      // time so can calculate velocity on next frame
      if (this.state.movement.previousTime < 0) {
        this.state.movement.previousTime = now;
        return;
      }
      // If got here, then we are now after the first frame, so calculate
      // the delta time from this frame to the previous
      const deltaTime = now - this.state.movement.previousTime;
      // Calculate the new velocity and position
      const next = this.decelerate(deltaTime);
      this.state.movement.velocity = next.velocity;
      this.state.movement.previousTime = now;

      // If the velocity is 0, then stop moving freely and return the current
      // transform
      if (this.state.movement.velocity.isZero()) {
        this.state.movement.velocity = this.state.movement.velocity.zero();
        this.stopMovingFreely();
      }
      this.setTransform(next.transform);
    }
  }

  // static isVelocityZero(transform: g2.Transform): boolean {
  //   if (transform.rotation !== 0) {
  //     return false;
  //   }
  //   if (transform.translation.x !== 0) {
  //     return false;
  //   }
  //   if (transform.translation.y !== 0) {
  //     return false;
  //   }
  //   if (transform.scale.x !== 0) {
  //     return false;
  //   }
  //   if (transform.scale.y !== 0) {
  //     return false;
  //   }
  //   return true;
  // }

  // Decelerate over some time when moving freely to get a new element
  // transform and movement velocity
  decelerate(deltaTime: number): Object {
    const next = this.transform.decelerate(
      this.state.movement.velocity,
      this.moveFreelyProperties.deceleration,
      deltaTime,
      this.moveFreelyProperties.zeroVelocityThreshold,
    );
    // const velocity = this.state.movement.velocity.copy();
    // let result;
    // const v = new g2.Transform();
    // const t = new g2.Transform();
    // result = tools.decelerate(
    //   this.transform.rotation,
    //   velocity.rotation,
    //   this.moveFreelyProperties.deceleration.rotation,
    //   deltaTime,
    //   this.moveFreelyProperties.zeroVelocityThreshold.rotation,
    // );
    // v.rotation = result.v;
    // t.rotation = result.p;

    // result = tools.decelerate(
    //   this.transform.translation.x,
    //   velocity.translation.x,
    //   this.moveFreelyProperties.deceleration.translation.x,
    //   deltaTime,
    //   this.moveFreelyProperties.zeroVelocityThreshold.translation.x,
    // );
    // v.translation.x = result.v;
    // t.translation.x = result.p;

    // result = tools.decelerate(
    //   this.transform.translation.y,
    //   velocity.translation.y,
    //   this.moveFreelyProperties.deceleration.translation.y,
    //   deltaTime,
    //   this.moveFreelyProperties.zeroVelocityThreshold.translation.y,
    // );
    // v.translation.y = result.v;
    // t.translation.y = result.p;

    // result = tools.decelerate(
    //   this.transform.scale.x,
    //   velocity.scale.x,
    //   this.moveFreelyProperties.deceleration.scale.x,
    //   deltaTime,
    //   this.moveFreelyProperties.zeroVelocityThreshold.scale.x,
    // );
    // v.scale.x = result.v;
    // t.scale.x = result.p;

    // result = tools.decelerate(
    //   this.transform.scale.y,
    //   velocity.scale.y,
    //   this.moveFreelyProperties.deceleration.scale.y,
    //   deltaTime,
    //   this.moveFreelyProperties.zeroVelocityThreshold.scale.y,
    // );
    // v.scale.y = result.v;
    // t.scale.y = result.p;

    return {
      velocity: next.v,
      transform: next.t,
    };
  }

  // Start an animation plan of phases ending in a callback
  animatePlan(
    phases: Array<AnimationPhase>,
    callback: ?(?mixed) => void = null,
  ): void {
    this.stopAnimating();
    this.stopMovingFreely();
    this.stopBeingMoved();
    this.animationPlan = [];
    for (let i = 0, j = phases.length; i < j; i += 1) {
      this.animationPlan.push(phases[i]);
    }
    if (this.animationPlan.length > 0) {
      this.callback = callback;
      this.state.isAnimating = true;
      this.state.animation.currentPhaseIndex = 0;
      this.animatePhase(this.state.animation.currentPhaseIndex);
    }
  }

  // Start the animation of a phase - this should only be called by methods
  // internal to this class.
  animatePhase(index: number): void {
    this.state.animation.currentPhase = this.animationPlan[index];
    this.state.animation.currentPhase.start(this.transform.copy());
  }

  // When animation is stopped, any callback associated with the animation
  // needs to be called, with whatever is passed to stopAnimating.
  stopAnimating(result: ?mixed): void {
    this.animationPlan = [];
    this.state.isAnimating = false;

    if (this.callback) {
      if (result) {
        this.callback(result);
      } else {
        this.callback();
      }
      this.callback = null;
    }
  }

  // **************************************************************
  // **************************************************************
  // Helper functions for quicker animation plans
  animateTo(
    transform: g2.Transform,
    time: number = 1,
    rotDirection: number = 0,
    easeFunction: (number) => number = tools.easeinout,
    callback: ?(?mixed) => void = null,
  ): void {
    const phase = new AnimationPhase(transform, time, rotDirection, easeFunction);
    if (phase instanceof AnimationPhase) {
      this.animatePlan([phase], callback);
    }
  }

  // With update only first instace of translation in the transform order
  animateTranslationTo(
    translation: g2.Point,
    time: number = 1,
    easeFunction: (number) => number = tools.easeinout,
    callback: ?(?mixed) => void = null,
  ): void {
    const transform = this.transform.copy();
    transform.updateTranslation(translation);
    // transform.translation = translation.copy();
    const phase = new AnimationPhase(transform, time, 0, easeFunction);
    if (phase instanceof AnimationPhase) {
      this.animatePlan([phase], callback);
    }
  }

  // With update only first instace of rotation in the transform order
  animateRotationTo(
    rotation: number,
    rotDirection: number,
    time: number = 1,
    easeFunction: (number) => number = tools.easeinout,
    callback: ?(?mixed) => void = null,
  ): void {
    const transform = this.transform.copy();
    transform.updateRotation(rotation);
    const phase = new AnimationPhase(transform, time, rotDirection, easeFunction);
    if (phase instanceof AnimationPhase) {
      this.animatePlan([phase], callback);
    }
  }

  // With update only first instace of rotation in the transform order
  animateTranslationAndRotationTo(
    translation: g2.Point,
    rotation: number,
    rotDirection: number,
    time: number = 1,
    easeFunction: (number) => number = tools.easeinout,
    callback: ?(?mixed) => void = null,
  ): void {
    const transform = this.transform.copy();
    transform.updateRotation(rotation);
    transform.updateTranslation(translation.copy());
    const phase = new AnimationPhase(transform, time, rotDirection, easeFunction);
    if (phase instanceof AnimationPhase) {
      this.animatePlan([phase], callback);
    }
  }
  // **************************************************************
  // **************************************************************


  // Being Moved
  startBeingMoved(): void {
    this.stopAnimating();
    this.stopMovingFreely();
    this.state.movement.velocity = this.transform.zero();
    this.state.movement.previousTransform = this.transform.copy();
    this.state.movement.previousTime = Date.now() / 1000;
    this.state.isBeingMoved = true;
  }

  moved(newTransform: g2.Transform): void {
    this.calcVelocity(newTransform);
    this.transform = newTransform.copy();
  }

  stopBeingMoved(): void {
    this.state.isBeingMoved = false;
    this.state.movement.previousTime = -1;
  }

  calcVelocity(newTransform: g2.Transform): void {
    const currentTime = Date.now() / 1000;
    if (this.state.movement.previousTime < 0) {
      this.state.movement.previousTime = currentTime;
      return;
    }
    const deltaTime = currentTime - this.state.movement.previousTime;

    this.state.movement.velocity = newTransform.velocity(
      this.transform,
      deltaTime,
      this.moveFreelyProperties.zeroVelocityThreshold,
      this.maxVelocity,
    );
    this.state.movement.previousTime = currentTime;
  }

  // Moving Freely
  startMovingFreely(callback: ?(?mixed) => void = null): void {
    this.stopAnimating();
    this.stopBeingMoved();
    this.callback = callback;
    this.state.isMovingFreely = true;
    this.state.movement.previousTime = -1;
    this.state.movement.velocity = this.state.movement.velocity.clip(
      this.moveFreelyProperties.zeroVelocityThreshold,
      this.maxVelocity,
    );
  }

  stopMovingFreely(result: ?mixed): void {
    this.state.isMovingFreely = false;
    this.state.movement.previousTime = -1;
    if (this.callback) {
      if (result) {
        this.callback(result);
      } else {
        this.callback();
      }
      this.callback = null;
    }
  }

  // Take an input transform matrix, and output a list of transform matrices
  // that have been transformed by a pulse. The first matrix in the list
  // will be the largest, so when saving lastDrawTransformMatrix it can be
  // used to determine if a touch has occured in the object.
  //
  // When an object is animated or moved, it's new transform is saved as the
  // new transform of the object. In contrast, pulsing is not saved as the
  // current transform of the object, and is used only in the current draw
  // of the element.
  transformWithPulse(now: number, transformMatrix: Array<number>): Array<Array<number>> {
    const pulseTransformMatrix = [];    // To output list of transform matrices

    // If the diagram element is currently pulsing, the calculate the current
    // pulse magnitude, and transform the input matrix by the pulse
    if (this.state.isPulsing) {
      // If this is the first pulse frame, then set the startTime
      if (this.state.pulse.startTime === -1) {
        this.state.pulse.startTime = now;
      }
      // Calculate how much time has elapsed between this frame and the first
      // pulse frame
      let deltaTime = now - this.state.pulse.startTime;

      // If the elapsed time is larger than the planned pulse time, then
      // clip the elapsed time to the pulse time, and end pulsing (after this
      // draw). If the pulse time is 0, that means pulsing will loop
      // indefinitely.
      if (deltaTime > this.pulse.time && this.pulse.time !== 0) {
        this.state.isPulsing = false;
        deltaTime = this.pulse.time;
      }

      // Go through each pulse matrix planned, and transform the input matrix
      // with the pulse.
      for (let i = 0; i < this.pulse.num; i += 1) {
        // Get the current pulse magnitude
        const pulseMag = this.pulse.style(
          deltaTime,
          this.pulse.frequency,
          this.pulse.A instanceof Array ? this.pulse.A[i] : this.pulse.A,
          this.pulse.B instanceof Array ? this.pulse.B[i] : this.pulse.B,
          this.pulse.C instanceof Array ? this.pulse.C[i] : this.pulse.C,
        );

        // Use the pulse magnitude to get the current pulse transform
        const pTransform = this.pulse.transformMethod(pulseMag);

        // Transform the current transformMatrix by the pulse transform matrix
        const pMatrix = m2.mul(m2.copy(transformMatrix), pTransform.matrix());

        // Push the pulse transformed matrix to the array of pulse matrices
        pulseTransformMatrix.push(pMatrix);
      }
    // If not pulsing, then make no changes to the transformMatrix.
    } else {
      pulseTransformMatrix.push(m2.copy(transformMatrix));
    }
    return pulseTransformMatrix;
  }
  pulseScaleNow(time: number, scale: number) {
    this.pulse.time = time;
    this.pulse.frequency = 1 / (time * 2);
    this.pulse.A = 1;
    this.pulse.B = scale - 1;
    this.pulse.C = 0;
    this.pulse.num = 1;
    this.pulseNow();
  }
  pulseThickNow(time: number, scale: number, num: number) {
    let bArray = [scale];
    this.pulse.num = num;
    if (this.pulse.num > 1) {
      const b = Math.abs(1 - scale);
      const bMax = b;
      const bMin = -b;
      const range = bMax - bMin;
      const bStep = range / (this.pulse.num - 1);
      bArray = [];
      for (let i = 0; i < this.pulse.num; i += 1) {
        bArray.push(bMax - i * bStep);
      }
    }
    this.pulse.time = time;
    this.pulse.frequency = 1 / (time * 2);
    this.pulse.A = 1;
    this.pulse.B = bArray;
    this.pulse.C = 0;
    this.pulseNow();
  }

  pulseNow() {
    this.state.isPulsing = true;
    this.state.pulse.startTime = -1;
  }

  stopPulsing() {
    this.state.isPulsing = false;
  }
}

// ***************************************************************
// Geometry Object
// ***************************************************************
class DiagramElementPrimative extends DiagramElement {
  vertices: VertexObject;
  color: Array<number>;
  pointsToDraw: number;
  angleToDraw: number;

  constructor(
    vertexObject: VertexObject,
    // translation: g2.Point = g2.Point.zero(),
    // rotation: number = 0,
    // scale: g2.Point = new g2.Point.Unity(),
    transform: g2.Transform = new g2.Transform(),
    color: Array<number> = [0.5, 0.5, 0.5, 1],
    name: string = '',
  ) {
    super(transform, name);
    this.vertices = vertexObject;
    this.color = color;
    this.pointsToDraw = -1;
    this.angleToDraw = -1;
  }

  isBeingTouched(clipLocation: g2.Point): boolean {
    if (!this.isTouchable) {
      return false;
    }
    for (let m = 0, n = this.vertices.border.length; m < n; m += 1) {
      const border = [];
      for (let i = 0, j = this.vertices.border[m].length; i < j; i += 1) {
        border.push(this.vertexToClip(this.vertices.border[m][i]));
      }
      if (clipLocation.isInPolygon(border)) {
        return true;
      }
    }
    return false;
  }

  getTouched(clipLocation: g2.Point): Array<DiagramElementPrimative> {
    if (!this.isTouchable) {
      return [];
    }

    if (this.isBeingTouched(clipLocation)) {
      return [this];
    }
    return [];
  }

  draw(transformMatrix: Array<number> = m2.identity(), now: number = 0) {
    if (this.show) {
      this.setNextTransform(now);
      let matrix = m2.mul(transformMatrix, this.transform.matrix());
      matrix = this.transformWithPulse(now, matrix);

      // eslint-disable-next-line prefer-destructuring
      this.lastDrawTransformMatrix = matrix[0];

      let pointCount = this.vertices.numPoints;
      if (this.angleToDraw !== -1) {
        pointCount = this.vertices.getPointCountForAngle(this.angleToDraw);
      }
      if (this.pointsToDraw !== -1) {
        pointCount = this.pointsToDraw;
      }
      for (let i = 0; i < matrix.length; i += 1) {
        this.vertices.drawWithTransformMatrix(matrix[i], pointCount, this.color);
      }
    }
  }

  isMoving(): boolean {
    if (this.state.isAnimating || this.state.isMovingFreely || this.state.isBeingMoved) {
      return true;
    }
    return false;
  }
}

// ***************************************************************
// Collection of Geometry Objects or Collections
// ***************************************************************
class DiagramElementCollection extends DiagramElement {
  elements: Object;
  order: Array<string>;
  // biasTransform: Array<number>;

  constructor(
    transform: g2.Transform = new g2.Transform(),
    name: string = '',
  ): void {
    super(transform, name);
    this.elements = {};
    this.order = [];
  }

  isMoving(): boolean {
    if (this.state.isAnimating || this.state.isMovingFreely || this.state.isBeingMoved) {
      return true;
    }
    for (let i = 0; i < this.order.length; i += 1) {
      const element = this.elements[this.order[i]];
      if (element instanceof DiagramElementCollection) {
        if (element.isMoving()) {
          return true;
        }
      } else if (element.isMoving) {
        return true;
      }
    }
    return false;
  }

  add(name: string, geoObject: DiagramElementPrimative) {
    this.elements[name] = geoObject;
    this.elements[name].name = name;
    // $FlowFixMe
    this[`_${name}`] = this.elements[name];
    this.order.push(name);
  }
  draw(transformMatrix: Array<number> = m2.identity(), now: number = 0) {
    if (this.show) {
      this.setNextTransform(now);
      let matrix = m2.mul(transformMatrix, this.transform.matrix());
      matrix = this.transformWithPulse(now, matrix);

      // eslint-disable-next-line prefer-destructuring
      this.lastDrawTransformMatrix = matrix[0];

      for (let k = 0; k < matrix.length; k += 1) {
        for (let i = 0, j = this.order.length; i < j; i += 1) {
          this.elements[this.order[i]].draw(matrix[k], now);
        }
      }
    }
  }
  showAll(): void {
    this.show = true;
    for (let i = 0, j = this.order.length; i < j; i += 1) {
      const element = this.elements[this.order[i]];
      element.show = true;
      if (typeof element.hideAll === 'function') {
        element.showAll();
      }
    }
  }
  hideAll(): void {
    this.show = false;
    for (let i = 0, j = this.order.length; i < j; i += 1) {
      const element = this.elements[this.order[i]];
      element.show = false;
      // console.log(element.name)
      if (typeof element.hideAll === 'function') {
        element.hideAll();
      }
    }
  }

  showOnly(listToShow: Array<DiagramElementPrimative | DiagramElementCollection>): void {
    this.hideAll();
    this.show = true;
    for (let i = 0, j = listToShow.length; i < j; i += 1) {
      const element = listToShow[i];
      element.show = true;
    }
  }

  hideOnly(listToHide: Array<DiagramElementPrimative | DiagramElementCollection>): void {
    this.showAll();
    for (let i = 0, j = listToHide.length; i < j; i += 1) {
      const element = listToHide[i];
      element.show = false;
    }
  }

  // updateBias(scale: g2.Point, offset: g2.Point): void {
  //   this.biasTransform = (new g2.Transform(offset, 0, scale)).matrix();
  // }
  // This will only search elements within the collection for a touch
  // if the collection is touchable. Note, the elements can be queried
  // directly still, and will return if they are touched if they themselves
  // are touchable.
  isBeingTouched(clipLocation: g2.Point) {
    if (!this.isTouchable) {
      return false;
    }
    for (let i = 0, j = this.order.length; i < j; i += 1) {
      const element = this.elements[this.order[i]];
      if (element.show === true) {
        if (element.isBeingTouched(clipLocation)) {
          return true;
        }
      }
    }
    return false;
  }

  getTouched(clipLocation: g2.Point): Array<DiagramElementPrimative | DiagramElementCollection> {
    if (!this.isTouchable) {
      return [];
    }
    let touched = [];
    for (let i = 0; i < this.order.length; i += 1) {
      const element = this.elements[this.order[i]];
      if (element.show === true) {
        touched = touched.concat(element.getTouched(clipLocation));
      }
    }
    // If there is an element that is touched, then this collection should
    // also be touched.
    if (touched.length > 0) {
      touched = [this].concat(touched);
    }
    return touched;
  }
}
export { DiagramElementPrimative, DiagramElementCollection, AnimationPhase };
