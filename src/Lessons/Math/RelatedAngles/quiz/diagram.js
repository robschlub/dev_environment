// @flow
import RelatedAnglesCommonLessonDiagram from '../common/diagram';

// eslint-disable-next-line import/no-cycle
import QuizCollection from './diagramCollection';
import { Transform } from '../../../../js/diagram/tools/g2';

class LessonDiagram extends RelatedAnglesCommonLessonDiagram {
  elements: QuizCollection;

  createDiagramElements() {
    super.createDiagramElements();
    this.elements = new QuizCollection(this, new Transform().translate(0, 0));

    this.elements.hasTouchableElements = true;
  }
}

export default LessonDiagram;
