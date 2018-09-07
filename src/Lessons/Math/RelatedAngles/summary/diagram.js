// @flow
import RelatedAnglesCommonLessonDiagram from '../common/diagram';

// eslint-disable-next-line import/no-cycle
import RelatedAngles1Collection from './diagramCollection';
import { Transform } from '../../../../js/diagram/tools/g2';

class LessonDiagram extends RelatedAnglesCommonLessonDiagram {
  elements: RelatedAngles1Collection;

  createDiagramElements() {
    super.createDiagramElements();
    this.elements = new RelatedAngles1Collection(this, new Transform().translate(0, 0));

    this.elements.hasTouchableElements = true;
  }
}

export default LessonDiagram;
