// @flow
import Diagram from '../../js/diagram/Diagram';
import { DiagramElementCollection, DiagramElementPrimative } from '../../js/diagram/Element';
import ShapesCollection from './diagramCollectionShapes';
import CircleCollection from './diagramCollectionCircle';
import getScssColors from '../../js/tools/getScssColors';
import styles from './style.scss';
import { Point, minAngleDiff, Rect } from '../../js/diagram/tools/g2';
import getCssVariables from '../../js/tools/getCssVariables';

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

function getLessonVars() {
  return getCssVariables(
    'lesson__container_name',
    [
      'x-min',
      'x-max',
      'y-min',
      'y-max',
    ],
    '--lessonvars-',
  );
}

// $FlowFixMe
class LessonDiagram extends Diagram {
  elements: typeElements;

  constructor(id: string) {
    const limits = getLessonVars();
    console.log(limits);
    super(
      `${id}`,
      limits['x-min'],
      limits['y-min'],
      limits['x-max'] - limits['x-min'],
      limits['y-max'] - limits['y-min'],
      backgroundColor,
    );
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

  resize() {
    const limits = getLessonVars();
    const newLimits = new Rect(
      limits['x-min'],
      limits['y-min'],
      limits['x-max'] - limits['x-min'],
      limits['y-max'] - limits['y-min'],
    );
    // this.elements.updateLimits(new Rect(
    //   limits['x-min'],
    //   limits['y-min'],
    //   limits['x-max'] - limits['x-min'],
    //   limits['y-max'] - limits['y-min'],
    // ));
    // console.log(limits)
    this.limits = newLimits;
    this.elements.updateLimits(newLimits);
    super.resize();
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
