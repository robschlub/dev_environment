// @flow
import Diagram from '../../../js/diagram/Diagram';
import Lesson from '../../../js/Lesson/Lesson';
// import { DiagramElementCollection, DiagramElementPrimative } from '../../../js/diagram/Element';
// eslint-disable-next-line import/no-cycle
import RelatedAnglesCollection from './diagramCollection';
// eslint-disable-next-line import/no-cycle
// import type { MoveableLineType } from './diagramCollectionCommon';
import {
  Transform,
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

  touchUpHandler() {
    super.touchUpHandler();
    if (this.elements._parallel.isShown) {
      this.elements._parallel.checkForParallel(true);
    }
  }

}

export default LessonDiagram;
