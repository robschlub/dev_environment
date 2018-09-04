// @flow
import Diagram from '../../../../js/diagram/Diagram';
import Lesson from '../../../../js/Lesson/Lesson';

// eslint-disable-next-line import/no-cycle
// import RelatedAnglesCollection from './diagramCollection';
// import {
//   Transform,
// } from '../../../../js/diagram/tools/g2';

export type LessonDiagramType = {
  layout: Object;
  lesson: Lesson;
} & Diagram;

export default class RelatedAnglesCommonLessonDiagram extends Diagram {
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
    // this.elements = new RelatedAnglesCollection(this, new Transform().translate(0, 0));

    // this.elements.hasTouchableElements = true;
    this.fontScale = 1.2;
  }

  resize() {
    this.elements.updateLimits(this.limits);
    // this.elements._circle.resize();
    super.resize();
  }

  // touchUpHandler() {
  //   super.touchUpHandler();
  //   if (this.elements._parallel.isShown) {
  //     this.elements._parallel.checkForParallel(true);
  //   }
  // }
}
