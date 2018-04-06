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

  // Being Moved
  isBeingMoved: boolean;          // Element is currently being moved
  isMovable: boolean;             // Element is able to be moved
  isMovingFreely: boolean;        // Element is moving freely
  moveState: Object;              // Movement state
  isTouchable: boolean;           // Element can be touched

  // Animation
  animationPlan: {
    phases: Array<AnimationPhase>,
    callback: (mixed) => void
  };
  // isAnimating: boolean;           // If element is currently animating
  // animationProgress: Object;         // Animation state
  pulse: Object;                  // Pulse animation state
  state: {
    isAnimating: boolean,
    animation: {
      currentPhaseIndex: number,
      currentPhase: AnimationPhase,
    }
  };

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

    this.isBeingMoved = false;
    this.isMovable = false;
    this.isMovingFreely = false;
    this.isTouchable = false;

    this.animationPlan = {
      phases: [],
      callback: () => {},
    };
    this.state = {
      isAnimating: false,
      animation: {
        currentPhaseIndex: 0,         // current animation phase index in plan
        currentPhase: new AnimationPhase(),  // current animation phase
      // movement: {
      //   previousTime: -1,
      //   velocity: 0,
      // }
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
    this.moveState = {
      previousTime: -1,
      stopTime: 1,
      time: 0,
      deceleration: new g2.Transform(g2.point(1, 1), 1, g2.point(1, 1)),
      previous: new g2.Transform(),
      velocity: new g2.Transform.Zero(),
      maxVelocity: new g2.Transform(
        g2.point(1000, 1000),
        1000,
        g2.point(1000, 1000),
      ),
      stopMovingVelocity: new g2.Transform(
        g2.point(0.0001, 0.0001),
        0.0001,
        g2.point(0.0001, 0.0001),
      ),
    };
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
    if (this.state.isAnimating || this.isMovingFreely) {
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
    if (this.isMovingFreely) {
      if (this.moveState.previousTime < 0) {
        this.moveState.previousTime = now;
        return this.transform.copy();
      }

      const deltaTime = now - this.moveState.previousTime;
      this.moveState.previousTime = now;
      this.moveState.velocity = this.changeVelocity(deltaTime);
      // console.log("Asdf",this.moveState.velocity.translation.x);
      if (DiagramElement.isVelocityZero(this.moveState.velocity)) {
        this.moveState.velocity = new g2.Transform();
        this.stopMovingFreely();
        return this.transform.copy();
      }
      const nextTransform = this.calcNextMovementTransform(deltaTime, this.moveState.velocity);
      return nextTransform;
    }
    return this.transform;
  }

  static isVelocityZero(transform: g2.Transform): boolean {
    const threshold = new g2.Transform(g2.point(0.001, 0.001), 0.001, g2.point(0.001, 0.001));
    if (Math.abs(transform.rotation) > threshold.rotation) {
      return false;
    }
    if (Math.abs(transform.translation.x) > threshold.translation.x) {
      return false;
    }
    if (Math.abs(transform.translation.y) > threshold.translation.y) {
      return false;
    }
    if (Math.abs(transform.scale.x) > threshold.scale.x) {
      return false;
    }
    if (Math.abs(transform.scale.y) > threshold.scale.y) {
      return false;
    }
    return true;
  }

  changeVelocity(deltaTime: number): g2.Transform {
    const velocity = this.moveState.velocity.copy();
    // let deceleration = 0.5;
    const slowdown = 0.8;
    // console.log(this.moveState.velocity);
    // velocity.rotation += -(velocity.rotation/Math.abs(velocity.rotation))*deceleration*deltaTime;
    velocity.rotation = tools.decelerate(
      velocity.rotation,
      this.moveState.deceleration.rotation,
      deltaTime,
    );

    velocity.translation.x = tools.decelerate(
      velocity.translation.x,
      this.moveState.deceleration.translation.x,
      deltaTime,
    );

    velocity.translation.y = tools.decelerate(
      velocity.translation.y,
      this.moveState.deceleration.translation.y,
      deltaTime,
    );

    velocity.scale.x = tools.decelerate(
      velocity.scale.x,
      this.moveState.deceleration.scale.x,
      deltaTime,
    );
    velocity.scale.y = tools.decelerate(
      velocity.scale.y,
      this.moveState.deceleration.scale.y,
      deltaTime,
    );
    // velocity.translation.x *= slowdown;
    // velocity.translation.y *= slowdown;
    // velocity.scale.x *= slowdown;
    // velocity.scale.y *= slowdown;
    return velocity.clip(this.moveState.stopMovingVelocity, this.moveState.maxVelocity);
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
    this.stopMoving();
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


  // Movement
  startBeingMoved(): void {
    this.stopAnimating();
    this.stopMovingFreely();
    this.moveState.velocity = g2.Transform.Zero();
    this.moveState.previous = this.transform.copy();
    this.moveState.previousTime = Date.now() / 1000;
    this.isBeingMoved = true;
  }
  moved(newTransform: g2.Transform): void {
    this.calcVelocity(newTransform);
    // console.log(this.moveStatevelocity.rotation)
  }
  startMovingFreely(): void {
    this.isBeingMoved = false;
    this.isMovingFreely = true;
    this.moveState.previousTime = -1;
    this.moveState.velocity = this.moveState.velocity.clip(
      this.moveState.stopMovingVelocity,
      this.moveState.maxVelocity,
    );
    // console.log(this.moveState.velocity.rotation);
  }
  stopMovingFreely(): void {
    this.isMovingFreely = false;
    this.moveState.previousTime = -1;
  }
  stopMoving(): void {
    this.isBeingMoved = false;
    this.moveState.previousTime = -1;
  }

  calcVelocity(newTransform: g2.Transform): void {
    const currentTime = Date.now() / 1000;
    if (this.moveState.previousTime < 0) {
      this.moveState.previousTime = currentTime;
      return;
    }
    const deltaTime = currentTime - this.moveState.previousTime;
    // console.log("time: " + deltaTime)

    this.moveState.velocity = this.transform.velocity(
      newTransform,
      deltaTime,
      this.moveState.stopMovingVelocity,
      this.moveState.maxVelocity,
    );
    this.moveState.previousTime = currentTime;
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
    if (this.state.isAnimating || this.isMovingFreely || this.isBeingMoved) {
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
    if (this.state.isAnimating || this.isMovingFreely || this.isBeingMoved) {
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
