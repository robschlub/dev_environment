// @flow
// import { DiagramElementCollection } from '../../../js/diagram/Element';
// import AdjacentAnglesCollection from './diagramCollection';
// import type { AdjacentAnglesCollectionType } from './diagramCollection';
import Diagram from '../../../js/diagram/Diagram';
import { DiagramElementCollection } from '../../../js/diagram/Element';
import RelatedAnglesCollection from './diagramCollection';
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

  // touchMoveHandler(
  //   previousClientPoint: Point,
  //   currentClientPoint: Point,
  // ): boolean {
  //   if (this.beingMovedElements.length === 0) {
  //     return false;
  //   }
  //   const rad = this.elements._circle._radius;
  //   const endLine = this.elements._circle._endLine;
  //   const startLine = this.elements._circle._startLine;

  //   if (rad.state.isBeingMoved
  //     || endLine.state.isBeingMoved
  //     || startLine.state.isBeingMoved) {
  //     let center = this.elements._circle.transform.t();
  //     if (center === null || center === undefined) {
  //       center = new Point(0, 0);
  //     }
  //     const previousPixelPoint = this.clientToPixel(previousClientPoint);
  //     const currentPixelPoint = this.clientToPixel(currentClientPoint);

  //     const previousDiagramPoint =
  //       previousPixelPoint.transformBy(this.pixelToDiagramSpaceTransform.matrix());
  //     const currentDiagramPoint =
  //       currentPixelPoint.transformBy(this.pixelToDiagramSpaceTransform.matrix());
  //     const currentAngle = Math.atan2(
  //       currentDiagramPoint.y - center.y,
  //       currentDiagramPoint.x - center.x,
  //     );
  //     const previousAngle = Math.atan2(
  //       previousDiagramPoint.y - center.y,
  //       previousDiagramPoint.x - center.x,
  //     );
  //     const diffAngle = minAngleDiff(previousAngle, currentAngle);

  //     let transform = this.elements._circle.transform._dup();
  //     if (rad.state.isBeingMoved) {
  //       transform = rad.transform._dup();
  //     }
  //     if (endLine.state.isBeingMoved && this.elements.varState.angleSelected === 'adjacent') {
  //       transform = this.elements._circle._endLine.transform._dup();
  //     }
  //     const rot = transform.r();
  //     if (rot != null) {
  //       transform.updateRotation(rot - diffAngle);
  //       if (endLine.state.isBeingMoved && this.elements.varState.angleSelected === 'adjacent') {
  //         this.elements._circle._endLine.moved(transform._dup());
  //       } else if (rad.state.isBeingMoved) {
  //         this.elements._circle._radius.moved(transform._dup());
  //       } else if (endLine.state.isBeingMoved
  //         || startLine.state.isBeingMoved) {
  //         this.elements._circle.moved(transform._dup());
  //       }
  //     }
  //   } else {
  //     return super.touchMoveHandler(previousClientPoint, currentClientPoint);
  //   }
  //   this.animateNextFrame();
  //   return true;
  // }
}

export default LessonDiagram;