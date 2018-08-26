// @flow
import Diagram from '../../../js/diagram/Diagram';
import Lesson from '../../../js/Lesson/Lesson';
import { DiagramElementCollection, DiagramElementPrimative } from '../../../js/diagram/Element';
// eslint-disable-next-line import/no-cycle
import RelatedAnglesCollection from './diagramCollection';
// eslint-disable-next-line import/no-cycle
import type { MoveableLineType } from './diagramCollectionCommon';
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
    let center = element.getDiagramPosition();
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
      newAngle += 2 * Math.PI;
    }
    if (newAngle > 2 * Math.PI) {
      newAngle -= 2 * Math.PI;
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
    const lineSegmentHandler = (segment) => {
      if (this.beingTouchedElements.indexOf(segment) >= 0) {
        if (segment.movementAllowed === 'rotation') {
          this.rotateElement(
            previousClientPoint,
            currentClientPoint,
            line,
          );
        } else {
          this.moveLineElement(
            previousClientPoint,
            currentClientPoint,
            line,
          );
        }
        return true;
      }
      return false;
    };

    if (line.state.isBeingMoved) {
      if (lineSegmentHandler(line._end1)) {
        return true;
      }
      if (lineSegmentHandler(line._end2)) {
        return true;
      }
      if (lineSegmentHandler(line._mid)) {
        return true;
      }
    }
    // if (line.state.isBeingMoved) {
    //   if (this.beingTouchedElements.indexOf(line._end1) >= 0
    //     || this.beingTouchedElements.indexOf(line._end2) >= 0
    //   ) {
    //     this.rotateElement(
    //       previousClientPoint,
    //       currentClientPoint,
    //       line,
    //     );
    //     return true;
    //   }
    //   if (this.beingTouchedElements.indexOf(line._mid) >= 0) {
    //     this.moveLineElement(
    //       previousClientPoint,
    //       currentClientPoint,
    //       line,
    //     );
    //     return true;
    //   }
    // }
    return false;
  }

  touchMoveHandler(
    previousClientPoint: Point,
    currentClientPoint: Point,
  ): boolean {
    if (this.beingMovedElements.length === 0) {
      return false;
    }
    const pLine1 = this.elements._parallel._line1;
    const pLine2 = this.elements._parallel._line2;
    const oLine1 = this.elements._opposite._line1;
    const oLine2 = this.elements._opposite._line2;
    // const tLine1 = this.elements._threeLines._line1;
    // const tLine2 = this.elements._threeLines._line2;
    const tLine3 = this.elements._threeLines._line3;

    if (this.lineHandler(previousClientPoint, currentClientPoint, pLine1)) {
      return this.endHandler();
    }
    if (this.lineHandler(previousClientPoint, currentClientPoint, pLine2)) {
      return this.endHandler();
    }
    if (this.lineHandler(previousClientPoint, currentClientPoint, oLine1)) {
      return this.endHandler();
    }
    if (this.lineHandler(previousClientPoint, currentClientPoint, oLine2)) {
      return this.endHandler();
    }
    // if (this.lineHandler(previousClientPoint, currentClientPoint, tLine1)) {
    //   return this.endHandler();
    // }
    // if (this.lineHandler(previousClientPoint, currentClientPoint, tLine2)) {
    //   return this.endHandler();
    // }
    if (this.lineHandler(previousClientPoint, currentClientPoint, tLine3)) {
      return this.endHandler();
    }

    if (this.beingMovedElements.indexOf(pLine1) >= 0
      || this.beingMovedElements.indexOf(pLine2) >= 0
      || this.beingMovedElements.indexOf(oLine1) >= 0
      || this.beingMovedElements.indexOf(oLine2) >= 0
      // || this.beingMovedElements.indexOf(tLine1) >= 0
      // || this.beingMovedElements.indexOf(tLine2) >= 0
      || this.beingMovedElements.indexOf(tLine3) >= 0
    ) {
      return true;
    }
    // console.log(this.beingTouchedElements)
    if (this.beingTouchedElements.indexOf(this.elements._threeLines) >= 0) {
      this.rotateElement(
        previousClientPoint,
        currentClientPoint,
        this.elements._threeLines,
      );
      return true;
    }
    return super.touchMoveHandler(previousClientPoint, currentClientPoint);
  }
}

export default LessonDiagram;
