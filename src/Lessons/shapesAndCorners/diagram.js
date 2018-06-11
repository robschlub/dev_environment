// @flow
import Diagram from '../../js/diagram/Diagram';
import { DiagramElementCollection } from '../../js/diagram/Element';
import ShapesCollection from './diagramCollectionShapes';
import CircleCollection from './diagramCollectionCircle';
import getScssColors from '../../js/tools/getScssColors';
import styles from './style.scss';
import { Point, minAngleDiff, Rect, Transform } from '../../js/diagram/tools/g2';
import getCssVariables from '../../js/tools/getCssVariables';

const colors = getScssColors(styles);

const backgroundColor = colors.background;

type typeElements = {
  _circle: CircleCollection;
  _shapes: ShapesCollection;
} & DiagramElementCollection ;

function getLessonVars() {
  const v = getCssVariables(
    'lesson__container_name',
    '--lessonvars-',
  );
  v.limits = new Rect(
    v.xMin,
    v.yMin,
    v.xMax - v.xMin,
    v.yMax - v.yMin,
  );
  v.circle = { center: new Point(v.circleCenterX, v.circleCenterY) };
  v.square = { center: new Point(v.squareCenterX, v.squareCenterY) };
  v.tri = { center: new Point(v.triCenterX, v.triCenterY) };
  v.pent = { center: new Point(v.pentCenterX, v.pentCenterY) };
  return v;
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
    this.fontScale = 1.2;
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

  draw(now: number): void {
    // const t1 = performance.now()
    super.draw(now);
    // console.log("a", performance.now() - t1)
  }

  touchMoveHandler(
    previousClientPoint: Point,
    currentClientPoint: Point,
  ): boolean {
    // const t1 = performance.now()
    if (this.beingMovedElements.length === 0) {
      return false;
    }
    if (!this.elements._circle.show) {
      return super.touchMoveHandler(previousClientPoint, currentClientPoint);
      // return false;
    }

    // if(! ('time' in this)) {
    //   this.time = performance.now();
    // }
    // const t = performance.now();
    // console.log(t - this.time);
    // this.time = t;

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
    // const t2 = performance.now()
    // console.log(t2-t1)
    return true;
  }
}

export default LessonDiagram;
