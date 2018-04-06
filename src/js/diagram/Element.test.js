import {
  DiagramElementPrimative,
  DiagramElementCollection,
  AnimationPhase,
} from './Element';
import { Point, Transform } from './g2';
import webgl from '../__mocks__/WebGLInstanceMock';
import Polygon from './vertexObjects/Polygon';
import { linear, round } from './mathtools';
import * as m2 from './m2';

describe('Animationa and Movement', () => {
  describe('DiagramElementPrimative', () => {
    describe('Setup', () => {
      test('Instantiation', () => {
        const square = new Polygon(webgl, 1, 4, 4, 0.01, 0, Point.zero());
        const element = new DiagramElementPrimative(
          square,
          Point.zero(),
          0,
          Point.Unity(),
          [0, 0, 1, 1],
        );
        expect(element instanceof DiagramElementPrimative).toBe(true);
      });
    });
    describe('Animation', () => {
      let element;
      let identity;
      beforeEach(() => {
        const square = new Polygon(webgl, 1, 4, 4, 0.01, 0, Point.zero());
        element = new DiagramElementPrimative(
          square,
          Point.zero(),
          0,
          Point.Unity(),
          [0, 0, 1, 1],
        );
        identity = m2.identity();
      });
      describe('Rotation', () => {
        test('Rotate 1 radian, for 1 second, with linear movement', () => {
          expect(element.state.isAnimating).toBe(false);
          expect(element.isMoving()).toBe(false);

          element.animateRotationTo(1, 1, 1, linear);
          const t = element.transform;
          expect(t).toEqual(new Transform(Point.zero(), 0, Point.Unity()));

          const phase = element.state.animation.currentPhase;

          expect(element.state.isAnimating).toBe(true);
          expect(element.isMoving()).toBe(true);
          expect(phase.startTime).toBe(-1);

          element.draw(m2.identity(), 10);
          expect(phase.startTime).toBe(10);
          expect(phase.time).toBe(1);
          expect(t.rotation).toBe(0);

          element.draw(m2.identity(), 10.5);
          expect(phase.startTime).toBe(10);
          expect(phase.time).toBe(1);
          expect(element.transform.rotation).toBe(0.5);

          element.draw(m2.identity(), 11);
          expect(phase.time).toBe(1);
          expect(element.transform.rotation).toBe(1);
          expect(element.state.isAnimating).toBe(true);
          expect(element.isMoving()).toBe(true);

          element.draw(m2.identity(), 11.01);
          expect(phase.time).toBe(1);
          expect(element.transform.rotation).toBe(1);
          expect(element.state.isAnimating).toBe(false);
          expect(element.isMoving()).toBe(false);
        });
        test('translate (0, 0) to (1, 0), 1 second, linear movement', () => {
          expect(element.state.isAnimating).toBe(false);
          expect(element.isMoving()).toBe(false);

          // Setup the animation
          element.animateTranslationTo(new Point(1, 0), 1, linear);
          const t = element.transform;
          expect(t).toEqual(new Transform(Point.zero(), 0, Point.Unity()));
          const phase = element.state.animation.currentPhase;
          expect(element.state.isAnimating).toBe(true);
          expect(element.isMoving()).toBe(true);
          expect(phase.startTime).toBe(-1);

          // Initial draw setting start time
          element.draw(m2.identity(), 0);
          expect(phase.startTime).toBe(0);
          expect(phase.time).toBe(1);
          expect(t.rotation).toBe(0);

          // Draw half way through
          element.draw(m2.identity(), 0.5);
          expect(element.transform.translation).toEqual(new Point(0.5, 0));

          // Draw at last time
          element.draw(m2.identity(), 1);
          expect(element.transform.translation).toEqual(new Point(1.0, 0));
          expect(element.state.isAnimating).toBe(true);
          expect(element.isMoving()).toBe(true);

          // Draw after time elapsed
          element.draw(m2.identity(), 1.01);
          expect(element.transform.translation).toEqual(new Point(1.0, 0));
          expect(element.state.isAnimating).toBe(false);
          expect(element.isMoving()).toBe(false);
        });
        test('Callback', () => {
          const callback = jest.fn();         // Callback mock
          // Setup the animation
          element.animateRotationTo(1, 1, 1, linear, callback);
          element.draw(m2.identity(), 0);     // Initial draw setting start time
          element.draw(m2.identity(), 2);   // Draw half way through
          element.stopAnimating();            // Stop animating

          expect(element.state.isAnimating).toBe(false);
          expect(callback.mock.calls).toHaveLength(1);
        });
        test('Stop animating during animation', () => {
          const callback = jest.fn();         // Callback mock
          // Setup the animation
          element.animateRotationTo(1, 1, 1, linear, callback);
          element.draw(m2.identity(), 0);     // Initial draw setting start time
          element.draw(m2.identity(), 0.5);   // Draw half way through
          element.stopAnimating();            // Stop animating

          expect(element.state.isAnimating).toBe(false);
          expect(callback.mock.calls).toHaveLength(1);
        });
        test('Three phase animation plan', () => {
          // Phase 1 rotates to 1 radian in 1 second
          const phase1 = new AnimationPhase(
            new Transform(Point.zero(), 1, Point.Unity()),
            1, 1, linear,
          );
          // Phase 2 rotates back to 0 radians in 1 second
          const phase2 = new AnimationPhase(
            new Transform(Point.zero(), 0, Point.Unity()),
            1, -1, linear,
          );
          // Phase 3 rotates to -1 radians in 1 second
          const phase3 = new AnimationPhase(
            new Transform(Point.zero(), -1, Point.Unity()),
            1, -1, linear,
          );
          const callback = jest.fn();         // Callback mock
          expect(callback.mock.calls).toHaveLength(0);
          element.animatePlan([phase1, phase2, phase3], callback);
          expect(callback.mock.calls).toHaveLength(0);
          element.draw(identity, 0);          // Give animation an initial time

          // Check initial values
          expect(element.state.isAnimating).toBe(true);
          expect(element.state.animation.currentPhaseIndex).toBe(0);

          // Half way through first phase
          element.draw(identity, 0.5);
          expect(element.state.animation.currentPhaseIndex).toBe(0);
          expect(element.transform.rotation).toBe(0.5);
          expect(callback.mock.calls).toHaveLength(0);

          // End of first phase
          element.draw(identity, 1.0);
          expect(element.state.animation.currentPhaseIndex).toBe(0);
          expect(element.transform.rotation).toBe(1.0);
          expect(callback.mock.calls).toHaveLength(0);

          // Start of next phase
          element.draw(identity, 1.1);
          expect(element.state.animation.currentPhaseIndex).toBe(1);
          expect(round(element.transform.rotation)).toBe(0.9);
          expect(callback.mock.calls).toHaveLength(0);

          // Skip to into third phase
          element.draw(identity, 2.1);
          expect(element.state.animation.currentPhaseIndex).toBe(2);
          expect(round(element.transform.rotation)).toBe(-0.1);
          expect(callback.mock.calls).toHaveLength(0);

          // Time after End
          element.draw(identity, 3.1);
          expect(round(element.transform.rotation)).toBe(-1);
          expect(callback.mock.calls).toHaveLength(1);
          expect(element.state.isAnimating).toBe(false);
        });
      });
    });
    describe('Moving Freely', () => {
      let element;
      let identity;
      beforeEach(() => {
        const square = new Polygon(webgl, 1, 4, 4, 0.01, 0, Point.zero());
        element = new DiagramElementPrimative(
          square,
          Point.zero(),
          0,
          Point.Unity(),
          [0, 0, 1, 1],
        );
        identity = m2.identity();
      });
      test('Deceleration', () => {
        const callback = jest.fn();
        const initialV = new Transform(new Point(10, 20), 0, new Point(-2, 1));
        const decel = new Transform(new Point(1, 2), 2, new Point(1, 1));
        element.state.movement.velocity = initialV;
        element.moveFreelyProperties.deceleration = decel;

        expect(element.state.isMovingFreely).toBe(false);

        element.startMovingFreely(callback);
        expect(element.state.isMovingFreely).toBe(true);
        element.draw(identity, 0);
        expect(element.state.movement.velocity).toEqual(initialV);

        element.draw(identity, 1);
        expect(element.state.isMovingFreely).toBe(true);
        let vel = element.state.movement.velocity;
        expect(vel.translation).toEqual(new Point(9, 18));
        expect(vel.scale).toEqual(new Point(-1, 0));
        expect(vel.rotation).toBe(0);
        expect(element.transform.round()).toEqual(new Transform(
          new Point(9.5, 19),
          0,
          new Point(-0.5, 1.5),
        ));

        element.draw(identity, 2);
        vel = element.state.movement.velocity;
        expect(vel.translation).toEqual(new Point(8, 16));
        expect(vel.scale).toEqual(new Point(0, 0));
        expect(vel.rotation).toBe(0);
        expect(callback.mock.calls).toHaveLength(0);

        element.draw(identity, 12);
        vel = element.state.movement.velocity;
        expect(vel).toEqual(Transform.Zero());
        expect(callback.mock.calls).toHaveLength(1);
      });
      test('Zero and Max Threshold', () => {
        const initialV = new Transform(new Point(10, -10), 10, new Point(30, -30));
        const decel = new Transform(new Point(1, 1), 1, new Point(1, 1));
        const zero = new Transform(new Point(5, 5), 5, new Point(15, 15));
        const max = new Transform(new Point(20, 20), 20, new Point(20, 20));
        element.state.movement.velocity = initialV;
        element.moveFreelyProperties.deceleration = decel;
        element.moveFreelyProperties.zeroVelocityThreshold = zero;
        element.maxVelocity = max;

        expect(element.state.isMovingFreely).toBe(false);

        element.startMovingFreely();
        let vel = element.state.movement.velocity;

        expect(vel.translation).toEqual(new Point(10, -10));
        expect(vel.scale).toEqual(new Point(20, -20));
        expect(vel.rotation).toBe(10);

        element.draw(identity, 0);

        expect(element.state.isMovingFreely).toBe(true);

        element.draw(identity, 5);
        vel = element.state.movement.velocity;

        expect(vel.translation).toEqual(new Point(5, -5));
        expect(vel.scale).toEqual(new Point(15, -15));
        expect(vel.rotation).toBe(5);

        element.draw(identity, 5.1);
        vel = element.state.movement.velocity;

        expect(vel.translation).toEqual(new Point(0, 0));
        expect(vel.scale).toEqual(new Point(0, 0));
        expect(vel.rotation).toBe(0);
        expect(element.state.isMovingFreely).toBe(false);
      });
    });
    describe('Being Moved', () => {
      let element;
      const RealDate = Date.now;
      beforeEach(() => {
        const square = new Polygon(webgl, 1, 4, 4, 0.01, 0, Point.zero());
        element = new DiagramElementPrimative(
          square,
          Point.zero(),
          0,
          Point.Unity(),
          [0, 0, 1, 1],
        );
      });
      afterEach(() => {
        Date.now = RealDate;
      });
      describe('Move', () => {
        test('Move', () => {
          Date.now = () => 0;
          element.startBeingMoved();
          expect(element.state.isBeingMoved).toBe(true);
          Date.now = () => 1000;
          element.moved(new Transform(
            new Point(1, -1),
            1,
            new Point(1, 1),
          ));
          expect(element.state.movement.velocity).toEqual(new Transform(
            new Point(1, -1),
            1,
            new Point(0, 0),
          ));
        });
      });
    });
  });
  describe('DiagramElementCollection', () => {
    let squareElement;
    let triElement;
    let collection;
    const RealDate = Date.now;
    let identity;
    beforeEach(() => {
      identity = m2.identity();
      const square = new Polygon(webgl, 1, 4, 4, 0.01, 0, Point.zero());
      const tri = new Polygon(webgl, 0.1, 3, 3, 0.01, 0, new Point(0.1, 0.1));
      squareElement = new DiagramElementPrimative(
        square,
        Point.zero(),
        0,
        Point.Unity(),
        [0, 0, 1, 1],
      );
      // Transform the triangle by 0.1 in x, rotate by 90 deg, scale by 2
      // This means, the outside point (0.105, 0) will transform:
      //    - tranlation x by 0.1: (0.205, 0)
      //    - rotation by 90 degrees: (0, 0.205)
      //    - scale by 2: (0, 0.41)
      triElement = new DiagramElementPrimative(
        tri,
        new Point(0.1, 0),
        Math.PI / 2,
        new Point(2, 2),
        [0, 0, 1, 1],
      );
      collection = new DiagramElementCollection(
        new Point(0, 0),
        0,
        new Point(1, 1),
      );
      collection.add('square', squareElement);
      collection.add('tri', triElement);
    });
    afterEach(() => {
      Date.now = RealDate;
    });
    test('Combination of animation and movement with a collection', () => {
      const callbackAnim = jest.fn();
      const callbackMoveFree = jest.fn();
      const draw = jest.fn();
      webgl.gl.drawArrays = draw;
      collection.draw(identity, 0);
      expect(draw.mock.instances).toHaveLength(2);
      expect(collection.state.isAnimating).toBe(false);
      expect(collection.state.isBeingMoved).toBe(false);
      expect(collection.state.isMovingFreely).toBe(false);

      // Move translation to (0.5, 0)
      collection.animateTranslationTo(new Point(1, 0), 1, linear, callbackAnim);
      expect(collection.state.isAnimating).toBe(true);
      expect(collection.state.isBeingMoved).toBe(false);
      expect(collection.state.isMovingFreely).toBe(false);
      collection.draw(m2.identity(), 0);
      collection.draw(m2.identity(), 0.5);
      expect(collection.transform.round()).toEqual(new Transform(
        new Point(0.5, 0),
        0, new Point(1, 1),
      ));

      Date.now = () => 0;
      collection.startBeingMoved();
      expect(collection.state.isAnimating).toBe(false);
      expect(collection.state.isBeingMoved).toBe(true);
      expect(collection.state.isMovingFreely).toBe(false);

      // Over 1 s, rotation = 0.1;
      Date.now = () => 1000;
      collection.moved(new Transform(new Point(0.5, 0), 0.1, Point.Unity()));
      expect(collection.transform.round()).toEqual(new Transform(
        new Point(0.5, 0),
        0.1,
        new Point(1, 1),
      ));
      const velocity = new Transform(Point.zero(), 0.1, Point.zero());
      expect(collection.state.movement.velocity).toEqual(velocity);

      const moveFreeProps = collection.moveFreelyProperties;
      moveFreeProps.deceleration =
        new Transform(new Point(1, 1), 0.01, new Point(1, 1));
      moveFreeProps.zeroVelocityThreshold =
        new Transform(new Point(0.1, 0.1), 0.05, new Point(0.1, 0.1));

      // Now at (0.5, 0), 0.1 and rotating with velocity 0.1 rads/s
      collection.startMovingFreely(callbackMoveFree);
      expect(collection.state.isAnimating).toBe(false);
      expect(collection.state.isBeingMoved).toBe(false);
      expect(collection.state.isMovingFreely).toBe(true);

      collection.draw(m2.identity(), 10);
      expect(collection.state.movement.velocity).toEqual(velocity);

      // After one second, should have rotated to:
      //  rotation: 0.1 + 0.1*1 - 0.5*0.01*1*1
      //  with velocity: 0.1 - 0.01*1*1
      collection.draw(m2.identity(), 11);
      expect(collection.state.movement.velocity.round()).toEqual(new Transform(
        Point.zero(),
        0.09,
        Point.zero(),
      ));
      expect(collection.transform.round()).toEqual(new Transform(
        new Point(0.5, 0),
        0.195,
        Point.Unity(),
      ));

      // At 5 seconds, velocity becomes 0, so rotation is
      //  rotation: 0.1 + 0.1*5 - 0.5*0.01*5*5
      //  with velocity: 0.1 - 0.01*1*1
      collection.draw(m2.identity(), 15.1);
      expect(collection.state.isAnimating).toBe(false);
      expect(collection.state.isBeingMoved).toBe(false);
      expect(collection.state.isMovingFreely).toBe(false);
      expect(collection.state.movement.velocity).toEqual(Transform.Zero());
      expect(collection.transform.round()).toEqual(new Transform(
        new Point(0.5, 0),
        0.475,
        Point.Unity(),
      ));

      // Check all the callbacks were called once
      expect(callbackAnim.mock.calls).toHaveLength(1);
      expect(callbackMoveFree.mock.calls).toHaveLength(1);
    });
  });
});
