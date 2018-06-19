// @flow
import Diagram from '../../../js/diagram/Diagram';
import { DiagramElementCollection, DiagramElementPrimative } from '../../../js/diagram/Element';
import CircleCollection from './diagramCollectionCircle';
import { Point, minAngleDiff, Transform } from '../../../js/diagram/tools/g2';
import lessonLayout from './layout';

const layout = lessonLayout();
const { colors } = layout;
const backgroundColor = colors.diagram.background;


type circleCollectionType = {
  _anchor: DiagramElementPrimative;
  _arc: DiagramElementPrimative;
  _angle: DiagramElementPrimative;
  _radius: DiagramElementPrimative;
  _circumference: DiagramElementPrimative;
  _diameter: {
    _radius2: DiagramElementPrimative;
    _radius1: DiagramElementPrimative;
  } & DiagramElementCollection;
} & DiagramElementCollection;

type typeElements = {
  _circle: circleCollectionType;
  _movingCircle: {
    _touchCircle: DiagramElementPrimative;
    _circumference: DiagramElementPrimative;
  } & DiagramElementCollection
} & DiagramElementCollection ;

// $FlowFixMe
class LessonDiagram extends Diagram {
  elements: typeElements;

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

    // this.elements.isTouchable = true;
    // this.elements.isMovable = true;
    this.fontScale = 1.2;
  }

  resize() {
    const { limits } = layout;
    this.limits = limits;
    this.elements.updateLimits(limits);
    super.resize();
  }

  touchUpHandler() {
    if (this.beingMovedElements.indexOf(this.elements._circle._diameter._radius2)) {
      this.elements._circle._radius.stopBeingMoved();
      this.elements._circle._radius.startMovingFreely();
    }
    super.touchUpHandler();
    this.beingMovedElements = [];
  }

  touchMoveHandler(
    previousClientPoint: Point,
    currentClientPoint: Point,
  ): boolean {
    if (this.beingMovedElements.length === 0) {
      return false;
    }
    if (this.beingMovedElements.indexOf(this.elements._movingCircle) >= 0) {
      // console.log(this.beingMovedElements)
      return super.touchMoveHandler(previousClientPoint, currentClientPoint);
    }
    // if (!this.elements._circle.show) {
    //   return super.touchMoveHandler(previousClientPoint, currentClientPoint);
    // }

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
    const transform = this.elements._circle._radius.transform.copy();
    const rot = transform.r();
    if (rot != null) {
      transform.updateRotation(rot - diffAngle);
      if (this.beingMovedElements.indexOf(this.elements._circle._radius)) {
        this.elements._circle._radius.moved(transform);
      } else {
        transform.updateRotation(rot - diffAngle + Math.PI);
        this.elements._circle._radius.moved(transform);
      }
      // const transform2 = transform.copy().updateRotation(rot - diffAngle + Math.PI);
      // this.elements._circle._diameter._radius2.moved(transform2);
    }

    this.animateNextFrame();
    return true;
  }
}

export default LessonDiagram;
