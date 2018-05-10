// @flow
import Diagram from '../../js/diagram/Diagram';
import { DiagramElementCollection, DiagramElementPrimative } from '../../js/diagram/Element';
import ShapesCollection from './diagramCollectionShapes';
import CircleCollection from './diagramCollectionCircle';
import getScssColors from '../../js/tools/getScssColors';
import styles from './style.scss';
import { Point, minAngleDiff, Rect, Transform } from '../../js/diagram/tools/g2';
import getCssVariables from '../../js/tools/getCssVariables';

const colors = getScssColors(styles);

const backgroundColor = colors.background;

type typeShape = {
  _lines: DiagramElementPrimative;
  _corners: DiagramElementPrimative;
  _lessSharpCorners: DiagramElementPrimative;
  _moreSharpCorners: DiagramElementPrimative;
} & DiagramElementCollection ;

// type typeShapesDiagramCollection = {
//   _square: typeShape,
//   _triangle: typeShape,
//   _pent: typeShape,
// } & DiagramElementCollection;


type typeElements = {
  _circle: CircleCollection;
  _shapes: ShapesCollection;
} & DiagramElementCollection ;

function getLessonVars() {
  const v = getCssVariables(
    'lesson__container_name',
    [
      'x-min',
      'x-max',
      'y-min',
      'y-max',
      'square-center-x',
      'square-center-y',
      'tri-center-x',
      'tri-center-y',
      'pent-center-x',
      'pent-center-y',
      'radius',
      'linewidth',
      'circle-center-x',
      'circle-center-y',
    ],
    '--lessonvars-',
  );
  return {
    limits: new Rect(
      v['x-min'],
      v['y-min'],
      v['x-max'] - v['x-min'],
      v['y-max'] - v['y-min'],
    ),
    radius: v.radius,
    linewidth: v.linewidth,
    circle: {
      center: new Point(v['circle-center-x'], v['circle-center-y']),
    },
    square: {
      center: new Point(v['square-center-x'], v['square-center-y']),
    },
    tri: {
      center: new Point(v['tri-center-x'], v['tri-center-y']),
    },
    pent: {
      center: new Point(v['pent-center-x'], v['pent-center-y']),
    },
  };
}

// $FlowFixMe
class LessonDiagram extends Diagram {
  elements: typeElements;

  constructor(id: string) {
    const { limits } = getLessonVars();
    // console.log(limits);
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
    const { shapes } = this;
    this.elements = shapes.collection();

    const layout = getLessonVars();
    const shapesCollection = new ShapesCollection(this, layout);
    this.add('shapes', shapesCollection);

    const circleCollection = new CircleCollection(this, layout, new Transform()
      .translate(layout.circle.center.x, layout.circle.center.y));
    this.add('circle', circleCollection);

    this.elements.isTouchable = true;
    this.elements.isMovable = true;
  }

  resize() {
    const layout = getLessonVars();
    const { limits } = layout;
    this.limits = limits;
    this.elements.updateLimits(limits);
    this.elements._shapes.resize(layout);
    this.elements._circle.resize(layout);
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
    let center = this.elements._circle.transform.t();
    if (center === null || center === undefined) {
      center = new Point(0, 0);
    }
    const previousClipPoint = this.clientToClip(previousClientPoint);
    const currentClipPoint = this.clientToClip(currentClientPoint);
    const currentAngle = Math.atan2(
      currentClipPoint.y - center.y,
      currentClipPoint.x - center.x,
    );
    const previousAngle = Math.atan2(
      previousClipPoint.y - center.y,
      previousClipPoint.x - center.x,
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