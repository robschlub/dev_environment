// @flow

import {
  Transform, Point, TransformLimit, Rect,
  Translation, spaceToSpaceTransform, getBoundingRect,
  Scale, Rotation, Line, getMaxTimeFromVelocity,
} from './tools/g2';
import * as m2 from './tools/m2';
import type { pathOptionsType, TypeRotationDirection } from './tools/g2';
import * as tools from './tools/mathtools';
import HTMLObject from './DrawingObjects/HTMLObject/HTMLObject';
import DrawingObject from './DrawingObjects/DrawingObject';
import VertexObject from './DrawingObjects/VertexObject/VertexObject';
import { TextObject } from './DrawingObjects/TextObject/TextObject';
import { colorArrayToRGBA, duplicateFromTo } from '../tools/tools';
// eslint-disable-next-line import/no-cycle
import {
  AnimationPhase, ColorAnimationPhase, CustomAnimationPhase,
} from './AnimationPhase';

function checkCallback(callback: ?(boolean) => void): (boolean) => void {
  let callbackToUse = () => {};
  if (typeof callback === 'function') {
    callbackToUse = callback;
  }
  return callbackToUse;
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
  transform: Transform;        // Transform of diagram element
  // presetTransforms: Object;       // Convenience dict of transform presets
  lastDrawTransform: Transform; // Transform matrix used in last draw
  // lastDrawParentTransform: Transform;
  // lastDrawElementTransform: Transform;
  // lastDrawPulseTransform: Transform;
  lastDrawElementTransformPosition: {parentCount: number, elementCount: number};

  isShown: boolean;                  // True if should be shown in diagram
  name: string;                   // Used to reference element in a collection

  isMovable: boolean;             // Element is able to be moved
  isTouchable: boolean;           // Element can be touched
  isInteractive: boolean;         // Touch event is not processed by Diagram
  hasTouchableElements: boolean;

  // Callbacks
  onClick: ?(?mixed) => void;
  setTransformCallback: (Transform) => void; // element.transform is updated

  color: Array<number>;           // For the future when collections use color
  noRotationFromParent: boolean;

  interactiveLocation: Point;   // this is in vertex space

  animate: {
    transform: {
      plan: Array<AnimationPhase>;
      translation: {
        style: 'linear' | 'curved';
        options: pathOptionsType;
      };
      callback: ?(boolean) => void;
    };
    custom: {
      // This is happening I think because of the generic stopAnimation
      // method. I think maybe in the future after a few flow updates this
      // will fix itself.
      // $FlowFixMe
      plan: Array<CustomAnimationPhase>;
      callback: ?(boolean) => void;
    };
    color: {
      toDisolve: '' | 'in' | 'out';
      // $FlowFixMe
      plan: Array<ColorAnimationPhase>;
      callback: ?(boolean) => void;
    };
  }

  move: {
    maxTransform: Transform,
    minTransform: Transform,
    limitToDiagram: boolean,
    limitLine: null | Line,
    maxVelocity: TransformLimit;            // Maximum velocity allowed
    // When moving freely, the velocity decelerates until it reaches a threshold,
  // then it is considered 0 - at which point moving freely ends.
    freely: {                 // Moving Freely properties
      zeroVelocityThreshold: TransformLimit,  // Velocity considered 0
      deceleration: TransformLimit,           // Deceleration
    };
    bounce: boolean;
    canBeMovedAfterLoosingTouch: boolean;
    type: 'rotation' | 'translation' | 'scaleX' | 'scaleY' | 'scale';
    // eslint-disable-next-line no-use-before-define
    element: DiagramElementCollection | DiagramElementPrimative | null;
  };

  pulse: {
    time: number,
    frequency: number,
    A: number,
    B: number,
    C: number,
    style: (number) => number,
    num: number,
    transformMethod: (number) => Transform,
    callback: (boolean) => void;
  };

  diagramLimits: Rect;

  // Current animation/movement state of element
  state: {
    isAnimating: boolean,
    isAnimatingColor: boolean,
    isAnimatingCustom: boolean,
    disolving: '' | 'in' | 'out',
    animation: {
      currentPhaseIndex: number,
      currentPhase: AnimationPhase,
    },
    colorAnimation: {
      currentPhaseIndex: number,
      currentPhase: ColorAnimationPhase,
    },
    customAnimation: {
      currentPhaseIndex: number,
      currentPhase: CustomAnimationPhase,
    },
    isBeingMoved: boolean,
    isMovingFreely: boolean,
    movement: {
      previousTime: number,
      previousTransform: Transform,
      velocity: Transform,           // current velocity - will be clipped
                                        // at max if element is being moved
                                        // faster than max.
    },
    isPulsing: boolean,
    pulse: {
      startTime: number,
    },
  };

  pulse: Object;                  // Pulse animation state

  uid: string;

  constructor(
    // translation: Point = Point.zero(),
    // rotation: number = 0,
    // scale: Point = Point.Unity(),
    transform: Transform = new Transform(),
    diagramLimits: Rect = new Rect(-1, -1, 2, 2),
  ) {
    this.name = ''; // This is updated when an element is added to a collection
    this.uid = (Math.random() * 1e18).toString(36);
    this.isShown = true;
    this.transform = transform._dup();
    this.isMovable = false;
    this.isTouchable = false;
    this.isInteractive = false;
    this.hasTouchableElements = false;
    this.color = [1, 1, 1, 1];
    this.setTransformCallback = () => {};
    this.lastDrawTransform = this.transform._dup();
    this.onClick = null;
    this.lastDrawElementTransformPosition = {
      parentCount: 0,
      elementCount: 0,
    };
    this.noRotationFromParent = false;
    this.animate = {
      color: {
        plan: [],
        toDisolve: '',
        callback: null,
      },
      transform: {
        plan: [],
        translation: {
          style: 'linear',
          options: {
            rot: 1,
            magnitude: 0.5,
            offset: 0.5,
            controlPoint: null,
            direction: '',
          },
        },
        callback: null,
      },
      custom: {
        plan: [],
        callback: null,
      },
    };
    this.diagramLimits = diagramLimits;
    this.move = {
      maxTransform: this.transform.constant(1000),
      minTransform: this.transform.constant(-1000),
      limitToDiagram: false,
      maxVelocity: new TransformLimit(5, 5, 5),
      freely: {
        zeroVelocityThreshold: new TransformLimit(0.001, 0.001, 0.001),
        deceleration: new TransformLimit(5, 5, 5),
      },
      bounce: true,
      canBeMovedAfterLoosingTouch: false,
      type: 'translation',
      element: null,
      limitLine: null,
    };

    this.pulse = {
      time: 1,
      frequency: 0.5,
      A: 1,
      B: 0.5,
      C: 0,
      style: tools.sinusoid,
      num: 1,
      transformMethod: s => new Transform().scale(s, s),
      callback: () => {},
    };

    this.state = {
      isAnimating: false,
      isAnimatingColor: false,
      isAnimatingCustom: false,
      disolving: '',
      animation: {
        currentPhaseIndex: 0,         // current animation phase index in plan
        currentPhase: new AnimationPhase(),  // current animation phase
      },
      colorAnimation: {
        currentPhaseIndex: 0,         // current animation phase index in plan
        currentPhase: new ColorAnimationPhase(),  // current animation phase
      },
      customAnimation: {
        currentPhaseIndex: 0,         // current animation phase index in plan
        currentPhase: new CustomAnimationPhase(() => {}),  // current animation phase
      },
      isBeingMoved: false,
      isMovingFreely: false,
      movement: {
        previousTime: -1,
        previousTransform: this.transform._dup(),
        velocity: this.transform.zero(),
      },

      isPulsing: false,
      pulse: {
        startTime: -1,
      },
    };
    this.interactiveLocation = new Point(0, 0);

    // this.presetTransforms = {};
  }

  // copyFrom(element: Object) {
  //   const copyValue = (value) => {
  //     if (typeof value === 'number'
  //         || typeof value === 'boolean'
  //         || typeof value === 'string'
  //         || value == null
  //         || typeof value === 'function') {
  //       return value;
  //     }
  //     if (typeof value._dup === 'function') {
  //       return value._dup();
  //     }
  //     // if (value instanceof AnimationPhase
  //     //     || value instanceof ColorAnimationPhase
  //     //     || value instanceof CustomAnimationPhase
  //     //     // eslint-disable-next-line no-use-before-define
  //     //     || value instanceof DiagramElementCollection
  //     //     // eslint-disable-next-line no-use-before-define
  //     //     || value instanceof DiagramElementPrimative
  //     //     || value instanceof DrawingObject
  //     //     || value instanceof Transform
  //     //     || value instanceof Point
  //     //     || value instanceof Rect
  //     //     || value instanceof TransformLimit) {
  //     //   return value._dup();
  //     // }
  //     if (Array.isArray(value)) {
  //       const arrayCopy = [];
  //       value.forEach(arrayElement => arrayCopy.push(copyValue(arrayElement)));
  //       return arrayCopy;
  //     }
  //     if (typeof value === 'object') {
  //       const objectCopy = {};
  //       Object.keys(value).forEach((key) => {
  //         const v = copyValue(value[key]);
  //         objectCopy[key] = v;
  //       });
  //       return objectCopy;
  //     }
  //     return value;
  //   };

  //   Object.keys(element).forEach((key) => {
  //     // $FlowFixMe
  //     this[key] = copyValue(element[key]);
  //   });
  // }

  // Space definition:
  //   * Pixel space: css pixels
  //   * GL Space: x,y = -1 to 1
  //   * Diagram Space: x,y = diagram limits
  //   * Element space: Combination of element transform and its
  //     parent transform's

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

  // vertexToClip(vertex: Point) {
  //   const scaleX = this.diagramLimits.width / 2;
  //   const scaleY = this.diagramLimits.height / 2;
  //   const biasX = -(-this.diagramLimits.width / 2 - this.diagramLimits.left);
  //   const biasY = -(this.diagramLimits.height / 2 - this.diagramLimits.top);
  //   const transform = new Transform().scale(scaleX, scaleY).translate(biasX, biasY);
  //   return vertex.transformBy(this.lastDrawTransformMatrix)
  //     .transformBy(transform.matrix());
  // }
  // textVertexToClip(vertex: Point) {
  //   const scaleX = this.diagramLimits.width / 2;
  //   const scaleY = this.diagramLimits.height / 2;
  //   const biasX = -(-this.diagramLimits.width / 2 - this.diagramLimits.left);
  //   const biasY = -(this.diagramLimits.height / 2 - this.diagramLimits.top);
  //   const transform = new Transform().scale(scaleX, scaleY).translate(biasX, biasY);
  //   return vertex.transformBy(transform.matrix());
  // }

  // Calculate the next transform due to a progressing animation
  calcNextAnimationTransform(elapsedTime: number): Transform {
    const phase = this.state.animation.currentPhase;
    // This flow error cannot happen as start is un-nulled in the phase start
    // $FlowFixMe
    const start = phase.startTransform._dup();
    const delta = phase.deltaTransform._dup();
    const percentTime = elapsedTime / phase.time;
    const percentComplete = phase.animationStyle(percentTime);

    const p = percentComplete;
    // let next = delta._dup().constant(p);

    // next = start.add(delta.mul(next));
    const next = start.toDelta(
      delta, p,
      phase.translationStyle,
      phase.translationOptions,
    );
    return next;
  }

  calcNextAnimationColor(elapsedTime: number): Array<number> {
    const phase = this.state.colorAnimation.currentPhase;
    const start = phase.startColor;
    const delta = phase.deltaColor;
    const percentTime = elapsedTime / phase.time;
    const percentComplete = phase.animationStyle(percentTime);

    const p = percentComplete;
    let next = [0, 0, 0, 1];
    if (start != null) {
      next = start.map((c, index) => c + delta[index] * p);
    }
    return next;
  }

  calcNextCustomAnimationPercentComplete(elapsedTime: number): number {
    const phase = this.state.customAnimation.currentPhase;
    const percentTime = elapsedTime / phase.time;
    const percentComplete = phase.animationStyle(percentTime);
    return percentComplete;
  }

  setPosition(pointOrX: Point | number, y: number = 0) {
    let position = pointOrX;
    if (typeof pointOrX === 'number') {
      position = new Point(pointOrX, y);
    }
    const currentTransform = this.transform._dup();
    currentTransform.updateTranslation(position);
    this.setTransform(currentTransform);
  }

  // Use this method to set the element's transform in case a callback has been
  // connected that is tied to an update of the transform.
  setTransform(transform: Transform): void {
    this.transform = transform._dup().clip(
      this.move.minTransform,
      this.move.maxTransform,
      this.move.limitLine,
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
        if (this.state.animation.currentPhaseIndex < this.animate.transform.plan.length - 1) {
          // Set current transform to the end of the current phase
          phase.finish(this);
          // this.setTransform(this.calcNextAnimationTransform(phase.time));

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

        // Note, stopAnimating will finish the last phase
        this.stopAnimating(false);
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
        this.stopMovingFreely(false);
      }
      this.setTransform(next.transform);
    }
  }

  setNextCustomAnimation(now: number): void {
    // If animation is happening
    // if (this.name === 'diameterDimension') {
    //   console.log("0", this.state.isAnimatingCustom)
    // }
    if (this.state.isAnimatingCustom) {
      const phase = this.state.customAnimation.currentPhase;
      // console.log("0.5", phase.startTime)
      // If an animation hasn't yet started, the start time will be -1.
      // If this is so, then set the start time to the current time and
      // return the current transform.
      if (phase.startTime < 0) {
        phase.startTime = now - phase.plannedStartTime;
        return;
      }
      // const percent = calcNextCustomAnimationPercentComplete(now);
      // If we have got here, that means the animation has already started,
      // so calculate the time delta between now and the startTime
      const deltaTime = now - phase.startTime;
      // If this time delta is larger than the phase's planned time, then
      // either progress to the next animation phase, or end animation.
      if (deltaTime > phase.time) {
        // console.log("1")
        // If there are more animation phases in the plan:
        //   - set the current transform to be the end of the current phase
        //   - start the next phase
        if (this.state.customAnimation.currentPhaseIndex < this.animate.custom.plan.length - 1) {
          // Set current transform to the end of the current phase
          // phase.animationCallback(1);
          phase.finish();

          // Get the amount of time that has elapsed in the next phase
          const nextPhaseDeltaTime = deltaTime - phase.time;

          // Start the next animation phase
          this.state.customAnimation.currentPhaseIndex += 1;
          this.animateCustomPhase(this.state.customAnimation.currentPhaseIndex);
          this.state.customAnimation.currentPhase.startTime =
            now - nextPhaseDeltaTime;
          this.setNextCustomAnimation(now);
          return;
        }
        // This needs to go before StopAnimating, as stopAnimating clears
        // the animation plan (incase a callback is used to start another
        // animation)
        // const endColor = this.calcNextAnimationColor(phase.time);

        // this.setColor(endColor);
        // console.log("2")
        // phase.animationCallback(1);
        this.stopAnimatingCustom(true);
        // console.log("3")
        return;
      }
      // If we are here, that means the time elapsed is not more than the
      // current animation phase plan time, so calculate the next transform.
      // console.log("4", this.state.isAnimatingCustom)
      const percent = this.calcNextCustomAnimationPercentComplete(deltaTime);
      // console.log(phase.animationCallback)
      phase.animationCallback(percent);
      // console.log("5", this.state.isAnimatingCustom)
      // this.setColor(this.calcNextAnimationColor(deltaTime));
    }
    // if (this.name === 'diameterDimension') {
    //   console.log("6", this.state.isAnimatingCustom)
    // }
  }

  setNextColor(now: number): void {
    // If animation is happening
    if (this.state.isAnimatingColor) {
      const phase = this.state.colorAnimation.currentPhase;

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
        if (this.state.colorAnimation.currentPhaseIndex < this.animate.color.plan.length - 1) {
          // Set current transform to the end of the current phase
          // this.setColor(this.calcNextAnimationColor(phase.time));
          // Phase callback
          phase.finish(this);
          // Get the amount of time that has elapsed in the next phase
          const nextPhaseDeltaTime = deltaTime - phase.time;

          // Start the next animation phase
          this.state.colorAnimation.currentPhaseIndex += 1;
          this.animateColorPhase(this.state.colorAnimation.currentPhaseIndex);
          this.state.colorAnimation.currentPhase.startTime =
            now - nextPhaseDeltaTime;
          this.setNextColor(now);
          return;
        }
        // This needs to go before StopAnimating, as stopAnimating clears
        // the animation plan (incase a callback is used to start another
        // animation)
        // const endColor = this.calcNextAnimationColor(phase.time);
        // this.setColor(endColor);
        // phase.finish(this);
        this.stopAnimatingColor(false);
        return;
      }
      // If we are here, that means the time elapsed is not more than the
      // current animation phase plan time, so calculate the next transform.
      this.setColor(this.calcNextAnimationColor(deltaTime));
      // if(this.name === 'times') {
      //   console.log(now, this.color[3])
      // }
    }
  }

  setColor(color: Array<number>) {
    this.color = color.slice();
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
    if (deltaTime > 0) {
      for (let i = 0; i < next.t.order.length; i += 1) {
        const t = next.t.order[i];
        const min = this.move.minTransform.order[i];
        const max = this.move.maxTransform.order[i];
        const v = next.v.order[i];
        if ((t instanceof Translation
            && v instanceof Translation
            && max instanceof Translation
            && min instanceof Translation)
          || (t instanceof Scale
            && v instanceof Scale
            && max instanceof Scale
            && min instanceof Scale)
        ) {
          let onLine = true;
          if (this.move.limitLine != null) {
            onLine = t.shaddowIsOnLine(this.move.limitLine, 4);
          }
          if (min.x >= t.x || max.x <= t.x || !onLine) {
            if (this.move.bounce) {
              v.x = -v.x * 0.5;
            } else {
              v.x = 0;
            }
          }
          if (min.y >= t.y || max.y <= t.y || !onLine) {
            if (this.move.bounce) {
              v.y = -v.y * 0.5;
            } else {
              v.y = 0;
            }
          }
          next.v.order[i] = v;
        }
        if (t instanceof Rotation
            && v instanceof Rotation
            && max instanceof Rotation
            && min instanceof Rotation) {
          if (min.r >= t.r || max.r <= t.r) {
            if (this.move.bounce) {
              v.r = -v.r * 0.5;
            } else {
              v.r = 0;
            }
          }
          next.v.order[i] = v;
        }
      }
      next.v.calcMatrix();
    }
    return {
      velocity: next.v,
      transform: next.t,
    };
  }

  updateLastDrawTransform() {
    const { parentCount } = this.lastDrawElementTransformPosition;
    const pLength = this.lastDrawTransform.order.length;
    this.transform.order.forEach((t, index) => {
      this.lastDrawTransform.order[pLength - parentCount - index - 1] = t._dup();
    });
    this.lastDrawTransform.calcMatrix();
  }

  getParentLastDrawTransform() {
    const { parentCount } = this.lastDrawElementTransformPosition;
    return new Transform(this.lastDrawTransform.order.slice(-parentCount));
  }

  // Start an animation plan of phases ending in a callback
  animatePlan(
    phases: Array<AnimationPhase>,
    callback: ?(boolean) => void = null,
  ): void {
    this.stopAnimating();
    this.stopMovingFreely();
    this.stopBeingMoved();
    this.animate.transform.plan = [];
    for (let i = 0, j = phases.length; i < j; i += 1) {
      this.animate.transform.plan.push(phases[i]);
    }
    if (this.animate.transform.plan.length > 0) {
      if (callback) {
        this.animate.transform.callback = callback;
      }
      this.state.isAnimating = true;
      this.state.animation.currentPhaseIndex = 0;
      this.animatePhase(this.state.animation.currentPhaseIndex);
    }
  }

  animateColorPlan(
    phases: Array<ColorAnimationPhase>,
    callback: ?(boolean) => void = null,
  ): void {
    this.stopAnimatingColor();
    this.animate.color.plan = [];
    for (let i = 0, j = phases.length; i < j; i += 1) {
      this.animate.color.plan.push(phases[i]);
    }
    if (this.animate.color.plan.length > 0) {
      if (callback) {
        this.animate.color.callback = callback;
      }
      // console.log(this.animate.color.toDisolve, this.name)
      // this.state.disolving = this.animate.color.toDisolve;
      // this.animate.color.toDisolve = '';
      this.state.isAnimatingColor = true;
      this.state.colorAnimation.currentPhaseIndex = 0;
      this.animateColorPhase(this.state.colorAnimation.currentPhaseIndex);
    }
  }

  animateCustomPlan(
    phases: Array<CustomAnimationPhase>,
    callback: ?(boolean) => void = null,
  ): void {
    this.stopAnimatingCustom();
    this.animate.custom.plan = [];
    for (let i = 0, j = phases.length; i < j; i += 1) {
      this.animate.custom.plan.push(phases[i]);
    }
    if (this.animate.custom.plan.length > 0) {
      if (callback) {
        this.animate.custom.callback = callback;
      }
      this.state.isAnimatingCustom = true;
      this.state.customAnimation.currentPhaseIndex = 0;
      this.animateCustomPhase(this.state.customAnimation.currentPhaseIndex);
    }
  }

  // Start the animation of a phase - this should only be called by methods
  // internal to this class.
  animatePhase(index: number): void {
    this.state.animation.currentPhase = this.animate.transform.plan[index];
    this.state.animation.currentPhase.start(this.transform._dup());
  }

  animateColorPhase(index: number): void {
    this.state.colorAnimation.currentPhase = this.animate.color.plan[index];
    this.state.colorAnimation.currentPhase.start(this);
  }

  animateCustomPhase(index: number): void {
    this.state.customAnimation.currentPhase = this.animate.custom.plan[index];
    this.state.customAnimation.currentPhase.start();
  }

  stopAnimatingGeneric(
    cancelled: boolean,
    forceSetToEnd: ?boolean,
    currentPhaseIndex: number,
    animateString: 'transform' | 'color' | 'custom',
    isState: 'isAnimating' | 'isAnimatingColor' | 'isAnimatingCustom',
  ) {
    // Animation state needs to be cleaned up before calling callbacks
    // as the last phase callback may trigger more animations which need
    // to start from scratch (and not use the existing callback for example).
    // Therefore, make some temporary variables to store the animation state.
    let runRemainingPhases = false;
    // const currentIndex = currentPhaseIndex;
    let runLastPhase = false;
    const { plan, callback } = this.animate[animateString];

    // If the animation was cancelled, then run finish on all unfinished
    // phases.
    if (plan.length > 0
      && this.state[isState]
      && cancelled
    ) {
      runRemainingPhases = true;
    }

    // If the animation finished without being cancelled, then just call
    // the finish routine on the last phase as it hasn't been called yet
    // by setNextTransform
    if (!cancelled) {
      runLastPhase = true;
    }

    // Reset the animation state, plan and callback
    this.state[isState] = false;
    // $FlowFixMe
    this.animate[animateString].plan = [];
    this.animate[animateString].callback = null;

    // Finish remaining phases if required.
    if (runRemainingPhases) {
      const endIndex = plan.length - 1;
      for (let i = currentPhaseIndex; i <= endIndex; i += 1) {
        const phase = plan[i];
        if (phase instanceof CustomAnimationPhase) {
          phase.finish(cancelled, forceSetToEnd);
        } else {
          phase.finish(this, cancelled, forceSetToEnd);
        }
      }
    }

    // Finish last phases if required.
    if (runLastPhase) {
      if (plan.length > 0) {
        const phase = plan.slice(-1)[0];
        if (phase instanceof CustomAnimationPhase) {
          phase.finish(cancelled, forceSetToEnd);
        } else {
          phase.finish(this, cancelled, forceSetToEnd);
        }
      }
    }

    // Run animation plan callback if it exists.
    if (callback != null) {
      callback(cancelled);
    }
  }

  // When animation is stopped, any callback associated with the animation
  // needs to be called, with whatever is passed to stopAnimating.
  stopAnimating(
    cancelled: boolean = true,
    forceSetToEnd: ?boolean = null,
  ): void {
    this.stopAnimatingGeneric(
      cancelled, forceSetToEnd,
      this.state.animation.currentPhaseIndex,
      'transform',
      'isAnimating',
    );
  }

  stopAnimatingColor(
    cancelled: boolean = true,
    forceSetToEnd: ?boolean = null,   // null means use phase default
  ): void {
    this.stopAnimatingGeneric(
      cancelled, forceSetToEnd,
      this.state.colorAnimation.currentPhaseIndex,
      'color',
      'isAnimatingColor',
    );
  }

  stopAnimatingCustom(
    cancelled: boolean = true,
    forceSetToEnd: ?boolean = null,   // null means use phase default
  ): void {
    this.stopAnimatingGeneric(
      cancelled, forceSetToEnd,
      this.state.colorAnimation.currentPhaseIndex,
      'custom',
      'isAnimatingCustom',
    );
  }


  // **************************************************************
  // **************************************************************
  // Helper functions for quicker animation plans
  animateTo(
    transform: Transform,
    timeOrVelocity: number | Transform = 1,
    delay: number = 0,
    rotDirection: TypeRotationDirection = 0,
    callback: ?(?mixed) => void = null,
    easeFunction: (number) => number = tools.easeinout,
  ): void {
    this.animateTransformToWithDelay(
      transform, delay, timeOrVelocity, rotDirection,
      callback, true, easeFunction,
    );
  }

  animateFrom(
    transform: Transform,
    timeOrVelocity: number | Transform = 1,
    rotDirection: TypeRotationDirection = 0,
    callback: ?(boolean) => void = null,
    easeFunction: (number) => number = tools.easeinout,
  ): void {
    const target = this.transform._dup();
    this.animateTransformToWithDelay(
      target, 0, timeOrVelocity, rotDirection,
      callback, true, easeFunction,
    );
  }

  animateColorTo(
    color: Array<number>,
    time: number = 1,
    callback: ?(?boolean) => void = null,
    finishOnCancel: boolean = true,
    easeFunction: (number) => number = tools.linear,
  ): void {
    this.animateColorToWithDelay(
      color, 0, time, null, callback, finishOnCancel, easeFunction,
    );
  }

  animateTransformToWithDelay(
    targetTransform: Transform,
    delay: number = 0,
    timeOrVelocity: number | Transform = 1,
    rotDirection: TypeRotationDirection = 0,
    callback: ?(boolean) => void = null,
    finishOnCancel: boolean = true,
    easeFunction: (number) => number = tools.easeinout,
    addToExistingPlan: boolean = true,
    // translationPath: ?(Point, Point, number) => Point = null,
  ): void {
    const callbackToUse = checkCallback(callback);
    let moveTime = 0;
    if (timeOrVelocity instanceof Transform) {
      moveTime = getMaxTimeFromVelocity(
        this.transform,
        targetTransform,
        timeOrVelocity,
        rotDirection,
      );
    } else {
      moveTime = timeOrVelocity;
    }
    if (delay === 0 && moveTime === 0) {
      this.setTransform(targetTransform);
      callbackToUse(false);
      return;
    }

    let phaseDelay = null;
    let phaseMove = null;
    const phases = [];

    let delayCallback = null;
    let moveCallback = callbackToUse;
    if (moveTime === 0) {
      delayCallback = (cancelled: boolean) => {
        callbackToUse(cancelled);
      };
      moveCallback = null;
    }

    if (delay > 0) {
      let delayTransform = this.transform._dup();
      if (addToExistingPlan && this.animate.transform.plan.length > 0) {
        delayTransform = this.animate
          .transform.plan.slice(-1)[0].targetTransform._dup();
      }
      phaseDelay = new AnimationPhase(
        delayTransform, delayTransform, delay, rotDirection, delayCallback,
        finishOnCancel, tools.linear, this.animate.transform.translation.style,
        this.animate.transform.translation.options,
      );
      phases.push(phaseDelay);
    }

    if (moveTime > 0) {
      phaseMove = new AnimationPhase(
        null, targetTransform, timeOrVelocity, rotDirection, moveCallback,
        finishOnCancel, easeFunction, this.animate.transform.translation.style,
        this.animate.transform.translation.options,
      );
      phases.push(phaseMove);
    }

    if (phases.length > 0) {
      if (addToExistingPlan && this.state.isAnimating) {
        this.animate.transform.plan = [...this.animate.transform.plan, ...phases];
      } else {
        this.animatePlan(phases);
      }
    }
  }

  animateColorToWithDelay(
    color: Array<number>,
    delay: number,
    time: number = 1,
    disolve: 'in' | 'out' | null = null,
    callback: ?(boolean) => void = null,
    finishOnCancel: boolean = true,
    easeFunction: (number) => number = tools.linear,
    addToExistingPlan: boolean = true,
  ): void {
    const callbackToUse = checkCallback(callback);
    if (delay === 0 && time === 0) {
      this.setColor(color);
      callbackToUse(false);
      return;
    }

    let phaseDelay = null;
    let phaseColor = null;
    const phases = [];

    let delayCallback = null;
    let colorCallback = callbackToUse;
    if (time === 0) {
      delayCallback = (cancelled: boolean) => {
        if (!cancelled && finishOnCancel) {
          this.setColor(color);
        }
        callbackToUse(cancelled);
      };
      colorCallback = null;
    }
    if (delay > 0) {
      let delayColor = this.color.slice();
      if (addToExistingPlan && this.animate.color.plan.length > 0) {
        delayColor = this.animate.color.plan.slice(-1)[0].targetColor.slice();
      }
      let delayDisolve = null;
      if (disolve === 'in') {
        delayColor[3] = 0.01;
        delayDisolve = 'in';
      }
      phaseDelay = new ColorAnimationPhase(
        delayColor, delayColor, delay, delayDisolve, delayCallback,
        finishOnCancel, tools.linear,
      );
      phases.push(phaseDelay);
    }

    if (time > 0) {
      phaseColor = new ColorAnimationPhase(
        null, color, time, disolve, colorCallback,
        finishOnCancel, easeFunction,
      );
      phases.push(phaseColor);
    }

    if (phases.length > 0) {
      if (addToExistingPlan && this.state.isAnimatingColor) {
        this.animate.color.plan = [...this.animate.color.plan, ...phases];
      } else {
        this.animateColorPlan(phases);
      }
    }
  }

  disolveOutWithDelay(
    delay: number = 1,
    time: number = 1,
    callback: ?(boolean) => void = null,
  ): void {
    this.animateColorToWithDelay(
      this.color, delay, time, 'out', callback,
    );
  }

  disolveInWithDelay(
    delay: number = 1,
    time: number = 1,
    callback: ?(boolean) => void = null,
  ): void {
    this.animateColorToWithDelay(
      this.color, delay, time, 'in', callback,
    );
  }

  disolveWithDelay(
    delay: number = 1,
    time: number = 1,
    disolve: 'in' | 'out' = 'in',
    callback: ?(boolean) => void = null,
    finishOnCancel: boolean = true,
  ): void {
    this.animateColorToWithDelay(
      this.color, delay, time, disolve, callback, finishOnCancel,
    );
  }

  animateCustomTo(
    phaseCallback: (number) => void,
    time: number = 1,
    startPercent: number = 0,
    callback: ?(boolean) => void = null,
    easeFunction: (number) => number = tools.linear,
  ): void {
    this.animateCustomToWithDelay(
      0, phaseCallback, time, startPercent, callback,
      true, easeFunction, true,
    );
  }

  animateCustomToWithDelay(
    delay: number,
    phaseCallback: (number) => void,
    time: number = 1,
    startPercent: number = 0,
    callback: ?(boolean) => void = null,
    finishOnCancel: boolean = true,
    easeFunction: (number) => number = tools.easeinout,
    addToExistingPlan: boolean = true,
  ): void {
    const callbackToUse = checkCallback(callback);
    if (delay === 0 && time === 0) {
      phaseCallback(1);
      callbackToUse(false);
      return;
    }

    let phaseDelay = null;
    let phaseCustom = null;
    const phases = [];

    let delayCallback = null;
    let customCallback = callbackToUse;
    if (time === 0) {
      delayCallback = (cancelled: boolean) => {
        callbackToUse(cancelled);
      };
      customCallback = null;
    }

    if (delay > 0) {
      phaseDelay = new CustomAnimationPhase(
        () => {}, delay, 0, delayCallback,
        finishOnCancel, tools.linear,
      );
      phases.push(phaseDelay);
    }

    if (time > 0) {
      phaseCustom = new CustomAnimationPhase(
        phaseCallback, time, startPercent, customCallback,
        finishOnCancel, easeFunction,
      );
      phases.push(phaseCustom);
    }

    if (phases.length > 0) {
      if (addToExistingPlan && this.state.isAnimating) {
        this.animate.custom.plan = [...this.animate.custom.plan, ...phases];
      } else {
        this.animateCustomPlan(phases);
      }
    }

    // if (delay === 0 && time === 0) {
    //   if (callback != null) {
    //     callback();
    //   }
    //   return;
    // }
    // let timeToUse = time;
    // if (time === 0) {
    //   timeToUse = 0.0001;
    // }

    // const phaseDelay = new CustomAnimationPhase(() => {}, delay, 0, easeFunction);

    // const phaseMove = new CustomAnimationPhase(
    //   phaseCallback, timeToUse,
    //   startPercent, easeFunction,
    // );

    // if (delay === 0) {
    //   this.animateCustomPlan([phaseMove], checkCallback(callback));
    // } else {
    //   this.animateCustomPlan([phaseDelay, phaseMove], checkCallback(callback));
    // }
  }

  disolveIn(
    time: number = 1,
    callback: ?(boolean) => void = null,
  ): void {
    this.disolveInWithDelay(0, time, callback);
  }

  disolveOut(
    time: number = 1,
    callback: ?(boolean) => void = null,
  ): void {
    this.disolveOutWithDelay(0, time, callback);
  }

  // With update only first instace of translation in the transform order
  animateTranslationTo(
    translation: Point,
    time: number = 1,
    callback: ?(boolean) => void = null,
    easeFunction: (number) => number = tools.easeinout,
  ): void {
    const transform = this.transform._dup();
    transform.updateTranslation(translation);

    this.animateTransformToWithDelay(
      transform, 0, time, 0,
      callback, true, easeFunction,
    );
  }

  // With update only first instace of translation in the transform order
  animateScaleTo(
    scale: Point,
    time: number = 1,
    callback: ?(boolean) => void = null,
    easeFunction: (number) => number = tools.easeinout,
  ): void {
    const transform = this.transform._dup();
    transform.updateScale(scale);

    this.animateTransformToWithDelay(
      transform, 0, time, 0,
      callback, true, easeFunction,
    );
  }

  // Will update only first instace of translation in the transform order
  animateTranslationFrom(
    translation: Point,
    timeOrVelocity: number | Transform = 1,
    callback: ?(boolean) => void = null,
    easeFunction: (number) => number = tools.easeinout,
  ): void {
    const target = this.transform._dup();
    this.transform.updateTranslation(translation);
    this.animateTransformToWithDelay(
      target, 0, timeOrVelocity, 0,
      callback, true, easeFunction,
    );
    // this.animateTo(target, timeOrVelocity, 0, 0, callback, easeFunction);
  }

  animateTranslationToWithDelay(
    translation: Point,
    delay: number = 1,
    time: number = 1,
    callback: ?(boolean) => void = null,
    easeFunction: (number) => number = tools.easeinout,
  ): void {
    const transform = this.transform._dup();
    transform.updateTranslation(translation);
    this.animateTransformToWithDelay(
      transform, delay, time, 0,
      callback, true, easeFunction,
    );
  }

  // With update only first instace of rotation in the transform order
  animateRotationTo(
    rotation: number,
    rotDirection: TypeRotationDirection,
    timeOrVelocity: number | Transform = 1,
    callback: ?(boolean) => void = null,
    easeFunction: (number) => number = tools.easeinout,
  ): void {
    const transform = this.transform._dup();
    transform.updateRotation(rotation);
    this.animateTransformToWithDelay(
      transform, 0, timeOrVelocity, rotDirection,
      callback, true, easeFunction,
    );
  }

  // With update only first instace of rotation in the transform order
  animateTranslationAndRotationTo(
    translation: Point,
    rotation: number,
    rotDirection: TypeRotationDirection,
    time: number = 1,
    callback: ?(boolean) => void = null,
    easeFunction: (number) => number = tools.easeinout,
  ): void {
    const transform = this.transform._dup();
    transform.updateRotation(rotation);
    transform.updateTranslation(translation._dup());
    this.animateTransformToWithDelay(
      transform, 0, time, rotDirection,
      callback, true, easeFunction,
    );
  }

  animateTranslationAndScaleTo(
    translation: Point,
    scale: Point | number,
    time: number = 1,
    callback: ?(boolean) => void = null,
    easeFunction: (number) => number = tools.easeinout,
  ): void {
    const transform = this.transform._dup();
    if (typeof scale === 'number') {
      transform.updateScale(scale, scale);
    } else {
      transform.updateScale(scale._dup());
    }

    transform.updateTranslation(translation._dup());
    this.animateTransformToWithDelay(
      transform, 0, time, 0,
      callback, true, easeFunction,
    );
  }
  // **************************************************************
  // **************************************************************


  // Being Moved
  startBeingMoved(): void {
    this.stopAnimating();
    this.stopMovingFreely();
    this.state.movement.velocity = this.transform.zero();
    this.state.movement.previousTransform = this.transform._dup();
    this.state.movement.previousTime = Date.now() / 1000;
    this.state.isBeingMoved = true;
  }

  moved(newTransform: Transform): void {
    this.calcVelocity(newTransform);
    this.setTransform(newTransform._dup());
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

  calcVelocity(newTransform: Transform): void {
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
  startMovingFreely(callback: ?(boolean) => void = null): void {
    this.stopAnimating();
    this.stopBeingMoved();
    if (callback) {
      this.animate.transform.callback = callback;
    }
    this.state.isMovingFreely = true;
    this.state.movement.previousTime = -1;
    this.state.movement.velocity = this.state.movement.velocity.clipMag(
      this.move.freely.zeroVelocityThreshold,
      this.move.maxVelocity,
    );
  }

  stopMovingFreely(result: boolean = true): void {
    this.state.isMovingFreely = false;
    this.state.movement.previousTime = -1;
    if (this.animate.transform.callback) {
      this.animate.transform.callback(result);
      // if (result !== null && result !== undefined) {
      //   this.animate.transform.callback(result);
      // } else {
      //   this.animate.transform.callback();
      // }
      this.animate.transform.callback = null;
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
  transformWithPulse(now: number, transform: Transform): Array<Transform> {
    const pulseTransforms = [];    // To output list of transform matrices

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
        // this.state.isPulsing = false;
        this.stopPulsing(true);
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
        // if(this.name === '_radius') {
        // }
        // Transform the current transformMatrix by the pulse transform matrix
        // const pMatrix = m2.mul(m2.copy(transform), pTransform.matrix());

        // Push the pulse transformed matrix to the array of pulse matrices
        pulseTransforms.push(transform.transform(pTransform));
      }
    // If not pulsing, then make no changes to the transformMatrix.
    } else {
      pulseTransforms.push(transform._dup());
    }
    return pulseTransforms;
  }

  pulseScaleNow(
    time: number, scale: number,
    frequency: number = 0, callback: ?(?mixed) => void = null,
  ) {
    this.pulse.time = time;
    if (frequency === 0 && time === 0) {
      this.pulse.frequency = 1;
    }
    if (frequency !== 0) {
      this.pulse.frequency = frequency;
    }
    if (time !== 0 && frequency === 0) {
      this.pulse.frequency = 1 / (time * 2);
    }

    this.pulse.A = 1;
    this.pulse.B = scale - 1;
    this.pulse.C = 0;
    this.pulse.num = 1;
    this.pulse.callback = callback;
    this.pulseNow();
  }

  pulseThickNow(
    time: number, scale: number,
    num: number = 3, callback: ?(?mixed) => void = null,
  ) {
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
    this.pulse.callback = callback;
    this.pulseNow();
  }

  pulseNow() {
    this.state.isPulsing = true;
    this.state.pulse.startTime = -1;
  }

  stopPulsing(result: ?mixed) {
    this.state.isPulsing = false;
    if (this.pulse.callback) {
      const { callback } = this.pulse;
      this.pulse.callback = null;
      callback(result);
    }
  }

  stop(cancelled: boolean = true, forceSetToEndOfPlan: boolean = false) {
    this.stopAnimating(cancelled, forceSetToEndOfPlan);
    this.stopAnimatingColor(cancelled, forceSetToEndOfPlan);
    this.stopAnimatingCustom(cancelled, forceSetToEndOfPlan);
    this.stopMovingFreely(cancelled);
    this.stopBeingMoved();
    this.stopPulsing(cancelled);
  }

  updateLimits(limits: Rect) {
    this.diagramLimits = limits;
  }

  // eslint-disable-next-line class-methods-use-this
  getGLBoundingRect() {
    return new Rect(0, 0, 1, 1);
  }

  getDiagramBoundingRect() {
    const gl = this.getGLBoundingRect();
    const glToDiagramScale = new Point(
      this.diagramLimits.width / 2,
      this.diagramLimits.height / 2,
    );
    return new Rect(
      gl.left * glToDiagramScale.x,
      gl.bottom * glToDiagramScale.y,
      gl.width * glToDiagramScale.x,
      gl.height * glToDiagramScale.y,
    );
  }

  // eslint-disable-next-line class-methods-use-this
  getRelativeGLBoundingRect() {
    return new Rect(0, 0, 1, 1);
  }

  getRelativeDiagramBoundingRect() {
    const gl = this.getRelativeGLBoundingRect();
    const glToDiagramScale = new Point(
      this.diagramLimits.width / 2,
      this.diagramLimits.height / 2,
    );
    return new Rect(
      gl.left * glToDiagramScale.x,
      gl.bottom * glToDiagramScale.y,
      gl.width * glToDiagramScale.x,
      gl.height * glToDiagramScale.y,
    );
  }

  getCenterDiagramPosition() {
    const rect = this.getDiagramBoundingRect();
    return new Point(
      rect.left + rect.width / 2,
      rect.bottom + rect.height / 2,
    );
  }

  getPosition() {
    const t = this.transform.t();
    let position = new Point(0, 0);
    if (t != null) {
      position = t._dup();
    }
    return position;
  }

  getVertexSpaceDiagramPosition(vertexSpacePoint: Point) {
    const location = vertexSpacePoint.transformBy(this.lastDrawTransform.matrix());
    const glSpace = {
      x: { bottomLeft: -1, width: 2 },
      y: { bottomLeft: -1, height: 2 },
    };
    const diagramSpace = {
      x: {
        bottomLeft: this.diagramLimits.left,
        width: this.diagramLimits.width,
      },
      y: {
        bottomLeft: this.diagramLimits.bottom,
        height: this.diagramLimits.height,
      },
    };
    const glToDiagramSpace = spaceToSpaceTransform(glSpace, diagramSpace);
    return location.transformBy(glToDiagramSpace.matrix());
  }

  getDiagramPosition() {
    // console.log(this.name, this.getVertexSpaceDiagramPosition(new Point(0, 0)))
    // console.log(this.transform, this.lastDrawTransform)
    return this.getVertexSpaceDiagramPosition(new Point(0, 0));
    // const location = new Point(0, 0).transformBy(this.lastDrawTransform.matrix());
    // const glSpace = {
    //   x: { bottomLeft: -1, width: 2 },
    //   y: { bottomLeft: -1, height: 2 },
    // };
    // const diagramSpace = {
    //   x: {
    //     bottomLeft: this.diagramLimits.left,
    //     width: this.diagramLimits.width,
    //   },
    //   y: {
    //     bottomLeft: this.diagramLimits.bottom,
    //     height: this.diagramLimits.height,
    //   },
    // };
    // const glToDiagramSpace = spaceToSpaceTransform(glSpace, diagramSpace);
    // return location.transformBy(glToDiagramSpace.matrix());
  }

  setDiagramPosition(diagramPosition: Point) {
    const glSpace = {
      x: { bottomLeft: -1, width: 2 },
      y: { bottomLeft: -1, height: 2 },
    };
    const diagramSpace = {
      x: {
        bottomLeft: this.diagramLimits.left,
        width: this.diagramLimits.width,
      },
      y: {
        bottomLeft: this.diagramLimits.bottom,
        height: this.diagramLimits.height,
      },
    };
    const diagramToGLSpace = spaceToSpaceTransform(diagramSpace, glSpace);
    const glLocation = diagramPosition.transformBy(diagramToGLSpace.matrix());
    const t = new Transform(this.lastDrawTransform.order.slice(2));
    const newLocation = glLocation.transformBy(m2.inverse(t.matrix()));
    this.setPosition(newLocation._dup());
  }

  setDiagramPositionToElement(element: DiagramElement) {
    const p = element.getDiagramPosition();
    this.setDiagramPosition(p._dup());
  }

  setPositionToElement(element: DiagramElement) {
    const p = element.transform.t();
    if (p != null) {
      this.setPosition(p._dup());
    }
  }

  setMoveBoundaryToDiagram(
    boundary: Array<number> = [
      this.diagramLimits.left,
      this.diagramLimits.top - this.diagramLimits.height,
      this.diagramLimits.left + this.diagramLimits.width,
      this.diagramLimits.top],
    scale: Point = new Point(1, 1),
  ): void {
    if (!this.isMovable) {
      return;
    }
    if (!this.move.limitToDiagram) {
      return;
    }
    const glSpace = {
      x: { bottomLeft: -1, width: 2 },
      y: { bottomLeft: -1, height: 2 },
    };
    const diagramSpace = {
      x: {
        bottomLeft: this.diagramLimits.left,
        width: this.diagramLimits.width,
      },
      y: {
        bottomLeft: this.diagramLimits.bottom,
        height: this.diagramLimits.height,
      },
    };
    const glToDiagramSpace = spaceToSpaceTransform(glSpace, diagramSpace);

    const rect = this.getRelativeGLBoundingRect();
    const glToDiagramScaleMatrix = [
      glToDiagramSpace.matrix()[0], 0, 0,
      0, glToDiagramSpace.matrix()[4], 0,
      0, 0, 1];

    const minPoint = new Point(rect.left, rect.bottom).transformBy(glToDiagramScaleMatrix);
    const maxPoint = new Point(rect.right, rect.top).transformBy(glToDiagramScaleMatrix);

    const min = new Point(0, 0);
    const max = new Point(0, 0);

    min.x = boundary[0] - minPoint.x * scale.x;
    min.y = boundary[1] - minPoint.y * scale.y;
    max.x = boundary[2] - maxPoint.x * scale.x;
    max.y = boundary[3] - maxPoint.y * scale.y;

    this.move.maxTransform.updateTranslation(
      max.x,
      max.y,
    );
    this.move.minTransform.updateTranslation(
      min.x,
      min.y,
    );
  }

  show(): void {
    this.isShown = true;
  }

  showAll(): void {
    this.show();
  }

  hide(): void {
    this.isShown = false;
  }

  hideAll(): void {
    this.hide();
  }

  toggleShow(): void {
    if (this.isShown) {
      this.hide();
    } else {
      this.show();
    }
  }

  click(): void {
    if (this.onClick !== null && this.onClick !== undefined) {
      this.onClick(this);
    }
  }

  setMovable(movable: boolean = true) {
    if (movable) {
      this.isTouchable = true;
      this.isMovable = true;
    }
  }

  // processParentTransform(parentTransform: Transform): Transform {
  //   let newTransform;
  //   if (this.noRotationFromParent) {
  //     const finalParentTransform = parentTransform._dup();
  //     let r = 0;
  //     for (let i = 0; i < finalParentTransform.order.length; i += 1) {
  //       const t = finalParentTransform.order[i];
  //       if (t instanceof Rotation) {
  //         r += t.r;
  //       }
  //     }

  //     const m = parentTransform.matrix();
  //     const translation = new Point(m[2], m[5]);
  //     const scale = new Point(
  //       new Point(m[0], m[3]).distance(),
  //       new Point(m[1], m[4]).distance(),
  //     );
  //     newTransform = new Transform()
  //       .scale(scale)
  //       // .rotate(r)
  //       .translate(translation);
  //   } else {
  //     newTransform = parentTransform;
  //   }
  //   return newTransform;
  // }
}

// ***************************************************************
// Geometry Object
// ***************************************************************
class DiagramElementPrimative extends DiagramElement {
  drawingObject: DrawingObject;
  color: Array<number>;
  pointsToDraw: number;
  angleToDraw: number;
  lengthToDraw: number;
  cannotTouchHole: boolean;

  constructor(
    drawingObject: DrawingObject,
    transform: Transform = new Transform(),
    color: Array<number> = [0.5, 0.5, 0.5, 1],
    diagramLimits: Rect = new Rect(-1, -1, 2, 2),
  ) {
    super(transform, diagramLimits);
    this.drawingObject = drawingObject;
    this.color = color.slice();
    this.pointsToDraw = -1;
    this.angleToDraw = -1;
    this.lengthToDraw = -1;
    this.cannotTouchHole = false;
    // this.setMoveBoundaryToDiagram();
  }

  isBeingTouched(glLocation: Point): boolean {
    if (!this.isTouchable) {
      return false;
    }
    const boundaries =
      this.drawingObject.getGLBoundaries(this.lastDrawTransform.matrix());
    const holeBoundaries =
      this.drawingObject.getGLBoundaryHoles(this.lastDrawTransform.matrix());
    for (let i = 0; i < boundaries.length; i += 1) {
      const boundary = boundaries[i];
      if (glLocation.isInPolygon(boundary)) {
        let isTouched = true;
        if (this.cannotTouchHole) {
          for (let j = 0; j < holeBoundaries.length; j += 1) {
            const holeBoundary = holeBoundaries[j];
            if (glLocation.isInPolygon(holeBoundary)) {
              isTouched = false;
              j = holeBoundaries.length;
            }
          }
        }
        if (isTouched) {
          return true;
        }
      }
    }
    return false;
  }

  _dup(transform: Transform | null = null) {
    // const vertices = this.drawingObject._dup();
    const primative = new DiagramElementPrimative(this.drawingObject._dup());
    // const primative = new DiagramElementPrimative(
    //   vertices,
    //   transform,
    //   color,
    //   this.diagramLimits._dup(),
    // );
    // primative.pointsToDraw = this.pointsToDraw;
    // primative.angleToDraw = this.angleToDraw;
    // primative.copyFrom(this);
    duplicateFromTo(this, primative);
    if (transform != null) {
      primative.transform = transform._dup();
    }
    return primative;
  }

  setColor(color: Array<number>) {
    this.color = color.slice();
    if (this instanceof DiagramElementPrimative) {
      if (this.drawingObject instanceof TextObject) {
        this.drawingObject.setColor(this.color);
      }
      if (this.drawingObject instanceof HTMLObject) {
        // $FlowFixMe
        this.drawingObject.element.style.color = colorArrayToRGBA(this.color);
      }
    }
  }

  show() {
    super.show();
    if (this.drawingObject instanceof HTMLObject) {
      this.drawingObject.show = true;
      this.drawingObject.transformHtml(this.lastDrawTransform.matrix());
    }
  }

  // showAll() {
  //   this.show();
  // }

  hide() {
    super.hide();
    if (this.drawingObject instanceof HTMLObject) {
      this.drawingObject.show = false;
      this.drawingObject.transformHtml(this.lastDrawTransform.matrix());
    }
  }

  // hideAll() {
  //   this.hide();
  // }

  getTouched(glLocation: Point): Array<DiagramElementPrimative> {
    if (!this.isTouchable) {
      return [];
    }
    if (this.isBeingTouched(glLocation)) {
      return [this];
    }
    return [];
  }

  setFont(fontSize: number) {
    if (this.drawingObject instanceof TextObject) {
      this.drawingObject.setFont(fontSize);
    }
  }

  resizeHtmlObject() {
    if (this.drawingObject instanceof HTMLObject) {
      this.drawingObject.transformHtml(this.lastDrawTransform.matrix());
    }
  }

  draw(parentTransform: Transform = new Transform(), now: number = 0) {
    if (this.isShown) {
      this.setNextTransform(now);
      this.setNextColor(now);
      // set next color can end up hiding an element when disolving out
      if (!this.isShown) {
        return;
      }
      this.setNextCustomAnimation(now);
      // this.lastDrawParentTransform = parentTransform._dup();
      this.lastDrawElementTransformPosition = {
        parentCount: parentTransform.order.length,
        elementCount: this.transform.order.length,
      };

      // const finalParentTransform = this.processParentTransform(parentTransform);
      const newTransform = parentTransform.transform(this.transform);
      const pulseTransforms = this.transformWithPulse(now, newTransform);

      // let matrix = m2.mul(transformMatrix, this.transform.matrix());
      // matrix = this.transformWithPulse(now, matrix);

      // eslint-disable-next-line prefer-destructuring
      this.lastDrawTransform = pulseTransforms[0];
      // this.lastDrawPulseTransform = pulseTransforms[0]._dup();

      let pointCount = -1;
      if (this.drawingObject instanceof VertexObject) {
        pointCount = this.drawingObject.numPoints;
        if (this.angleToDraw !== -1) {
          pointCount = this.drawingObject.getPointCountForAngle(this.angleToDraw);
        }
        if (this.lengthToDraw !== -1) {
          pointCount = this.drawingObject.getPointCountForLength(this.lengthToDraw);
        }
        if (this.pointsToDraw !== -1) {
          pointCount = this.pointsToDraw;
        }
      }
      pulseTransforms.forEach((t) => {
        this.drawingObject.drawWithTransformMatrix(t.matrix(), this.color, pointCount);
      });
    }
  }

  setFirstTransform(parentTransform: Transform = new Transform()) {
    this.lastDrawElementTransformPosition = {
      parentCount: parentTransform.order.length,
      elementCount: this.transform.order.length,
    };
    // const finalParentTransform = this.processParentTransform(parentTransform);
    const firstTransform = parentTransform.transform(this.transform);
    this.lastDrawTransform = firstTransform;

    if (this.drawingObject instanceof HTMLObject) {
      this.drawingObject.transformHtml(firstTransform.matrix());
    }
    this.setMoveBoundaryToDiagram();
  }

  isMoving(): boolean {
    if (this.state.isAnimating
      || this.state.isMovingFreely
      || this.state.isBeingMoved
      || this.state.isPulsing
      || this.state.isAnimatingColor
      || this.state.isAnimatingCustom
    ) {
      return true;
    }
    return false;
  }

  // // Update the translation move boundary for the element's transform.
  // // This will limit the first translation part of the transform to only
  // // translations within the max/min limit.
  // updateMoveTranslationBoundary(
  //   bounday: Array<number> = [
  //     this.diagramLimits.left,
  //     this.diagramLimits.top - this.diagramLimits.height,
  //     this.diagramLimits.left + this.diagramLimits.width,
  //     this.diagramLimits.top],
  //   scale: Point = new Point(1, 1),
  // ): void {
  //   const glSpace = {
  //     x: { bottomLeft: -1, width: 2 },
  //     y: { bottomLeft: -1, height: 2 },
  //   };
  //   const diagramSpace = {
  //     x: {
  //       bottomLeft: this.diagramLimits.left,
  //       width: this.diagramLimits.width,
  //     },
  //     y: {
  //       bottomLeft: this.diagramLimits.bottom,
  //       height: this.diagramLimits.height,
  //     },
  //   };

  //   const glToDiagramSpace = spaceToSpaceTransform(glSpace, diagramSpace);

  //   const rect = this.drawingObject.getRelativeGLBoundingRect(this.lastDrawTransform.matrix());

  //   const minPoint = new Point(rect.left, rect.bottom).transformBy(glToDiagramSpace.matrix());
  //   const maxPoint = new Point(rect.right, rect.top).transformBy(glToDiagramSpace.matrix());

  //   const min = new Point(0, 0);
  //   const max = new Point(0, 0);

  //   min.x = bounday[0] - minPoint.x * scale.x;
  //   min.y = bounday[1] - minPoint.y * scale.y;
  //   max.x = bounday[2] - maxPoint.x * scale.x;
  //   max.y = bounday[3] - maxPoint.y * scale.y;

  //   this.move.maxTransform.updateTranslation(
  //     max.x,
  //     max.y,
  //   );
  //   this.move.minTransform.updateTranslation(
  //     min.x,
  //     min.y,
  //   );
  // }

  getGLBoundaries() {
    return this.drawingObject.getGLBoundaries(this.lastDrawTransform.matrix());
  }

  getVertexSpaceBoundaries() {
    return this.drawingObject.border;
  }

  getGLBoundingRect() {
    return this.drawingObject.getGLBoundingRect(this.lastDrawTransform.matrix());
  }

  getVertexSpaceBoundingRect() {
    return this.drawingObject.getVertexSpaceBoundingRect();
  }

  getRelativeGLBoundingRect(): Rect {
    return this.drawingObject.getRelativeGLBoundingRect(this.lastDrawTransform.matrix());
  }

  getRelativeVertexSpaceBoundingRect(): Rect {
    return this.drawingObject.getRelativeVertexSpaceBoundingRect();
  }
}

// ***************************************************************
// Collection of Geometry Objects or Collections
// ***************************************************************
class DiagramElementCollection extends DiagramElement {
  elements: Object;
  order: Array<string>;
  touchInBoundingRect: boolean;
  eqns: Object;
  // biasTransform: Array<number>;

  constructor(
    transform: Transform = new Transform(),
    diagramLimits: Rect = new Rect(-1, 1, 2, 2),
  ): void {
    super(transform, diagramLimits);
    this.elements = {};
    this.order = [];
    this.touchInBoundingRect = false;
    this.eqns = {};
  }

  _dup() {
    const collection = new DiagramElementCollection(
      // transform,
      // diagramLimits,
    );
    // collection.touchInBoundingRect = this.touchInBoundingRect;
    // collection.copyFrom(this);
    const doNotDuplicate = this.order.map(e => `_${e}`);
    duplicateFromTo(this, collection, ['elements', 'order', ...doNotDuplicate]);
    for (let i = 0; i < this.order.length; i += 1) {
      const name = this.order[i];
      collection.add(name, this.elements[name]._dup());
    }

    return collection;
  }

  isMoving(): boolean {
    if (this.isShown === false) {
      return false;
    }
    if (this.state.isAnimating
        || this.state.isAnimatingCustom
        || this.state.isAnimatingColor
        || this.state.isMovingFreely
        || this.state.isBeingMoved
        || this.state.isPulsing) {
      return true;
    }
    for (let i = 0; i < this.order.length; i += 1) {
      const element = this.elements[this.order[i]];
      if (element instanceof DiagramElementCollection) {
        if (element.isMoving()) {
          return true;
        }
      } else if (element.isShown && element.color[3] > 0 && element.isMoving()) {
        return true;
      }
    }
    return false;
  }

  add(
    name: string,
    diagramElement: DiagramElementPrimative | DiagramElementCollection,
    index: number = -1,
  ) {
    this.elements[name] = diagramElement;
    this.elements[name].name = name;
    // $FlowFixMe
    this[`_${name}`] = this.elements[name];
    if (index !== -1) {
      this.order = [
        ...this.order.slice(0, index),
        name,
        ...this.order.slice(index),
      ];
    } else {
      this.order.push(name);
    }
  }

  draw(parentTransform: Transform = new Transform(), now: number = 0) {
    if (this.isShown) {
      this.setNextTransform(now);
      this.setNextColor(now);
      // set next color can end up hiding an element when disolving out
      if (!this.isShown) {
        return;
      }
      this.setNextCustomAnimation(now);
      // this.lastDrawParentTransform = parentTransform._dup();
      // this.lastDrawElementTransform = this.transform._dup();
      this.lastDrawElementTransformPosition = {
        parentCount: parentTransform.order.length,
        elementCount: this.transform.order.length,
      };
      // const finalParentTransform = this.processParentTransform(parentTransform);
      const newTransform = parentTransform.transform(this.transform);
      const pulseTransforms = this.transformWithPulse(now, newTransform);

      // eslint-disable-next-line prefer-destructuring
      this.lastDrawTransform = pulseTransforms[0];
      // this.lastDrawPulseTransform = pulseTransforms[0]._dup();

      for (let k = 0; k < pulseTransforms.length; k += 1) {
        for (let i = 0, j = this.order.length; i < j; i += 1) {
          this.elements[this.order[i]].draw(pulseTransforms[k], now);
        }
      }
    }
  }

  show(listToShow: Array<DiagramElementPrimative | DiagramElementCollection> = []): void {
    super.show();
    listToShow.forEach((element) => {
      if (element instanceof DiagramElementCollection) {
        element.showAll();
      } else {
        element.show();
      }
    });
  }

  hide(listToShow: Array<DiagramElementPrimative | DiagramElementCollection> = []): void {
    super.hide();
    listToShow.forEach((element) => {
      if (element instanceof DiagramElementCollection) {
        element.hideAll();
      } else {
        element.show();
      }
    });
  }

  showAll(): void {
    this.show();
    for (let i = 0, j = this.order.length; i < j; i += 1) {
      const element = this.elements[this.order[i]];
      element.show();
      if (typeof element.hideAll === 'function') {
        element.showAll();
      }
    }
  }

  hideAll(): void {
    this.hide();
    for (let i = 0, j = this.order.length; i < j; i += 1) {
      const element = this.elements[this.order[i]];
      element.hide();
      if (typeof element.hideAll === 'function') {
        element.hideAll();
      }
    }
  }

  showOnly(listToShow: Array<DiagramElementPrimative | DiagramElementCollection>): void {
    this.hideAll();
    this.show();
    for (let i = 0, j = listToShow.length; i < j; i += 1) {
      const element = listToShow[i];
      if (element) {
        element.show();
      } else {
        throw Error(`Diagram Element Error: Element does not exist at position ${i}`);
      }
    }
  }

  hideOnly(listToHide: Array<DiagramElementPrimative | DiagramElementCollection>): void {
    this.showAll();
    for (let i = 0, j = listToHide.length; i < j; i += 1) {
      const element = listToHide[i];
      element.hide();
    }
  }

  // This will only search elements within the collection for a touch
  // if the collection is touchable. Note, the elements can be queried
  // directly still, and will return if they are touched if they themselves
  // are touchable.
  isBeingTouched(glLocation: Point) {
    if (!this.isTouchable) {
      return false;
    }
    if (this.touchInBoundingRect) {
      const boundingRect = this.getGLBoundingRect();
      if (glLocation.x >= boundingRect.left
        && glLocation.x <= boundingRect.right
        && glLocation.y <= boundingRect.top
        && glLocation.y >= boundingRect.bottom
      ) {
        return true;
      }
    }
    for (let i = 0, j = this.order.length; i < j; i += 1) {
      const element = this.elements[this.order[i]];
      if (element.isShown === true) {
        if (element.isBeingTouched(glLocation)) {
          return true;
        }
      }
    }
    return false;
  }

  resizeHtmlObject() {
    for (let i = 0; i < this.order.length; i += 1) {
      const element = this.elements[this.order[i]];
      element.resizeHtmlObject();
    }
  }

  setFirstTransform(parentTransform: Transform = new Transform()) {
    // const finalParentTransform = this.processParentTransform(parentTransform);
    const firstTransform = parentTransform.transform(this.transform);
    this.lastDrawTransform = firstTransform;

    for (let i = 0; i < this.order.length; i += 1) {
      const element = this.elements[this.order[i]];
      element.setFirstTransform(firstTransform);
    }
    this.setMoveBoundaryToDiagram();
  }

  getGLBoundaries() {
    let boundaries = [];
    for (let i = 0; i < this.order.length; i += 1) {
      const element = this.elements[this.order[i]];
      if (element.isShown) {
        const elementBoundaries = element.getGLBoundaries();
        boundaries = boundaries.concat(elementBoundaries);
      }
    }
    return boundaries;
  }

  getVertexSpaceBoundaries() {
    let boundaries = [];
    for (let i = 0; i < this.order.length; i += 1) {
      const element = this.elements[this.order[i]];
      if (element.isShown) {
        const elementBoundaries = element.getVertexSpaceBoundaries();
        boundaries = boundaries.concat(elementBoundaries);
      }
    }
    return boundaries;
  }

  getGLBoundingRect() {
    const glAbsoluteBoundaries = this.getGLBoundaries();
    return getBoundingRect(glAbsoluteBoundaries);
  }

  getVertexSpaceBoundingRect() {
    const boundaries = this.getVertexSpaceBoundaries();
    return getBoundingRect(boundaries);
  }

  getRelativeGLBoundingRect() {
    const boundingRect = this.getGLBoundingRect();

    const location = new Point(0, 0).transformBy(this.lastDrawTransform.matrix());

    return new Rect(
      boundingRect.left - location.x,
      boundingRect.bottom - location.y,
      boundingRect.width,
      boundingRect.height,
    );
  }

  getRelativeVertexSpaceBoundingRect(): Rect {
    const boundingRect = this.getVertexSpaceBoundingRect();

    const location = new Point(0, 0);

    return new Rect(
      boundingRect.left - location.x,
      boundingRect.bottom - location.y,
      boundingRect.width,
      boundingRect.height,
    );
  }

  updateLimits(limits: Rect) {
    for (let i = 0; i < this.order.length; i += 1) {
      const element = this.elements[this.order[i]];
      element.updateLimits(limits);
    }
    this.diagramLimits = limits;
  }

  // Returns an array of touched elements.
  // In a collection, elements defined later in the collection.order
  // array are on top of earlier elements. The touched array
  // is sorted to have elements on top first, where the collection containing
  // the elements will be before it's elements. For example, the array
  // would be ordered as:
  //  0: top collection
  //  1 to n: n top elements in collection
  //  n+1: second top collection
  //  n+2 to m: top elements in second top colleciton.
  getTouched(glLocation: Point): Array<DiagramElementPrimative | DiagramElementCollection> {
    if (!this.isTouchable && !this.hasTouchableElements) {
      return [];
    }
    let touched = [];
    if (this.touchInBoundingRect || this.isTouchable) {
      if (this.isBeingTouched(glLocation)) {
        touched.push(this);
      }
    }
    for (let i = this.order.length - 1; i >= 0; i -= 1) {
      const element = this.elements[this.order[i]];
      if (element.isShown === true) {
        touched = touched.concat(element.getTouched(glLocation));
      }

      // If there is an element that is touched, then this collection should
      // also be touched.
      // if (touched.length > 0 && this.isTouchable) {
      //   touched = [this].concat(touched);
      // }
    }
    return touched;
  }

  stop(cancelled: boolean = true, forceSetToEndOfPlan: boolean = false) {
    super.stop(cancelled, forceSetToEndOfPlan);
    for (let i = 0; i < this.order.length; i += 1) {
      const element = this.elements[this.order[i]];
      element.stop(cancelled, forceSetToEndOfPlan);
    }
  }

  setFont(fontSize: number) {
    for (let i = 0; i < this.order.length; i += 1) {
      const element = this.elements[this.order[i]];
      element.setFont(fontSize);
    }
  }

  setColor(color: Array<number>) {
    for (let i = 0; i < this.order.length; i += 1) {
      const element = this.elements[this.order[i]];
      element.setColor(color);
    }
    this.color = color.slice();
  }

  getElementTransforms() {
    const out = {};
    for (let i = 0; i < this.order.length; i += 1) {
      const element = this.elements[this.order[i]];
      out[element.name] = element.transform._dup();
    }
    return out;
  }

  setElementTransforms(elementTransforms: Object) {
    for (let i = 0; i < this.order.length; i += 1) {
      const element = this.elements[this.order[i]];
      if (element.name in elementTransforms) {
        element.transform = elementTransforms[element.name];
      }
    }
  }

  animateToTransforms(
    elementTransforms: Object,
    time: number = 1,
    delay: number = 0,
    rotDirection: number = 0,
    callback: ?(?mixed) => void = null,
    easeFunction: (number) => number = tools.easeinout,
    // translationPath: (Point, Point, number) => Point = linearPath,
  ) {
    let callbackMethod = callback;
    let timeToAnimate = 0;
    for (let i = 0; i < this.order.length; i += 1) {
      const element = this.elements[this.order[i]];
      if (element.name in elementTransforms) {
        if (element.isShown) {
          if (!elementTransforms[element.name].isEqualTo(element.transform)) {
            element.animateTo(
              elementTransforms[element.name],
              time,
              delay,
              rotDirection,
              callbackMethod,
              easeFunction,
            );
            // only want to send callback once
            callbackMethod = null;
            timeToAnimate = time + delay;
          }
        } else {
          element.transform = elementTransforms[element.name]._dup();
        }
      }
    }
    if (timeToAnimate === 0 && callbackMethod != null) {
      callbackMethod(true);
    }
    return timeToAnimate;
  }

  getAllPrimatives() {
    let elements = [];
    for (let i = 0; i < this.order.length; i += 1) {
      const element = this.elements[this.order[i]];
      if (element instanceof DiagramElementCollection) {
        elements = [...elements, ...element.getAllElements()];
      } else {
        elements.push(element);
      }
    }
    return elements;
  }

  getAllElements() {
    const elements = [];
    for (let i = 0; i < this.order.length; i += 1) {
      const element = this.elements[this.order[i]];
      elements.push(element);
    }
    return elements;
  }

  // Get all ineractive elemnts, but only go as deep as a
  // DiagramElementColleciton if it is touchable or movable
  getAllCurrentlyInteractiveElements() {
    let elements = [];
    for (let i = 0; i < this.order.length; i += 1) {
      const element = this.elements[this.order[i]];
      // if (element.isShown) {
      if (element instanceof DiagramElementCollection) {
        if (!element.isTouchable && !element.isMovable
          && element.hasTouchableElements && !element.isInteractive
        ) {
          elements = [...elements, ...element.getAllCurrentlyInteractiveElements()];
        }
      }
      if (element.isTouchable || element.isMovable || element.isInteractive) {
        elements.push(element);
      }
      // }
    }
    return elements;
  }


  // disolveWithDelay(
  //   delay: number = 1,
  //   time: number = 1,
  //   disolve: 'in' | 'out' = 'in',
  //   callback: ?(boolean) => void = null,
  // ): void {
  //   for (let i = 0; i < this.order.length; i += 1) {
  //     const element = this.elements[this.order[i]];
  //     console.log(element.name)
  //     element.disolveWithDelay(delay, time, disolve, callback);
  //   }
  // }

  // // deprecate
  // disolveElementsOut(
  //   time: number = 1,
  //   callback: ?(boolean) => void = null,
  // ): void {
  //   for (let i = 0; i < this.order.length; i += 1) {
  //     const element = this.elements[this.order[i]];
  //     if (element instanceof DiagramElementCollection) {
  //       element.disolveElementsOut(time, callback);
  //     } else {
  //       element.disolveOut(time, callback);
  //     }
  //   }
  // }

  // // deprecate
  // disolveElementsIn(
  //   time: number = 1,
  //   callback: ?(boolean) => void = null,
  // ): void {
  //   for (let i = 0; i < this.order.length; i += 1) {
  //     const element = this.elements[this.order[i]];
  //     if (element instanceof DiagramElementCollection) {
  //       element.disolveElementsIn(time, callback);
  //     } else {
  //       element.disolveIn(time, callback);
  //     }
  //   }
  // }

  // This method is here as a convenience method for content item selectors
  // eslint-disable-next-line class-methods-use-this
  goToStep(step: number) {
    const elem = document.getElementById('id__lesson_item_selector_0');
    const elems = [];
    if (elem != null) {
      if (elem.children.length > 0) {
        for (let i = 0; i < elem.children.length; i += 1) {
          elems.push(elem.children[i]);
        }
      }
    }
    elems.forEach((e, index) => {
      if (index === step) {
        e.classList.add('lesson__item_selector_selected');
      } else {
        e.classList.remove('lesson__item_selector_selected');
      }
    });
  }

  setMovable(movable: boolean = true) {
    if (movable) {
      this.hasTouchableElements = true;
      this.isMovable = true;
    }
  }
}

export {
  DiagramElementPrimative, DiagramElementCollection,
  DiagramElement,
};
