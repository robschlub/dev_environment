// @flow
import Diagram from '../../../js/diagram/Diagram';
import Lesson from '../../../js/Lesson/Lesson';
import { DiagramElementCollection, DiagramElementPrimative } from '../../../js/diagram/Element';
// eslint-disable-next-line import/no-cycle
import RelatedAnglesCollection from './diagramCollection';
// eslint-disable-next-line import/no-cycle
import type { MoveableLineType } from './diagramCollection';
import {
  Point, minAngleDiff, Transform,
} from '../../../js/diagram/tools/g2';

export type LessonDiagramType = {
  elements: RelatedAnglesCollection;
  layout: Object;
  lesson: Lesson;
} & Diagram;

// $FlowFixMe
class LessonDiagram extends Diagram {
  elements: RelatedAnglesCollection;
  layout: Object;
  lesson: Lesson;

  constructor(id: string, layout: Object) {
    const { limits } = layout;
    super(
      `${id}`,
      limits.left,
      limits.bottom,
      limits.width,
      limits.height,
      layout.colors.diagram.background,
      layout,
    );
  }

  createDiagramElements() {
    this.elements = new RelatedAnglesCollection(this, new Transform().translate(0, 0));

    this.elements.hasTouchableElements = true;
    this.fontScale = 1.2;
  }

  resize() {
    // const { limits } = layout;
    // this.limits = layout.limits;
    this.elements.updateLimits(this.limits);
    // this.elements._circle.resize();
    super.resize();
  }

  // touchUpHandler() {
  //   const rad = this.elements._circle._radius;
  //   const endLine = this.elements._circle._endLine;
  //   const startLine = this.elements._circle._startLine;
  //   if (this.beingMovedElements.indexOf(endLine) >= 0) {
  //     this.elements._circle._endLine.stopBeingMoved();
  //     if (this.elements.varState.angleSelected === 'adjacent') {
  //       this.elements._circle._endLine.startMovingFreely();
  //     } else {
  //       this.elements._circle.stopBeingMoved();
  //       this.elements._circle.startMovingFreely();
  //     }
  //   }
  //   if (this.beingMovedElements.indexOf(startLine) >= 0) {
  //     this.elements._circle.stopBeingMoved();
  //     this.elements._circle._startLine.stopBeingMoved();
  //     this.elements._circle.startMovingFreely();
  //   }
  //   if (this.beingMovedElements.indexOf(rad) >= 0) {
  //     this.elements._circle._radius.stopBeingMoved();
  //     this.elements._circle._radius.startMovingFreely();
  //   }
  //   if (this.beingMovedElements.indexOf(rad) === -1
  //       && this.beingMovedElements.indexOf(endLine) === -1
  //       && this.beingMovedElements.indexOf(startLine) === -1) {
  //     super.touchUpHandler();
  //   }
  //   this.beingMovedElements = [];
  // }

  rotateElement(
    previousClientPoint: Point,
    currentClientPoint: Point,
    element: DiagramElementCollection | DiagramElementPrimative,
  ) {
    let center = element.transform.t();
    if (center == null) {
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
    const transform = element.transform._dup();
    let rot = transform.r();
    if (rot == null) {
      rot = 0;
    }
    let newAngle = rot - diffAngle;
    if (newAngle < 0) {
      newAngle += Math.PI;
    }
    if (newAngle > Math.PI) {
      newAngle -= Math.PI;
    }

    transform.updateRotation(newAngle);
    element.moved(transform._dup());
  }

  moveLineElement(
    previousClientPoint: Point,
    currentClientPoint: Point,
    element: DiagramElementCollection | DiagramElementPrimative,
  ) {
    const previousPixelPoint = this.clientToPixel(previousClientPoint);
    const currentPixelPoint = this.clientToPixel(currentClientPoint);

    const previousDiagramPoint =
      previousPixelPoint.transformBy(this.pixelToDiagramSpaceTransform.matrix());
    const currentDiagramPoint =
      currentPixelPoint.transformBy(this.pixelToDiagramSpaceTransform.matrix());

    const delta = currentDiagramPoint.sub(previousDiagramPoint);
    const currentTransform = element.transform._dup();
    const currentTranslation = currentTransform.t();
    if (currentTranslation) {
      const newTranslation = currentTranslation.add(delta);
      currentTransform.updateTranslation(newTranslation);
      element.moved(currentTransform);
    }
  }

  endHandler() {
    this.animateNextFrame();
    return true;
  }

  lineHandler(
    previousClientPoint: Point,
    currentClientPoint: Point,
    line: MoveableLineType,
  ): boolean {
    if (line.state.isBeingMoved) {
      if (this.beingTouchedElements.indexOf(line._end1) >= 0
        || this.beingTouchedElements.indexOf(line._end2) >= 0
      ) {
        this.rotateElement(
          previousClientPoint,
          currentClientPoint,
          line,
        );
        return true;
      }
      if (this.beingTouchedElements.indexOf(line._mid) >= 0) {
        this.moveLineElement(
          previousClientPoint,
          currentClientPoint,
          line,
        );
        return true;
      }
    }
    return false;
  }

  touchMoveHandler(
    previousClientPoint: Point,
    currentClientPoint: Point,
  ): boolean {
    if (this.beingMovedElements.length === 0) {
      return false;
    }
    const line1 = this.elements._line1;
    const line2 = this.elements._line2;

    if (this.lineHandler(previousClientPoint, currentClientPoint, line1)) {
      return this.endHandler();
    }
    if (this.lineHandler(previousClientPoint, currentClientPoint, line2)) {
      return this.endHandler();
    }
    return super.touchMoveHandler(previousClientPoint, currentClientPoint);
  }
}

export default LessonDiagram;
