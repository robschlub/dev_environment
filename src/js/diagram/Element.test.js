import { DiagramElementPrimative } from './Element';
import { Point, Transform } from './g2';
import webgl from '../__mocks__/WebGLInstanceMock';
import Polygon from './vertexObjects/Polygon';
import * as tools from './mathtools';
import * as m2 from './m2';

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
    describe('Rotation', () => {
      test('Rotate 1 radian, for 1 second, with linear movement', () => {
        expect(element.state.isAnimating).toBe(false);
        expect(element.isMoving()).toBe(false);

        element.animateRotationTo(1, 1, 1, tools.linear);
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
        element.animateTranslationTo(new Point(1, 0), 1, tools.linear);
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
      test('Stop animating during animation', () => {
        const callback = jest.fn();         // Callback mock
        // Setup the animation
        element.animateRotationTo(1, 1, 1, tools.linear, callback);
        element.draw(m2.identity(), 0);     // Initial draw setting start time
        element.draw(m2.identity(), 0.5);   // Draw half way through
        element.stopAnimating();            // Stop animating

        expect(element.state.isAnimating).toBe(false);
        expect(callback.mock.calls).toHaveLength(1);
      });
    });
  });
});
