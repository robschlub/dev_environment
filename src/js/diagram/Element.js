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
    transform: g2.Transform = g2.Transform.Unity(),
    time: number = 1,
    rotDirection: number = 0,
    animationStyle: (number) => number = tools.easeinout,
  ) {
    this.targetTransform = transform.copy();
    this.time = time;
    this.rotDirection = rotDirection;
    this.animationStyle = animationStyle;

    this.startTime = -1;
    this.startTransform = g2.Transform.Zero();
    this.deltaTransform = g2.Transform.Zero();
  }

  start(currentTransform: g2.Transform) {
    this.startTransform = currentTransform.copy();
    this.deltaTransform = this.targetTransform.sub(this.startTransform);
    let rotDiff = this.deltaTransform.rotation;
    if (rotDiff * this.rotDirection < 0) {
      rotDiff = this.rotDirection * Math.PI * 2.0 + rotDiff;
    }
    this.deltaTransform.rotation = rotDiff;
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
//
// This class manages:
//  - The diagram element
//  - Its current transformation
//  - Its animation plan, animation control and animation state
//  - Its movement state
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
    translation: g2.Point = g2.Point.zero(),
    rotation: number = 0,
    scale: g2.Point = g2.Point.Unity(),
    name: string = '',
  ) {
    this.transform = new g2.Transform(translation, rotation, scale);
    this.setTransformCallback = () => {};
    this.show = true;
    this.lastDrawTransformMatrix = m2.identity();
    this.name = name;

    this.isMovable = false;
    this.isTouchable = false;

    this.callback = null;
    this.animationPlan = [];
    this.maxVelocity = new g2.Transform(
      g2.point(1000, 1000),
      1000,
      g2.point(1000, 1000),
    );
    this.moveFreelyProperties = {
      zeroVelocityThreshold: new g2.Transform(
        g2.point(0.0001, 0.0001),
        0.0001,
        g2.point(0.0001, 0.0001),
      ),
      deceleration: new g2.Transform(g2.point(1, 1), 1, g2.point(1, 1)),
    };

    this.pulse = {
      time: 1,
      frequency: 0.5,
      A: 1,
      B: 0,
      C: 0,
      style: tools.sinusoid,
      num: 1,
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
        previousTransform: new g2.Transform(),
        velocity: new g2.Transform.Zero(),
      },

      isPulsing: false,
      pulse: {
        startTime: -1,
      },
    };


    this.presetTransforms = {};

    // this.pulse = {
    //   pulsing: false,
    //   time: 1,
    //   frequency: 0.5,
    //   startTime: -1,
    //   A: 1,       // Magnitude base (bias) for sinusoid
    //   B: 0,       // Magnitude delta (mag) for sinusoid
    //   C: 0,       // Time/Phase offset for sinusoid
    //   pulsePattern: tools.sinusoid,
    // };
  }

  vertexToClip(vertex: g2.Point) {
    return vertex.transformBy(this.lastDrawTransformMatrix);
  }

  // Remove?
  vertexToScreen(vertex: g2.Point, canvas: HTMLCanvasElement): g2.Point {
    const canvasRect = canvas.getBoundingClientRect();
    const canvasWidth = canvas.scrollWidth;
    const canvasHeight = canvas.scrollHeight;
    const transformedVertex = vertex.transformBy(this.lastDrawTransformMatrix);
    // const transformedVertex = m2.pointTransform(this.lastDraw, vertex);
    return g2.point(
      (transformedVertex.x + 1.0) * canvasWidth / 2.0 + canvasRect.left,
      (-transformedVertex.y + 1.0) * canvasHeight / 2.0 + canvasRect.top,
    );
  }
  static isBeingTouched(): boolean {
    return false;
  }

  // Calculate the next transform due to a progressing animation
  calcNextAnimationTransform(elapsedTime: number): g2.Transform {
    const next = new g2.Transform();
    const phase = this.state.animation.currentPhase;
    const start = phase.startTransform;
    const delta = phase.deltaTransform;
    const percentTime = elapsedTime / phase.time;
    const percentComplete = phase.animationStyle(percentTime);
    next.translation.x = start.translation.x + percentComplete * delta.translation.x;
    next.translation.y = start.translation.y + percentComplete * delta.translation.y;
    next.scale.x = start.scale.x + percentComplete * delta.scale.x;
    next.scale.y = start.scale.y + percentComplete * delta.scale.y;

    next.rotation = start.rotation + percentComplete * delta.rotation;
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
      if (DiagramElement.isVelocityZero(this.state.movement.velocity)) {
        this.state.movement.velocity = g2.Transform.Zero();
        this.stopMovingFreely();
      }
      this.setTransform(next.transform);
    }
  }

  static isVelocityZero(transform: g2.Transform): boolean {
    if (transform.rotation !== 0) {
      return false;
    }
    if (transform.translation.x !== 0) {
      return false;
    }
    if (transform.translation.y !== 0) {
      return false;
    }
    if (transform.scale.x !== 0) {
      return false;
    }
    if (transform.scale.y !== 0) {
      return false;
    }
    return true;
  }

  // Decelerate over some time when moving freely to get a new element
  // transform and movement velocity
  decelerate(deltaTime: number): Object {
    const velocity = this.state.movement.velocity.copy();
    let result;
    const v = new g2.Transform.Zero();
    const t = new g2.Transform.Zero();
    result = tools.decelerate(
      this.transform.rotation,
      velocity.rotation,
      this.moveFreelyProperties.deceleration.rotation,
      deltaTime,
      this.moveFreelyProperties.zeroVelocityThreshold.rotation,
    );
    v.rotation = result.v;
    t.rotation = result.p;

    result = tools.decelerate(
      this.transform.translation.x,
      velocity.translation.x,
      this.moveFreelyProperties.deceleration.translation.x,
      deltaTime,
      this.moveFreelyProperties.zeroVelocityThreshold.translation.x,
    );
    v.translation.x = result.v;
    t.translation.x = result.p;

    result = tools.decelerate(
      this.transform.translation.y,
      velocity.translation.y,
      this.moveFreelyProperties.deceleration.translation.y,
      deltaTime,
      this.moveFreelyProperties.zeroVelocityThreshold.translation.y,
    );
    v.translation.y = result.v;
    t.translation.y = result.p;

    result = tools.decelerate(
      this.transform.scale.x,
      velocity.scale.x,
      this.moveFreelyProperties.deceleration.scale.x,
      deltaTime,
      this.moveFreelyProperties.zeroVelocityThreshold.scale.x,
    );
    v.scale.x = result.v;
    t.scale.x = result.p;

    result = tools.decelerate(
      this.transform.scale.y,
      velocity.scale.y,
      this.moveFreelyProperties.deceleration.scale.y,
      deltaTime,
      this.moveFreelyProperties.zeroVelocityThreshold.scale.y,
    );
    v.scale.y = result.v;
    t.scale.y = result.p;

    return {
      velocity: v,
      transform: t,
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

  animateTranslationTo(
    translation: g2.Point,
    time: number = 1,
    easeFunction: (number) => number = tools.easeinout,
    callback: ?(?mixed) => void = null,
  ): void {
    const transform = this.transform.copy();
    transform.translation = translation.copy();
    const phase = new AnimationPhase(transform, time, 0, easeFunction);
    if (phase instanceof AnimationPhase) {
      this.animatePlan([phase], callback);
    }
  }
  animateRotationTo(
    rotation: number,
    rotDirection: number,
    time: number = 1,
    easeFunction: (number) => number = tools.easeinout,
    callback: ?(?mixed) => void = null,
  ): void {
    const transform = this.transform.copy();
    transform.rotation = rotation;
    const phase = new AnimationPhase(transform, time, rotDirection, easeFunction);
    if (phase instanceof AnimationPhase) {
      this.animatePlan([phase], callback);
    }
  }

  animateTranslationAndRotationTo(
    translation,
    rotation,
    rotDirection,
    time = 1,
    easeFunction = tools.easeinout,
    callback: ?(?mixed) => void = null,
  ): void {
    const transform = this.transform.copy();
    transform.rotation = rotation;
    transform.translation = translation.copy();
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
    this.state.movement.velocity = g2.Transform.Zero();
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
    // console.log("time: " + deltaTime)

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

  // There are several ways to pulse an object:
  //    * pulse scale
  //    * pulse 3 copy - 1 scale up, 1 stay same, 1 scale down
  transformWithPulse(now: number, transformMatrix: Array<number>): Array<Array<number>> {
    const pulseTransformMatrix = [];
    if (this.state.isPulsing) {
      if (this.state.pulse.startTime === -1) {
        this.state.pulse.startTime = now;
      }
      const deltaTime = now - this.state.pulse.startTime;
      for (let i = 0; i < this.pulse.num; i += 1) {
        let pMatrix = m2.copy(transformMatrix);
        const b = this.pulse.B instanceof Array ? this.pulse.B[i] : this.pulse.B;
        const scale = this.pulse.style(
          deltaTime,
          this.pulse.frequency,
          this.pulse.A,
          b,
          this.pulse.C,
        );
        console.log(i, scale)
        const pulseTransform = DiagramElement.getPulseTransform(scale);
        pMatrix = m2.translate(
          pMatrix,
          pulseTransform.translation.x,
          pulseTransform.translation.y,
        );
        pMatrix = m2.rotate(
          pMatrix,
          pulseTransform.rotation,
        );
        pMatrix = m2.scale(
          pMatrix,
          pulseTransform.scale.x,
          pulseTransform.scale.y,
        );
        pulseTransformMatrix.push(pMatrix);
      }
      if (deltaTime > this.pulse.time && this.pulse.time !== 0) {
        this.state.isPulsing = false;
      }
    } else {
      pulseTransformMatrix.push(m2.copy(transformMatrix));
    }

    // this.lastDrawTransformMatrix = m2.copy(pulseTransformMatrix);
    return pulseTransformMatrix;
  }
  pulseScaleNow(time: number, scale: number) {
    this.pulse.time = time;
    this.pulse.frequency = 1 / (time * 2);
    this.pulse.A = 1;
    this.pulse.B = scale - 1;
    this.pulse.C = 0;
    this.pulse.num = 1;
    this.state.isPulsing = true;
    this.state.pulse.startTime = -1;
  }
  pulseMultiNow(time: number, scale: number, num: number) {
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
    this.state.isPulsing = true;
    this.state.pulse.startTime = -1;
  }

  pulseNow() {
    this.state.isPulsing = true;
    this.state.pulse.startTime = -1;
  }
  static getPulseTransform(scale) {
    return new g2.Transform(g2.point(0, 0), 0, g2.point(scale, scale));
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
    translation: g2.Point = g2.Point.zero(),
    rotation: number = 0,
    scale: g2.Point = new g2.Point.Unity(),
    color: Array<number> = [0.5, 0.5, 0.5, 1],
  ) {
    super(translation, rotation, scale);
    this.vertices = vertexObject;
    this.color = color;
    this.pointsToDraw = -1;
    this.angleToDraw = -1;
  }

  isBeingTouched(clipLocation: g2.Point): boolean {
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

  // isBeingTouched(location: g2.Point, canvas: HTMLCanvasElement): boolean {
  //   for (let m = 0, n = this.vertices.border.length; m < n; m += 1) {
  //     const border = [];
  //     for (let i = 0, j = this.vertices.border[m].length; i < j; i += 1) {
  //       border[i] = this.vertexToScreen(this.vertices.border[m][i], canvas);
  //     }
  //     if (location.isInPolygon(border)) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  draw(transformMatrix: Array<number> = m2.identity(), now: number = 0) {
    if (this.show) {
      this.setNextTransform(now);
      let matrix = m2.mul(transformMatrix, this.transform.matrix());
      matrix = this.transformWithPulse(now, matrix);
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
    translation: g2.Point = g2.Point.zero(),
    rotation: number = 0,
    scale: g2.Point = g2.Point.Unity(),
  ): void {
    super(translation, rotation, scale);
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
      this.lastDrawTransformMatrix = matrix[0];

      for (let k = 0; k < matrix.length; k += 1) {
        for (let i = 0, j = this.order.length; i < j; i += 1) {
          this.elements[this.order[i]].draw(matrix[k], now);
        }
      }
    }
  }
  showAll(): void {
    for (let i = 0, j = this.order.length; i < j; i += 1) {
      const element = this.elements[this.order[i]];
      element.show = true;
      if (typeof element.hideAll === 'function') {
        element.showAll();
      }
    }
  }
  hideAll(): void {
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

  isBeingTouched(location: g2.Point, canvas: HTMLCanvasElement) {
    for (let i = 0, j = this.order.length; i < j; i += 1) {
      const element = this.elements[this.order[i]];
      if (element.show === true) {
        if (element.isBeingTouched(location, canvas)) {
          return true;
        }
      }
    }
    return false;
  }
}
export { DiagramElementPrimative, DiagramElementCollection, AnimationPhase };
