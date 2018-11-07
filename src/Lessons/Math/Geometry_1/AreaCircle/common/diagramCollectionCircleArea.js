// @flow
import LessonDiagram from './diagram';
import {
  Transform,
} from '../../../../../js/diagram/tools/g2';
import {
  DiagramElementPrimative,
} from '../../../../../js/diagram/Element';
import { addSelectorHTML } from '../../../../LessonsCommon/tools/selector';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';

export default class CircleAreaCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _selector: DiagramElementPrimative;
  _circle: DiagramElementPrimative;
  _poly6: DiagramElementPrimative;
  _lines6: DiagramElementPrimative;
  _poly9: DiagramElementPrimative;
  _lines9: DiagramElementPrimative;
  _poly25: DiagramElementPrimative;
  _lines25: DiagramElementPrimative;

  addCircle() {
    const circle = this.diagram.shapes.polygon(
      this.layout.circle.numSides, this.layout.circle.radius,
      this.layout.circle.width,
      0, 1, this.layout.circle.numSides, this.layout.colors.diagram.disabled,
      new Transform('cicle'),
    );
    this.add('circle', circle);
  }

  addTriangles() {
    const lay = this.layout.polygons;
    lay.sides.forEach((sideNum) => {
      const lines = this.diagram.shapes.radialLines(
        0, lay.radius, lay.width, Math.PI * 2 / sideNum,
        this.layout.colors.lines, new Transform('lines'),
      );
      this.add(`lines${sideNum}`, lines);

      const poly = this.diagram.shapes.polygon(
        sideNum, lay.radius, lay.borderWidth,
        0, 1, sideNum, this.layout.colors.lines,
        new Transform('poly'),
      );
      this.add(`poly${sideNum}`, poly);
    });
  }


  addSelector() {
    addSelectorHTML(
      this.diagram,
      this,
      'selector',
      'lesson__circle_area_selector',
      this.selectorClicked.bind(this),
      'horizontal',
    );
    this._selector.setPosition(this.layout.selector.position);
  }

  selectorClicked(title: string) {
    this.showTriangles(parseInt(title, 10));
  }

  showTriangles(numSides: number) {
    this.layout.polygons.sides.forEach((sides) => {
      // $FlowFixMe
      const polygon = this[`_poly${sides}`];
      // $FlowFixMe
      const lines = this[`_lines${sides}`];
      if (sides === numSides) {
        polygon.show();
        lines.show();
      } else {
        polygon.hide();
        lines.hide();
      }
    });
    this.diagram.animateNextFrame();
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.addCircle();
    this.addTriangles();
    this.addSelector();
    this.setPosition(this.layout.position);
    this.hasTouchableElements = true;
  }
}
