// @flow
import CommonLessonDiagram from '../common/diagram';

// eslint-disable-next-line import/no-cycle
import DiagramCollection from './diagramCollection';
import { Transform } from '../../../../js/diagram/tools/g2';

class LessonDiagram extends CommonLessonDiagram {
  elements: DiagramCollection;

  createDiagramElements() {
    super.createDiagramElements();
    this.elements = new DiagramCollection(this, new Transform().translate(0, 0));

    this.elements.hasTouchableElements = true;
  }

  touchUpHandler() {
    super.touchUpHandler();
    if (this.elements._parallel.isShown) {
      this.elements._parallel.checkForParallel(true);
    }
  }
}

export default LessonDiagram;
