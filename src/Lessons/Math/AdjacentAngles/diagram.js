// @flow
// import { DiagramElementCollection } from '../../../js/diagram/Element';
import AdjacentAnglesCollection from './diagramCollectionCircle';
import type { AdjacentAnglesCollectionType } from './diagramCollectionCircle';
import lessonLayout from './layout';
import AngleCircleDiagram from '../../../LessonsCommon/AngleCircle/diagram';
import { Point, minAngleDiff } from '../../../js/diagram/tools/g2';

// type typeElements = {
//   _circle: extendedCircleType;
// } & DiagramElementCollection ;

// $FlowFixMe
class LessonDiagram extends AngleCircleDiagram {
  elements: AdjacentAnglesCollectionType;

  constructor(id: string) {
    super(id, lessonLayout(), AdjacentAnglesCollection);
  }

  touchMoveHandler(
    previousClientPoint: Point,
    currentClientPoint: Point,
  ): boolean {
    if (this.beingMovedElements.length === 0) {
      return false;
    }
    const rad = this.elements._circle._radius;
    const endLine = this.elements._circle._endLine;
    if (rad.state.isBeingMoved
      || endLine.state.isBeingMoved) {
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

      let transform = this.elements._circle._endLine.transform.copy();
      if (rad.state.isBeingMoved) {
        transform = this.elements._circle._radius.transform.copy();
      }
      const rot = transform.r();
      if (rot != null) {
        transform.updateRotation(rot - diffAngle);
        if (rad.state.isBeingMoved) {
          this.elements._circle._radius.moved(transform.copy());
        } else {
          this.elements._circle._endLine.moved(transform.copy());
        }
      }
    } else {
      return super.touchMoveHandler(previousClientPoint, currentClientPoint);
    }
    this.animateNextFrame();
    return true;
  }
}

export default LessonDiagram;
