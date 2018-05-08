// @flow
import Diagram from '../../js/diagram/Diagram';
import { DiagramElementCollection, DiagramElementPrimative } from '../../js/diagram/Element';
import ShapesCollection from './diagramCollectionShapes';
import CircleCollection from './diagramCollectionCircle';
import getScssColors from '../../js/tools/getScssColors';
import styles from './style.scss';
import { Point, minAngleDiff } from '../../js/diagram/tools/g2';

const colors = getScssColors(styles);

const backgroundColor = colors.background;

type typeCircleDiagramCollection = {
  _anchor: DiagramElementPrimative;
  _radius: DiagramElementPrimative;
  _reference: DiagramElementPrimative;
  _cornerRef: DiagramElementPrimative;
  _cornerRad: DiagramElementPrimative;
} & DiagramElementCollection ;

type typeElements = {
  _circle: typeCircleDiagramCollection;
  _shapes: DiagramElementCollection;
} & DiagramElementCollection ;

// $FlowFixMe
class LessonDiagram extends Diagram {
  elements: typeElements;

  constructor(id: string) {
    super(`${id}`, -2, -1.5, 4, 3, backgroundColor);
  }
  createDiagramElements() {
    const { shapes } = this;
    this.elements = shapes.collection();

    const shapesCollection = new ShapesCollection(this);
    this.add('shapes', shapesCollection);

    const circleCollection = new CircleCollection(this);
    this.add('circle', circleCollection);

    this.elements.isTouchable = true;
    this.elements.isMovable = true;
  }

  touchMoveHandler(
    previousClientPoint: Point,
    currentClientPoint: Point,
  ): boolean {
    if (this.beingMovedElements.length === 0) {
      return false;
    }
    if (!this.elements._circle.show) {
      return false;
    }
    const previousClipPoint = this.clientToClip(previousClientPoint);
    const currentClipPoint = this.clientToClip(currentClientPoint);
    const currentAngle = Math.atan2(currentClipPoint.y, currentClipPoint.x);
    const previousAngle = Math.atan2(previousClipPoint.y, previousClipPoint.x);
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
