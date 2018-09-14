// @flow
import CommonLessonDiagram from '../common/diagram';

// eslint-disable-next-line import/no-cycle
import DiagramCollection from './diagramCollection';
import { Transform } from '../../../../js/diagram/tools/g2';

export default class LessonDiagram extends CommonLessonDiagram {
  elements: DiagramCollection;

  createDiagramElements() {
    super.createDiagramElements();
    this.elements = new DiagramCollection(this, new Transform().translate(0, 0));

    this.elements.hasTouchableElements = true;
  }
}

// export class OverlayLessonDiagram extends CommonOverlayLessonDiagram {
//   elements: OverlayDiagramCollection;

//   createDiagramElements() {
//     super.createDiagramElements();

//     this.elements = new OverlayDiagramCollection(this, new Transform().translate(0, 0));

//     this.elements.hasTouchableElements = true;
//     // this.elements = new DiagramCollection(this, new Transform().translate(0, 0));

//     // this.elements.hasTouchableElements = true;
//   }
// }
