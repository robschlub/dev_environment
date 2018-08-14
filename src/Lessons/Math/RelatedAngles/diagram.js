// @flow
// import { DiagramElementCollection } from '../../../js/diagram/Element';
// import AdjacentAnglesCollection from './diagramCollection';
// import type { AdjacentAnglesCollectionType } from './diagramCollection';
import Diagram from '../../../js/diagram/Diagram';
import { DiagramElementCollection, DiagramElementPrimative } from '../../../js/diagram/Element';
import RelatedAnglesCollection from './diagramCollection';
import type { MoveableLineType } from './diagramCollection';
// import lessonLayout from './layout';
// import AngleCircleDiagram from '../../../LessonsCommon/AngleCircle/diagram';
import {
  Point, minAngleDiff, Transform,
} from '../../../js/diagram/tools/g2';
// import lessonLayout from './layout';

// type typeElements = {
//   _circle: extendedCircleType;
// } & DiagramElementCollection ;

// $FlowFixMe
class LessonDiagram extends Diagram {
  elements: RelatedAnglesCollection;
  layout: Object;

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
    transform.updateRotation(rot - diffAngle);
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

  touchMoveHandler(
    previousClientPoint: Point,
    currentClientPoint: Point,
  ): boolean {
    if (this.beingMovedElements.length === 0) {
      return false;
    }
    const line1 = this.elements._line1;
    const line2 = this.elements._line2;

    if (line1.state.isBeingMoved) {
      if (this.beingTouchedElements.indexOf(line1._end1) >= 0
        || this.beingTouchedElements.indexOf(line1._end2) >= 0
      ) {
        this.rotateElement(
          previousClientPoint,
          currentClientPoint,
          line1,
        );
      } else if (this.beingTouchedElements.indexOf(line1._mid) >= 0) {
        this.moveLineElement(
          previousClientPoint,
          currentClientPoint,
          line1,
        );
      }
    } else if (line2.state.isBeingMoved) {
      if (this.beingTouchedElements.indexOf(line2._end1) >= 0
        || this.beingTouchedElements.indexOf(line2._end2) >= 0
      ) {
        this.rotateElement(
          previousClientPoint,
          currentClientPoint,
          line2,
        );
      } else if (this.beingTouchedElements.indexOf(line2._mid) >= 0) {
        this.moveLineElement(
          previousClientPoint,
          currentClientPoint,
          line2,
        );
      }
    } else {
      return super.touchMoveHandler(previousClientPoint, currentClientPoint);
    }
    this.animateNextFrame();
    return true;
  }
}

export default LessonDiagram;
