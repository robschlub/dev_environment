// @flow
import Diagram from '../../../js/diagram/Diagram';
import CircleCollection from './diagramCollectionCircle';
import type { CircleCollectionType } from './diagramCollectionCircle';
import { Point, minAngleDiff, Transform } from '../../../js/diagram/tools/g2';
import lessonLayout from './layout';

const layout = lessonLayout();
const { colors } = layout;
const backgroundColor = colors.diagram.background;

// $FlowFixMe
class LessonDiagram extends Diagram {
  elements: CircleCollectionType;

  constructor(id: string) {
    const { limits } = lessonLayout();
    super(
      `${id}`,
      limits.left,
      limits.bottom,
      limits.width,
      limits.height,
      backgroundColor,
    );
  }
  createDiagramElements() {
    const circleCollection = new CircleCollection(
      this,
      new Transform().translate(0, 0),
    );
    this.elements = circleCollection;
    this.fontScale = 1.2;
  }

  resize() {
    const { limits } = layout;
    this.limits = limits;
    this.elements.updateLimits(limits);
    super.resize();
  }

  touchUpHandler() {
    const rad = this.elements._circle._radius;
    const d = this.elements._circle._diameter;
    if (this.beingMovedElements.indexOf(d) >= 0) {
      this.elements._circle._diameter.stopBeingMoved();
      this.elements._circle._diameter.startMovingFreely();
    } else if (this.beingMovedElements.indexOf(rad) >= 0) {
      this.elements._circle._radius.stopBeingMoved();
      this.elements._circle._radius.startMovingFreely();
    } else {
      super.touchUpHandler();
    }
    this.beingMovedElements = [];
  }

  touchMoveHandler(
    previousClientPoint: Point,
    currentClientPoint: Point,
  ): boolean {
    if (this.beingMovedElements.length === 0) {
      return false;
    }

    // if (this.elements._circle.movable === 'location') {
    //   return super.touchMoveHandler(previousClientPoint, currentClientPoint);
    // }

    const rad = this.elements._circle._radius;
    const d = this.elements._circle._diameter;
    if (rad.state.isBeingMoved
      || d.state.isBeingMoved) {
      let center = this.elements._circle.transform.t();
      if (center === null || center === undefined) {
        center = new Point(0, 0);
      }
      const previousPixelPoint = this.clientToPixel(previousClientPoint);
      const currentPixelPoint = this.clientToPixel(currentClientPoint);

      const previousDiagramPoint =
        previousPixelPoint.transformBy(this.pixelToDiagramSpaceTransform.matrix());
      const currentDiagramPoint =
        currentPixelPoint.transformBy(this.pixelToDiagramSpaceTransform.matrix());
      const currentAngle = Math.atan2(
        currentDiagramPoint.y - center.y,
        currentDiagramPoint.x - center.x,
      );
      const previousAngle = Math.atan2(
        previousDiagramPoint.y - center.y,
        previousDiagramPoint.x - center.x,
      );
      const diffAngle = minAngleDiff(previousAngle, currentAngle);

      let transform = this.elements._circle._radius.transform.copy();
      if (d.state.isBeingMoved) {
        transform = this.elements._circle._diameter.transform.copy();
      }
      const rot = transform.r();
      if (rot != null) {
        transform.updateRotation(rot - diffAngle);
        if (rad.state.isBeingMoved) {
          this.elements._circle._radius.moved(transform.copy());
        } else {
          this.elements._circle._diameter.moved(transform.copy());
        }
        // if (rad.state.isBeingMoved) {
        //   this.elements._circle._radius.moved(transform.copy());
        // }
        // if (d.state.isBeingMoved) {
        //   transform.updateRotation(rot - diffAngle + Math.PI / 2);
        //   d.moved(transform);
        // }
        // if (this.beingMovedElements.indexOf(this.elements._circle._radius) >= 0) {
        //   transform.updateRotation(rot - diffAngle);
        //   this.elements._circle._radius.moved(transform.copy());
        // } else {
        //   transform.updateRotation(rot - diffAngle + Math.PI / 2);
        //   this.elements._circle._diameter._radius2.moved(transform);
        // }
      }
    } else {
      return super.touchMoveHandler(previousClientPoint, currentClientPoint);
    }
    this.animateNextFrame();
    return true;
  }
}

export default LessonDiagram;