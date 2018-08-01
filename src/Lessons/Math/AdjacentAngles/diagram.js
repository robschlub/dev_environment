// @flow
// import { DiagramElementCollection } from '../../../js/diagram/Element';
import AdjacentAnglesCollection from './diagramCollectionCircle';
import type { AdjacentAnglesCollectionType } from './diagramCollectionCircle';
import lessonLayout from './layout';
import AngleCircleDiagram from '../../../LessonsCommon/AngleCircle/diagram';
import { Point } from '../../../js/diagram/tools/g2';

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
    if (this.elements._circle._radius.state.isBeingMoved) {
      this.elements.enableAutoChange = true;
    }
    return super.touchMoveHandler(previousClientPoint, currentClientPoint);
  }
}

export default LessonDiagram;
