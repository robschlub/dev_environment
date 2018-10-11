// @flow
import Diagram from '../../../../js/diagram/Diagram';
import { DiagramElementCollection } from '../../../../js/diagram/Element';
// import ShapesCollection from './diagramCollectionShapes';
import CircleCollection from './diagramCollectionCircle';
// import getScssColors from '../../../js/tools/getScssColors';
// import styles from './style.scss';
import { Transform } from '../../../../js/diagram/tools/g2';
// import getCssVariables from '../../js/tools/getCssVariables';
import lessonLayout from './layout';

const layout = lessonLayout();
const { colors } = layout;
const backgroundColor = colors.diagram.background;

type typeElements = {
  _circle: CircleCollection;
} & DiagramElementCollection ;

// $FlowFixMe
class LessonDiagram extends Diagram {
  elements: typeElements;

  constructor(id: string) {
    const { limits } = layout;
    super(
      `${id}`,
      limits.left,
      limits.bottom,
      limits.width,
      limits.height,
      backgroundColor,
      layout,
      'withTexture',
      'withTexture',
    );
  }

  createDiagramElements() {
    const { shapes } = this;
    this.elements = shapes.collection();

    const circleCollection = new CircleCollection(this, new Transform()
      .translate(layout.position));
    this.add('circle', circleCollection);

    this.fontScale = 1.2;
  }

  resize() {
    const { limits } = layout;
    this.limits = limits;
    this.elements.updateLimits(limits);
    this.elements._circle.resize();
    super.resize();
  }
}

export default LessonDiagram;
