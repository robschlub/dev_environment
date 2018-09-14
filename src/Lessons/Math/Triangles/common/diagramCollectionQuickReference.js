// @flow
import LessonDiagram from './diagram';
import {
  Transform,
} from '../../../../js/diagram/tools/g2';
// import {
//   DiagramElementPrimative,
// } from '../../../../js/diagram/Element';
// import {
//   removeRandElement, rand,
// } from '../../../../js/diagram/tools/mathtools';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';

// import makeTriangle from '../../../../LessonsCommon/tools/triangle';
// import type { TypeTriangle, TypeTriangleAngle } from '../../../../LessonsCommon/tools/triangle';

import AlternateAnglesQR from '../../RelatedAngles/quickReference/alternateAngles';

export default class QuickReferenceCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _alternateAngles: AlternateAnglesQR;
  // _supplementaryAngles: DiagramElementCollection;


  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.add('alternateAngles', new AlternateAnglesQR(this.diagram));
    this.hasTouchableElements = true;
  }
}
