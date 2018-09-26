// @flow
import { Transform } from '../../../../js/diagram/tools/g2';
import lessonLayout from './layout';

// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';

// import TriangleCollection from '../common/diagramCollectionTriangle';
import CommonLessonDiagramCollection from '../common/diagramCollection';
import TotalAngleTriangleCollection from '../common/diagramCollectionTriangles';

export default class DiagramCollection extends CommonLessonDiagramCollection {
  _triangle: TotalAngleTriangleCollection;

  constructor(
    diagram: LessonDiagram,
    transform: Transform = new Transform('1 DiagramCollection'),
  ) {
    const layout = lessonLayout();
    super(diagram, layout, transform);

    this.add('triangle', new TotalAngleTriangleCollection(diagram, this.layout));
  }

  showCombination(type: string) {
    // const tri = this._triangle._tri1;
    const angle1 = this._triangle._tri1._angle1;
    const angle2 = this._triangle._tri1._angle2;
    const angle3 = this._triangle._tri1._angle3;
    const side12 = this._triangle._tri1._dimension12;
    const side23 = this._triangle._tri1._dimension23;
    const side31 = this._triangle._tri1._dimension31;
    if (type === 'sas') {
      angle1.showAll();
      angle2.hide();
      angle3.hide();
      side12.showAll();
      side23.hide();
      side31.showAll();
    }
    if (type === 'sss') {
      angle1.hide();
      angle2.hide();
      angle3.hide();
      side12.showAll();
      side23.showAll();
      side31.showAll();
    }
    if (type === 'asa') {
      angle1.showAll();
      angle2.showAll();
      angle3.hide();
      side12.showAll();
      side23.hide();
      side31.hide();
    }
    if (type === 'aas') {
      angle1.showAll();
      angle2.showAll();
      angle3.hide();
      side12.hide();
      side23.showAll();
      side31.hide();
    }
    if (type === 'aaa') {
      angle1.showAll();
      angle2.showAll();
      angle3.showAll();
      side12.hide();
      side23.hide();
      side31.hide();
    }
    if (type === 'ssa') {
      angle1.showAll();
      angle2.hide();
      angle3.hide();
      side12.showAll();
      side23.showAll();
      side31.hide();
    }
    this.diagram.animateNextFrame();
  }
}
