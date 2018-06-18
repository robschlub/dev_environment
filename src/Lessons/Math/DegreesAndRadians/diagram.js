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
  _reference: DiagramElementPrimative;
  _radialLinesA: DiagramElementPrimative;
  _radialLinesB: DiagramElementCollection;
  // _radialLinesC: DiagramElementPrimative;
  // resize: () => void;
} & DiagramElementCollection;

type typeElements = {
  _circle: circleCollectionType;
  // +resize: () => void;
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

    this.elements.isTouchable = true;
    this.elements.isMovable = true;
    this.fontScale = 1.2;
  }

  resize() {
    const { limits } = layout;
    this.limits = limits;
    this.elements.updateLimits(limits);
    super.resize();
  }

  touchMoveHandler(
    previousClientPoint: Point,
    currentClientPoint: Point,
  ): boolean {
    if (this.beingMovedElements.length === 0) {
      return false;
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
      this.elements._circle._radius.moved(transform);
    }

    this.animateNextFrame();
    return true;
  }
}

export default LessonDiagram;
