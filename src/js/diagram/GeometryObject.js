// @flow

import * as g2 from './g2';
import * as m2 from './m2';
import * as tools from './mathtools';
import GlobalVariables from './globals';
import VertexObject from './vertexObjects/vertexObject';

// Planned Animation
class AnimationPhase {
  transform: g2.Transform;
  time: number;
  rotDirection: number;
  animationStyle: (number) => number;

  constructor(
    transform: g2.Transform = g2.Transform.Unity(),
    time: number = 1,
    rotDirection: number = 0,
    animationStyle: (number) => number = tools.easeinout,
  ) {
    this.transform = transform.copy();
    this.time = time;
    this.rotDirection = rotDirection;
    this.animationStyle = animationStyle;
  }
}

// A diagram is composed of multiple diagram elements.
//
// A diagram element can either be a:
//  - Geometry Object: a object that has the webGL vertices, color
//  - Geometry Collection: a group of Geometry objects and/or other
//                         Geometry Collections
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

class DiagramElement {
  transform: g2.Transform;        // Transform of diagram element
  presetTransforms: Object;       // Convenience dict of transform presets
  setTransformCallback: (g2.Transform) => void; // Called when setting Transform
  globals: GlobalVariables;       // Link to global variables
  lastDrawTransformMatrix: Array<number>; // Transform matrix used in last draw
  show: boolean;                  // True if should be shown in diagram
  name: string;                   // Used to reference element in a collection

  // Being Moved
  isBeingMoved: boolean;          // Element is currently being moved
  isMovable: boolean;             // Element is able to be moved
  isMovingFreely: boolean;        // Element is moving freely
  moveState: Object;              // Movement state
  isTouchable: boolean;           // Element can be touched
  // isFollowing: boolean;           //

  // Animation
  animationPlan: Array<AnimationPhase>; // Animation plan
  isAnimating: boolean;           // If element is currently animating
  animationState: Object;         // Animation state
  pulse: Object;                  // Pulse animation state

  constructor(
    translation: g2.Point = g2.Point.zero(),
    rotation: number = 0,
    scale: g2.Point = g2.Point.Unity(),
    name: string = '',
  ) {
    this.transform = new g2.Transform(translation, rotation, scale);
    this.setTransformCallback = () => {};
    this.show = false;
    this.globals = new GlobalVariables();
    this.lastDrawTransformMatrix = m2.identity();
    this.name = name;

    this.isBeingMoved = false;
    this.isMovable = false;
    this.isMovingFreely = false;
    this.isTouchable = false;

    // this.isFollowing = false;

    // this.isAnimatingPlan = false;
    this.animationPlan = [];
    this.isAnimating = false;
    this.animationState = {
      elapsedTime: 0,
      startTime: -1,
      deltaTime: 0,
      initialTransform: new g2.Transform(),
      deltaTransform: new g2.Transform(),
      style: tools.easeout,
      callback: false,
      index: 0,
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
      maxVelocity: new g2.Transform(),
      stopMovingVelocity: new g2.Transform(),
    };
  }

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
  calcNextAnimationTransform(deltaTime: number): g2.Transform {
    const progress = this.animationState.style(deltaTime / this.animationState.deltaTime);
    const nextTransform = new g2.Transform();
    nextTransform.translation.x =
      this.animationState.initialTransform.translation.x +
      progress * this.animationState.deltaTransform.translation.x;

    nextTransform.translation.y =
      this.animationState.initialTransform.translation.y +
      progress * this.animationState.deltaTransform.translation.y;

    nextTransform.scale.x =
      this.animationState.initialTransform.scale.x +
      progress * this.animationState.deltaTransform.scale.x;
    nextTransform.scale.y =
      this.animationState.initialTransform.scale.y +
      progress * this.animationState.deltaTransform.scale.y;

    nextTransform.rotation =
      this.animationState.initialTransform.rotation +
      progress * this.animationState.deltaTransform.rotation;
    return nextTransform;
  }

  calcNextMovementTransform(deltaTime, velocity): g2.Transform {
    const nextTransform = this.transform.copy();
    nextTransform.rotation += deltaTime * velocity.rotation;
    nextTransform.translation.x += deltaTime * velocity.translation.x;
    nextTransform.translation.y += deltaTime * velocity.translation.y;
    nextTransform.scale.x += deltaTime * velocity.scale.x;
    nextTransform.scale.y += deltaTime * velocity.scale.y;
    return nextTransform;
  }

  setNextTransform(now: number): void {
    const nextTransform = this.getNextTransform(now);
    // console.log(nextTransform)
    this.setTransform(nextTransform);
  }

  setTransform(transform: g2.Transform): void {
    this.transform = transform.copy();
    if (this.setTransformCallback) {
      this.setTransformCallback(this.transform);
    }
  }

  getNextTransform(now: number): g2.Transform {
    if (this.isAnimating) {
      // console.log(this.animationState)
      if (this.animationState.startTime < 0) {
        this.animationState.startTime = now;
        return this.transform;
      }
      const deltaTime = now - this.animationState.startTime;

      if (deltaTime > this.animationState.deltaTime) {
        if (this.animationState.index < this.animationPlan.length - 1) {
          this.animationState.index += 1;
          this.animatePhase(this.animationPlan[this.animationState.index]);
          return this.calcNextAnimationTransform(0);
        }
        // This needs to go before StopAnimating, incase stopAnimating calls a callback that
        // changes the animation properties
        const returnPos = this.calcNextAnimationTransform(this.animationState.deltaTime);
        this.stopAnimating(true);
        return returnPos;
      }
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
      if (DiagramElement.isVelocityZero(this.moveState.velocity)) {
        this.moveState.velocity = new g2.Transform();
        this.stopMovingFreely();
        return this.transform.copy();
      }
      const nextTransform = this.calcNextMovementTransform(deltaTime, this.moveState.velocity);
      return nextTransform;
    }
    return new g2.Transform();
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
    velocity.translation.x *= slowdown;
    velocity.translation.y *= slowdown;
    velocity.scale.x *= slowdown;
    velocity.scale.y *= slowdown;
    return velocity;
  }

  getTransformMatrix(transformMatrix: Array<number> = m2.identity(), now: number): Array<number> {
    // if (transformMatrix === false) {
    //   transformMatrix = m2.identity();
    // }
    let matrix = m2.copy(transformMatrix);

    if (this.isAnimating) {
      this.setTransform(this.getNextTransform(now));
      this.globals.animateNextFrameFlag = true;
    }

    matrix = m2.translate(
      matrix,
      this.transform.translation.x,
      this.transform.translation.y,
    );
    matrix = m2.rotate(matrix, this.transform.rotation);
    // console.log(matrix)
    matrix = m2.scale(matrix, this.transform.scale.x, this.transform.scale.y);
    // console.log(this.transform.scale)
    this.lastDrawTransformMatrix = matrix;

    return matrix;
  }

  animatePlan(phases: Array<AnimationPhase>, callback: () => void = () => {}): void {
    this.animationPlan = [];
    for (let i = 0, j = phases.length; i < j; i += 1) {
      this.animationPlan.push(phases[i]);
    }
    if (this.animationPlan.length > 0) {
      this.animationState.callback = callback;
      this.animationState.index = 0;
      this.animatePhase(this.animationPlan[this.animationState.index]);
    }
  }
  animatePhase(phase: AnimationPhase): void {
    const targetTransform = phase.transform;
    const { time, rotDirection, animationStyle } = phase;
    // const { rotDirection } = phase;
    // const { animationStyle } = phase;

    this.animationState.initialTransform = this.transform.copy();
    const translationDiff = targetTransform.translation.sub(this.transform.translation);
    const scaleDiff = targetTransform.scale.sub(this.transform.scale);
    let rotDiff = g2.minAngleDiff(targetTransform.rotation, this.transform.rotation);

    if (rotDiff * rotDirection < 0) {
      rotDiff = rotDirection * Math.PI * 2.0 + rotDiff;
    }

    this.animationState.deltaTransform = new g2.Transform(translationDiff, rotDiff, scaleDiff);
    this.animationState.deltaTime = time;
    this.animationState.style = animationStyle;
    this.stopMoving();
    this.isAnimating = true;
    this.animationState.startTime = -1;
  }

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

  stopAnimating(result?: mixed): void {
    this.isAnimating = false;
    this.animationPlan = [];
    if (this.animationState.callback) {
      if (result) {
        this.animationState.callback(result);
      } else {
        this.animationState.callback();
      }
    }
    this.animationState.callback = false;
  }
  // Movement
  startMoving(): void {
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
    // this.moveState.velocity = tools.clipValue(
    //   newTransform,
    //   this.transform,
    //   deltaTime,
    //   this.moveState.maxVelocity,
    //   this.moveState.stopMovingVelocity,
    // );
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
      this.globals.animateNextFrame();
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
class GeometryObject extends DiagramElement {
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
      // console.log(this.name)
      // if (transformMatrix == false) {
      //   transformMatrix = m2.identity();
      // }
      // if (this.isAnimating) {
      //   this.setTransform(this.getNextTransform(now));
      //   this.globals.animateNextFrameFlag = true;
      // }
      // eslint-disable-next-line max-len
      // transformMatrix = m2.translate(transformMatrix, this.transform.translation.x, this.transform.translation.y);
      // transformMatrix = m2.rotate(transformMatrix, this.transform.rotation);
      // eslint-disable-next-line max-len
      // transformMatrix = m2.scale(transformMatrix, this.transform.scale.x, this.transform.scale.y);
      // this.lastDrawTransformMatrix = m2.copy(transformMatrix);
      let matrix = this.getTransformMatrix(transformMatrix, now);
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

  drawCustom(
    translation: g2.Point,
    rotation: number,
    scale: g2.Point,
    color: Array<number>,
  ): void {
    if (this.show) {
      let transformMatrix = m2.identity();
      transformMatrix = m2.translate(transformMatrix, translation.x, translation.y);
      transformMatrix = m2.rotate(transformMatrix, rotation);
      transformMatrix = m2.scale(transformMatrix, scale.x, scale.y);
      this.vertices.drawWithTransformMatrix(transformMatrix, this.vertices.numPoints, color);
    }
  }
}

// ***************************************************************
// Collection of Geometry Objects or Collections
// ***************************************************************
class GeometryCollection extends DiagramElement {
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

  add(name: string, geoObject: GeometryObject) {
    this.elements[name] = geoObject;
    this.elements[name].name = name;
    // $FlowFixMe
    this[`_${name}`] = this.elements[name];
    this.order.push(name);
  }
  draw(transformMatrix: Array<number> = m2.identity(), now: number = 0) {
    if (this.show) {
      let matrix = this.getTransformMatrix(transformMatrix, now);

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

  showOnly(listToShow: Array<GeometryObject | GeometryCollection>): void {
    this.hideAll();
    for (let i = 0, j = listToShow.length; i < j; i += 1) {
      const element = listToShow[i];
      element.show = true;
    }
  }

  hideOnly(listToHide: Array<GeometryObject | GeometryCollection>): void {
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
export { GeometryObject, GeometryCollection };
