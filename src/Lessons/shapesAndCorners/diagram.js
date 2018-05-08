// @flow
import Diagram from '../../js/diagram/Diagram';
import ShapesCollection from './diagramCollectionShapes';
import CircleCollection from './diagramCollectionCircle';
import getScssColors from '../../js/tools/getScssColors';
import styles from './style.scss';

const colors = getScssColors(styles);

const backgroundColor = colors.background;
// const backgroundColor = [1, 1, 1, 0];

// $FlowFixMe
class LessonDiagram extends Diagram {
  constructor(id: string) {
    super(`${id}`, -2, -1.5, 4, 3, backgroundColor);
  }
  createDiagramElements() {
    const { shapes } = this;
    this.elements = shapes.collection();

    const shapesCollection = new ShapesCollection(this);
    this.add('shapes', shapesCollection);

    const circleCollection = new CircleCollection(this);
    this.add('circle', circleCollection);

    this.isTouchable = true;
    this.isMovable = true;
  }
}

export default LessonDiagram;
