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
  setTransformCallback: (g2.Transform) => void; // Called when setting Transform
  // globals: GlobalVariables;       // Link to global variables
  lastDrawTransformMatrix: Array<number>; // Transform matrix used in last draw
  show: boolean;                  // True if should be shown in diagram
  name: string;                   // Used to reference element in a collection


  // Animation and movement
  isMovable: boolean;             // Element is able to be moved
  isTouchable: boolean;           // Element can be touched

  // Animation
  animationPlan: {
    phases: Array<AnimationPhase>,
    callback: (mixed) => void
  };

  // Moving Freely
  moveFreelyProperties: {
    maxVelocity: g2.Transform,
    zeroVelocityThreshold: g2.Transform,
    deceleration: g2.Transform,
  }

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
      velocity: g2.Transform,
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
    // this.globals = new GlobalVariables();
    this.lastDrawTransformMatrix = m2.identity();
    this.name = name;

    this.isMovable = false;
    this.isTouchable = false;

    this.animationPlan = {
      phases: [],
      callback: () => {},
    };
    this.moveFreelyProperties = {
      maxVelocity: new g2.Transform(
        g2.point(1000, 1000),
        1000,
        g2.point(1000, 1000),
      ),
      zeroVelocityThreshold: new g2.Transform(
        g2.point(0.0001, 0.0001),
        0.0001,
        g2.point(0.0001, 0.0001),
      ),
      deceleration: new g2.Transform(g2.point(1, 1), 1, g2.point(1, 1)),
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
    };

    this.presetTransforms = {};

    this.pulse = {
      pulsing: false,
      time: 1,
      frequency: 0.5,
      startTime: -1,
      A: 1,       // Magnitude base (bias) for sinusoid
      B: 0,       // Magnitude delta (mag) for sinusoid
      C: 0,       // Time/Phase offset for sinusoid
      pulsePattern: tools.sinusoid,
    };
    // this.state.movement = {
    //   previousTime: -1,
    //   // stopTime: 1,
    //   // time: 0,
    //   deceleration: new g2.Transform(g2.point(1, 1), 1, g2.point(1, 1)),
    //   previous: new g2.Transform(),
    //   velocity: new g2.Transform.Zero(),
    //   maxVelocity: new g2.Transform(
    //     g2.point(1000, 1000),
    //     1000,
    //     g2.point(1000, 1000),
    //   ),
    //   stopMovingVelocity: new g2.Transform(
    //     g2.point(0.0001, 0.0001),
    //     0.0001,
    //     g2.point(0.0001, 0.0001),
    //   ),
    // };
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

  // Calculate the next transform due to a progessing free movement
  calcNextMovementTransform(deltaTime, velocity): g2.Transform {
    const nextTransform = this.transform.copy();
    nextTransform.rotation += deltaTime * velocity.rotation;
    nextTransform.translation.x += deltaTime * velocity.translation.x;
    nextTransform.translation.y += deltaTime * velocity.translation.y;
    nextTransform.scale.x += deltaTime * velocity.scale.x;
    nextTransform.scale.y += deltaTime * velocity.scale.y;
    return nextTransform;
  }

  // Set the transform
  setNextTransform(now: number): void {
    if (this.state.isAnimating || this.state.isMovingFreely) {
      const nextTransform = this.getNextTransform(now);
      this.setTransform(nextTransform);
    }
  }

  // Use this method to set the objects transform incase a callback has been
  // connected that is tied to an update of the transform.
  setTransform(transform: g2.Transform): void {
    this.transform = transform.copy();
    if (this.setTransformCallback) {
      this.setTransformCallback(this.transform);
    }
  }

  // Get the transform for the next animation frame. This transform will
  // be different to this.transform if currently animating or moving freely
  // and some time has elapsed from the last transform.
  getNextTransform(now: number): g2.Transform {
    // If animation is happening
    if (this.state.isAnimating) {
      const phase = this.state.animation.currentPhase;

      // If an animation hasn't yet started, the start time will be -1.
      // If this is so, then set the start time to the current time and
      // return the current transform.
      if (phase.startTime < 0) {
        phase.startTime = now;
        return this.transform;
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
        if (this.state.animation.currentPhaseIndex < this.animationPlan.phases.length - 1) {
          // Set current transform to the end of the current phase
          this.setTransform(this.calcNextAnimationTransform(phase.time));

          // Get the amount of time that has elapsed in the next phase
          const nextPhaseDeltaTime = deltaTime - phase.time;

          // Start the next animation phase
          this.state.animation.currentPhaseIndex += 1;
          this.animatePhase(this.animationPlan.phases[this.state.animation.currentPhaseIndex]);
          this.state.animation.currentPhase.startTime =
            now - nextPhaseDeltaTime;
          return this.getNextTransform(now);
        }
        // This needs to go before StopAnimating, as stopAnimating clears
        // the animation plan (incase a callback is used to start another
        // animation)
        const endTransform = this.calcNextAnimationTransform(phase.time);
        this.stopAnimating(true);
        return endTransform;
      }
      // If we are here, that means the time elapsed is not more than the
      // current animation phase plan time, so calculate the next transform.
      return this.calcNextAnimationTransform(deltaTime);
    }

    // If the element is moving freely, then calc it's next transform
    if (this.state.isMovingFreely) {
      // If this is the first frame of moving freely, then record the current
      // time so can calculate velocity on next frame
      if (this.state.movement.previousTime < 0) {
        this.state.movement.previousTime = now;
        return this.transform.copy();
      }
      // If got here, then we are now after the first frame, so calculate
      // the delta time from this frame to the previous
      const deltaTime = now - this.state.movement.previousTime;
      this.state.movement.previousTime = now;
      this.state.movement.velocity = this.decelerate(deltaTime);

      // If the velocity is 0, then stop moving freely and return the current
      // transform
      if (DiagramElement.isVelocityZero(this.state.movement.velocity)) {
        this.state.movement.velocity = new g2.Transform();
        this.stopMovingFreely();
        return this.transform.copy();
      }

      // If got here, the velocity isn't 0, so calculate the next transform
      // based on the current velocity
      const nextTransform = this.calcNextMovementTransform(deltaTime, this.state.movement.velocity);
      return nextTransform;
    }
    return this.transform;
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

  // Reduce the current velocity by some deceleration over time
  decelerate(deltaTime: number): g2.Transform {
    const velocity = this.state.movement.velocity.copy();

    velocity.rotation = tools.decelerate(
      velocity.rotation,
      this.moveFreelyProperties.deceleration.rotation,
      deltaTime,
    );

    velocity.translation.x = tools.decelerate(
      velocity.translation.x,
      this.moveFreelyProperties.deceleration.translation.x,
      deltaTime,
    );

    velocity.translation.y = tools.decelerate(
      velocity.translation.y,
      this.moveFreelyProperties.deceleration.translation.y,
      deltaTime,
    );

    velocity.scale.x = tools.decelerate(
      velocity.scale.x,
      this.moveFreelyProperties.deceleration.scale.x,
      deltaTime,
    );
    velocity.scale.y = tools.decelerate(
      velocity.scale.y,
      this.moveFreelyProperties.deceleration.scale.y,
      deltaTime,
    );

    return velocity.clip(
      this.moveFreelyProperties.zeroVelocityThreshold,
      this.moveFreelyProperties.maxVelocity,
    );
  }

  // Start an animation plan of phases ending in a callback
  animatePlan(phases: Array<AnimationPhase>, callback: (mixed) => void = () => {}): void {
    this.animationPlan = {
      phases: [],
      callback: () => {},
    };
    for (let i = 0, j = phases.length; i < j; i += 1) {
      this.animationPlan.phases.push(phases[i]);
    }
    if (this.animationPlan.phases.length > 0) {
      this.animationPlan.callback = callback;
      this.state.animation.currentPhaseIndex = 0;
      this.animatePhase(this.animationPlan.phases[this.state.animation.currentPhaseIndex]);
    }
  }
  animatePhase(phase: AnimationPhase): void {
    this.state.animation.currentPhase = phase;
    this.state.animation.currentPhase.start(this.transform.copy());
    this.stopBeingMoved();
    this.stopMovingFreely();
    this.state.isAnimating = true;
  }

  stopAnimating(result?: mixed): void {
    const { callback } = this.animationPlan;
    this.animationPlan = { phases: [], callback: () => {} };
    this.state.isAnimating = false;

    if (callback) {
      if (result) {
        callback(result);
      } else {
        callback();
      }
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
    callback: (mixed) => void = () => {},
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
    callback: (mixed) => void = () => {},
  ): void {
    const transform = this.transform.copy();
    transform.translation = translation.copy();
    const phase = new AnimationPhase(transform, time, 0, easeFunction);
    if (phase instanceof AnimationPhase) {
      this.animatePlan([phase], callback);
    }
  }
  animateRotationTo(
    rotation,
    rotDirection,
    time = 1,
    easeFunction = tools.easeinout,
    callback: (mixed) => void = () => {},
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
    callback: (mixed) => void = () => {},
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
    // console.log(this.state.movementvelocity.rotation)
  }

  stopBeingMoved(): void {
    this.state.isBeingMoved = false;
    this.state.movement.previousTime = -1;
  }

  // Moving Freely
  startMovingFreely(): void {
    this.stopAnimating();
    this.stopBeingMoved();
    this.state.isBeingMoved = false;
    this.state.isMovingFreely = true;
    this.state.movement.previousTime = -1;
    this.state.movement.velocity = this.state.movement.velocity.clip(
      this.moveFreelyProperties.zeroVelocityThreshold,
      this.moveFreelyProperties.maxVelocity,
    );
  }

  stopMovingFreely(): void {
    this.state.isMovingFreely = false;
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

    this.state.movement.velocity = this.transform.velocity(
      newTransform,
      deltaTime,
      this.moveFreelyProperties.zeroVelocityThreshold,
      this.moveFreelyProperties.maxVelocity,
    );
    this.state.movement.previousTime = currentTime;
  }

  transformWithPulse(now: number, transformMatrix: Array<number>): Array<number> {
    let pulseTransformMatrix = m2.copy(transformMatrix);
    if (this.pulse.pulsing) {
      if (this.pulse.startTime === -1) {
        this.pulse.startTime = now;
      }

      const deltaTime = now - this.pulse.startTime;

      const scale = this.pulse.pulsePattern(
        deltaTime,
        this.pulse.frequency,
        this.pulse.A,
        this.pulse.B,
        this.pulse.C,
      );
      const pulseTransform = DiagramElement.getPulseTransform(scale);
      pulseTransformMatrix = m2.translate(
        pulseTransformMatrix,
        pulseTransform.translation.x,
        pulseTransform.translation.y,
      );
      pulseTransformMatrix = m2.rotate(
        pulseTransformMatrix,
        pulseTransform.rotation,
      );
      pulseTransformMatrix = m2.scale(
        pulseTransformMatrix,
        pulseTransform.scale.x,
        pulseTransform.scale.y,
      );

      if (deltaTime > this.pulse.time && this.pulse.time !== 0) {
        this.pulse.pulsing = false;
      }
      // this.globals.animateNextFrame();
    }

    this.lastDrawTransformMatrix = m2.copy(pulseTransformMatrix);
    return pulseTransformMatrix;
  }
  pulseNow() {
    this.pulse.pulsing = true;
    this.pulse.startTime = -1;
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

  isBeingTouched(location: g2.Point, canvas: HTMLCanvasElement): boolean {
    for (let m = 0, n = this.vertices.border.length; m < n; m += 1) {
      const border = [];
      for (let i = 0, j = this.vertices.border[m].length; i < j; i += 1) {
        border[i] = this.vertexToScreen(this.vertices.border[m][i], canvas);
      }
      if (location.isInPolygon(border)) {
        return true;
      }
    }
    return false;
  }

  draw(transformMatrix: Array<number> = m2.identity(), now: number = 0) {
    if (this.show) {
      this.setNextTransform(now);
      let matrix = m2.mul(transformMatrix, this.transform.matrix());
      this.lastDrawTransformMatrix = matrix;
      matrix = this.transformWithPulse(now, matrix);

      let pointCount = this.vertices.numPoints;
      if (this.angleToDraw !== -1) {
        pointCount = this.vertices.getPointCountForAngle(this.angleToDraw);
      }
      if (this.pointsToDraw !== -1) {
        pointCount = this.pointsToDraw;
      }
      this.vertices.drawWithTransformMatrix(matrix, pointCount, this.color);
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
  biasTransform: Array<number>;

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
      this.lastDrawTransformMatrix = matrix;

      matrix = this.transformWithPulse(now, matrix);
      for (let i = 0, j = this.order.length; i < j; i += 1) {
        this.elements[this.order[i]].draw(matrix, now);
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

  updateBias(scale: g2.Point, offset: g2.Point): void {
    this.biasTransform = (new g2.Transform(offset, 0, scale)).matrix();
  }

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
