// @flow

import * as g2 from './g2';
import * as m2 from './m2';
import * as tools from './mathtools';
// import GlobalVariables from './globals';
import VertexObject from './vertexObjects/vertexObject';
import TextObject from './TextObject';
import DrawingObject from './DrawingObject';

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
    transform: g2.Transform = new g2.Transform()
      .scale(1, 1)
      .rotate(0)
      .translate(0, 0),
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

  move: {
    maxTransform: g2.Transform,
    minTransform: g2.Transform,
    maxVelocity: g2.TransformLimit;            // Maximum velocity allowed
    // When moving freely, the velocity decelerates until it reaches a threshold,
  // then it is considered 0 - at which point moving freely ends.
    freely: {                 // Moving Freely properties
      zeroVelocityThreshold: g2.TransformLimit,  // Velocity considered 0
      deceleration: g2.TransformLimit,           // Deceleration
    }
  };

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

  diagramLimits: g2.Rect;

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
    transform: g2.Transform = new g2.Transform()
      .scale(1, 1)
      .rotate(0)
      .translate(0, 0),
    diagramLimits: g2.Rect = new g2.Rect(-1, -1, 2, 2),
  ) {
    this.transform = transform.copy();
    this.setTransformCallback = () => {};
    this.show = true;
    this.lastDrawTransformMatrix = this.transform.matrix();
    this.name = ''; // This is updated when an element is added to a collection
    this.isMovable = false;
    this.isTouchable = false;

    this.callback = null;
    this.animationPlan = [];
    this.diagramLimits = diagramLimits;
    //   min: new g2.Point(-1, -1),
    //   max: new g2.Point(1, 1),
    // }

    this.move = {
      maxTransform: this.transform.constant(1000),
      minTransform: this.transform.constant(-1000),
      maxVelocity: new g2.TransformLimit(5, 5, 5),
      freely: {
        zeroVelocityThreshold: new g2.TransformLimit(0.001, 0.001, 0.001),
        deceleration: new g2.TransformLimit(5, 5, 5),
      },
    };
    // this.move.freely = {
    //   zeroVelocityThreshold: new g2.TransformLimit(0.001, 0.001, 0.001),
    //   deceleration: new g2.TransformLimit(1, 1, 1),
    // };

    this.pulse = {
      time: 1,
      frequency: 0.5,
      A: 1,
      B: 0.5,
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

  // A diagram element primative vertex object lives in GL SPACE.
  //
  // A diagram element has its own DIAGRAM ELEMENT SPACE, which is
  // the GL space transformed by `this.transform`.
  //
  // A diagram element is drawn in the DIAGRAM SPACE, by transforming
  // the DIAGRAM ELEMENT SPACE by an incoming transformation matrix in the draw
  // method. This incoming transformation matrix originates in the diagram
  // and waterfalls through each parent diagram collection element to the
  // current diagram element.
  //
  // this.lastDrawTransformationMatrix captures how a vertex was drawn in
  // the last frame, in DIAGRAM space as:
  //   vertex
  //     transformed by: DIAGRAM ELEMENT SPACE
  //     transfromed by: DIAGRAM SPACE transform
  //
  // By default, webgl clip space is a unit space from (-1, 1) to (1, 1)
  // independent of the aspect ratio of the canvas it is drawn on.
  //
  // A diagram object can have its own clip space with arbitrary limits. e.g.:
  //    * (-1, -1) to (1, 1)    similar to gl clip space
  //    * (0, 0) to (2, 2)      similar to gl clip space but offset
  //    * (0, 0) to (4, 2)      for rectangular aspect ratio diagram
  //
  // The diagram object clip space definition is stored in this.diagramLimits.
  //
  // To therefore transform a vertex (from GL SPACE) to DIAGRAM CLIP SPACE:
  //   * Take the vertex
  //   * Transform it to DIAGRAM SPACE (by transforming it with the
  //     lastDrawTransformMatrix)
  //   * Transform it to DIAGRAM CLIP SPACE by scaling and offsetting it
  //     to the clip space.
  //
  // Each diagram element holds a DIAGRAM ELMENT CLIP space
  vertexToClip(vertex: g2.Point) {
    const scaleX = this.diagramLimits.width / 2;
    const scaleY = this.diagramLimits.height / 2;
    const biasX = -(-this.diagramLimits.width / 2 - this.diagramLimits.left);
    const biasY = -(this.diagramLimits.height / 2 - this.diagramLimits.top);
    const transform = new g2.Transform().scale(scaleX, scaleY).translate(biasX, biasY);
    return vertex.transformBy(this.lastDrawTransformMatrix)
      .transformBy(transform.matrix());
  }
  textVertexToClip(vertex: g2.Point) {
    const scaleX = this.diagramLimits.width / 2;
    const scaleY = this.diagramLimits.height / 2;
    const biasX = -(-this.diagramLimits.width / 2 - this.diagramLimits.left);
    const biasY = -(this.diagramLimits.height / 2 - this.diagramLimits.top);
    const transform = new g2.Transform().scale(scaleX, scaleY).translate(biasX, biasY);
    return vertex.transformBy(transform.matrix());
  }

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
    return next;
  }

  // Use this method to set the element's transform in case a callback has been
  // connected that is tied to an update of the transform.
  setTransform(transform: g2.Transform): void {
    this.transform = transform.copy().clip(
      this.move.minTransform,
      this.move.maxTransform,
    );
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
  // deceleration (in freelyProperties) and zeroVelocityThreshold.
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

  // Decelerate over some time when moving freely to get a new element
  // transform and movement velocity
  decelerate(deltaTime: number): Object {
    const next = this.transform.decelerate(
      this.state.movement.velocity,
      this.move.freely.deceleration,
      deltaTime,
      this.move.freely.zeroVelocityThreshold,
    );

    for (let i = 0; i < next.t.order.length; i += 1) {
      const t = next.t.order[i];
      const min = this.move.minTransform.order[i];
      const max = this.move.maxTransform.order[i];
      const v = next.v.order[i];
      if (t instanceof g2.Translation &&
          v instanceof g2.Translation &&
          max instanceof g2.Translation &&
          min instanceof g2.Translation
      ) {
        if (min.x >= t.x || max.x <= t.x) {
          v.x = -v.x * 0.5;
        }
        if (min.y >= t.y || max.y <= t.y) {
          v.y = -v.y * 0.5;
        }
        next.v.order[i] = v;
      }
    }
    next.v.calcMatrix();

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
    this.setTransform(newTransform.copy());
  }

  stopBeingMoved(): void {
    const currentTime = Date.now() / 1000;
    // Check wether last movement was a long time ago, if it was, then make
    // velocity 0 as the user has stopped moving before releasing touch/click
    if (this.state.movement.previousTime !== -1) {
      if ((currentTime - this.state.movement.previousTime) > 0.05) {
        this.state.movement.velocity = this.transform.zero();
      }
    }
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

    // If the time is too small, weird calculations may happen
    if (deltaTime < 0.0001) {
      return;
    }
    this.state.movement.velocity = newTransform.velocity(
      this.transform,
      deltaTime,
      this.move.freely.zeroVelocityThreshold,
      this.move.maxVelocity,
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
    this.state.movement.velocity = this.state.movement.velocity.clipMag(
      this.move.freely.zeroVelocityThreshold,
      this.move.maxVelocity,
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

  stop() {
    this.stopAnimating();
    this.stopMovingFreely();
    this.stopBeingMoved();
    this.stopPulsing();
  }

  getRelativeBoundingBox() {
    return {
      min: new g2.Point(
        this.diagramLimits.left,
        this.diagramLimits.top,
      ),
      max: new g2.Point(
        this.diagramLimits.left + this.diagramLimits.width,
        this.diagramLimits.top - this.diagramLimits.height,
      ),
    };
  }
  updateMoveTranslationBoundary(
    bounday: Array<number> = [
      this.diagramLimits.left,
      this.diagramLimits.top - this.diagramLimits.height,
      this.diagramLimits.left + this.diagramLimits.width,
      this.diagramLimits.top],
    scale: g2.Point = new g2.Point(1, 1),
  ): void {
    const { min, max } = this.getRelativeBoundingBox();

    max.x = bounday[2] - max.x * scale.x;
    max.y = bounday[3] - max.y * scale.y;
    min.x = bounday[0] - min.x * scale.x;
    min.y = bounday[1] - min.y * scale.y;

    this.move.maxTransform.updateTranslation(
      max.x,
      max.y,
    );
    this.move.minTransform.updateTranslation(
      min.x,
      min.y,
    );
  }
}

// ***************************************************************
// Geometry Object
// ***************************************************************
class DiagramElementPrimative extends DiagramElement {
  vertices: DrawingObject;
  color: Array<number>;
  pointsToDraw: number;
  angleToDraw: number;

  constructor(
    drawingObject: DrawingObject,
    transform: g2.Transform = new g2.Transform()
      .scale(1, 1)
      .rotate(0)
      .translate(0, 0),
    color: Array<number> = [0.5, 0.5, 0.5, 1],
    diagramLimits: g2.Rect = new g2.Rect(-1, -1, 2, 2),
  ) {
    super(transform, diagramLimits);
    this.vertices = drawingObject;
    this.color = color;
    this.pointsToDraw = -1;
    this.angleToDraw = -1;
    this.updateMoveTranslationBoundary();
  }

  isBeingTouched(clipLocation: g2.Point): boolean {
    if (!this.isTouchable) {
      return false;
    }
    for (let m = 0, n = this.vertices.border.length; m < n; m += 1) {
      const border = [];
      if (this.vertices instanceof TextObject) {
        const text = this.vertices;
        const { ctx, ratio } = text.drawContext2D;
        const location = text.lastDrawPoint;
        const size = text.pixelSize;
        border.push(location.add(new g2.Point(-size.left, -size.top)));
        border.push(location.add(new g2.Point(size.right, -size.top)));
        border.push(location.add(new g2.Point(size.right, size.bottom)));
        border.push(location.add(new g2.Point(-size.left, size.bottom)));
        border.push(location.add(new g2.Point(-size.left, -size.top)));
        const xPixel = (clipLocation.x - this.diagramLimits.left) /
          this.diagramLimits.width * ctx.canvas.width / ratio;
        const yPixel = (this.diagramLimits.top - clipLocation.y) /
          this.diagramLimits.height * ctx.canvas.height / ratio;
        if (new g2.Point(xPixel, yPixel).isInPolygon(border)) {
          return true;
        }
      } else {
        for (let i = 0, j = this.vertices.border[m].length; i < j; i += 1) {
          border.push(this.vertexToClip(this.vertices.border[m][i]));
        }
        if (clipLocation.isInPolygon(border)) {
          return true;
        }
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
    if (this.state.isAnimating
      || this.state.isMovingFreely
      || this.state.isBeingMoved
      || this.state.isPulsing) {
      return true;
    }
    return false;
  }

  getBoundingBox(): {min: g2.Point, max: g2.Point} {
    const { min, max } = this.getVerticesBoundingBox(this.transform.matrix());
    return { min, max };
  }

  getRelativeBoundingBox(): {min: g2.Point, max: g2.Point} {
    const newTransform = this.transform.copy();
    newTransform.updateTranslation(0, 0);
    const { min, max } = this.getVerticesBoundingBox(newTransform.matrix());
    return { min, max };
  }


  getVerticesBoundingBox(transformMatrix: Array<number> = m2.identity()): {
    min: g2.Point, max: g2.Point
  } {
    const min = new g2.Point(0, 0);
    const max = new g2.Point(0, 0);
    let firstTime = true;

    for (let m = 0, n = this.vertices.border.length; m < n; m += 1) {
      // first generate the border
      const border = [];
      if (this.vertices instanceof TextObject) {
        const text = this.vertices;
        const { ctx, ratio } = text.drawContext2D;
        const size = text.pixelSize;
        const pixelToClip = (pixel: g2.Point): g2.Point => {
          const x = pixel.x / ctx.canvas.width * ratio *
            this.diagramLimits.width;
          const y = -(pixel.y / ctx.canvas.height * ratio *
            this.diagramLimits.height);
          return new g2.Point(x, y);
        };
        const textClipToDiagramClip = (clip: g2.Point): g2.Point => {
          const x = clip.x * this.diagramLimits.width / 2;
          const y = clip.y * this.diagramLimits.height / 2;
          return new g2.Point(x, y);
        };
        let location = text.location.transformBy(transformMatrix);
        location = location.add(textClipToDiagramClip(text.offset));
        border.push(pixelToClip(new g2.Point(-size.left, -size.top))
          .add(location));
        border.push(pixelToClip(new g2.Point(size.right, -size.top))
          .add(location));
        border.push(pixelToClip(new g2.Point(size.right, size.bottom))
          .add(location));
        border.push(pixelToClip(new g2.Point(-size.left, size.bottom))
          .add(location));
        border.push(pixelToClip(new g2.Point(-size.left, -size.top))
          .add(location));
      } else {
        for (let i = 0, j = this.vertices.border[m].length; i < j; i += 1) {
          border.push(this.vertices.border[m][i].transformBy(transformMatrix));
        }
      }
      // Go through the border and find the max/min rectangle bounding box
      for (let i = 0, j = border.length; i < j; i += 1) {
        const vertex = border[i];
        if (firstTime) {
          min.x = vertex.x;
          min.y = vertex.y;
          max.x = vertex.x;
          max.y = vertex.y;
          firstTime = false;
        } else {
          min.x = vertex.x < min.x ? vertex.x : min.x;
          min.y = vertex.y < min.y ? vertex.y : min.y;
          max.x = vertex.x > max.x ? vertex.x : max.x;
          max.y = vertex.y > max.y ? vertex.y : max.y;
        }
      }
    }
    return { min, max };
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
    transform: g2.Transform = new g2.Transform()
      .scale(1, 1)
      .rotate(0)
      .translate(0, 0),
    diagramLimits: g2.Rect = new g2.Rect(-1, 1, 2, 2),
  ): void {
    super(transform, diagramLimits);
    this.elements = {};
    this.order = [];
  }

  isMoving(): boolean {
    if (this.state.isAnimating ||
        this.state.isMovingFreely ||
        this.state.isBeingMoved ||
        this.state.isPulsing) {
      return true;
    }
    for (let i = 0; i < this.order.length; i += 1) {
      const element = this.elements[this.order[i]];
      if (element instanceof DiagramElementCollection) {
        if (element.isMoving()) {
          return true;
        }
      } else if (element.isMoving()) {
        return true;
      }
    }
    return false;
  }

  add(name: string, diagramElement: DiagramElementPrimative | DiagramElementCollection) {
    this.elements[name] = diagramElement;
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

  getRelativeBoundingBox() {
    let min = new g2.Point(0, 0);
    let max = new g2.Point(0, 0);
    let firstTime = true;
    for (let i = 0, j = this.order.length; i < j; i += 1) {
      const element = this.elements[this.order[i]];
      const result = element.getBoundingBox();
      const mn = result.min;
      const mx = result.max;
      if (firstTime) {
        min = mn.copy();
        max = mx.copy();
        firstTime = false;
      } else {
        min.x = mn.x < min.x ? mn.x : min.x;
        min.y = mn.y < min.y ? mn.y : min.y;
        max.x = mx.x > max.x ? mx.x : max.x;
        max.y = mx.y > max.y ? mx.y : max.y;
      }
    }
    const t = this.transform.copy();
    t.updateTranslation(0, 0);
    max = max.transformBy(t.matrix());
    min = min.transformBy(t.matrix());
    return { min, max };
  }

  getBoundingBox() {
    let min = new g2.Point(0, 0);
    let max = new g2.Point(0, 0);
    let firstTime = true;
    for (let i = 0, j = this.order.length; i < j; i += 1) {
      const element = this.elements[this.order[i]];
      const result = element.getBoundingBox();
      const mn = result.min;
      const mx = result.max;
      if (firstTime) {
        min = mn.copy();
        max = mx.copy();
        firstTime = false;
      } else {
        min.x = mn.x < min.x ? mn.x : min.x;
        min.y = mn.y < min.y ? mn.y : min.y;
        max.x = mx.x > max.x ? mx.x : max.x;
        max.y = mx.y > max.y ? mx.y : max.y;
      }
    }

    max = max.transformBy(this.transform.matrix());
    min = min.transformBy(this.transform.matrix());
    return { min, max };
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

  stop() {
    super.stop();
    for (let i = 0; i < this.order.length; i += 1) {
      const element = this.elements[this.order[i]];
      element.stop();
    }
  }
}

export { DiagramElementPrimative, DiagramElementCollection, AnimationPhase };
