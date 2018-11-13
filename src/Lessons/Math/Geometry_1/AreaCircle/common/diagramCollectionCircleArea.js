// @flow
import LessonDiagram from './diagram';
import {
  Transform, polarToRect, Rect,
} from '../../../../../js/diagram/tools/g2';
import {
  DiagramElementPrimative,
} from '../../../../../js/diagram/Element';
import { addSelectorHTML } from '../../../../LessonsCommon/tools/selector';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';
import {
  addTriRectEquation,
} from './equations';

export default class CircleAreaCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _selector: DiagramElementPrimative;
  _circle: DiagramElementPrimative;
  _fillCircle: DiagramElementPrimative;
  _poly6: DiagramElementPrimative;
  _fill6: DiagramElementPrimative;
  _lines6: DiagramElementPrimative;
  _poly9: DiagramElementPrimative;
  _lines9: DiagramElementPrimative;
  _fill9: DiagramElementPrimative;
  _poly25: DiagramElementPrimative;
  _lines25: DiagramElementPrimative;
  _fill25: DiagramElementPrimative;

  addGrid() {
    const lay = this.layout.grid;
    const grid = this.diagram.shapes.grid(
      new Rect(
        -lay.length / 2, -lay.height / 2,
        lay.length, lay.height,
      ),
      lay.spacing, lay.spacing, 2, this.layout.colors.grid,
      new Transform().translate(lay.position),
    );
    this.add('grid', grid);
  }

  addCircles() {
    const lay = this.layout.circle;
    const circle = this.diagram.shapes.polygon(lay.def);
    const backgroundCircle = this.diagram.shapes.polygon(lay.def, lay.back);
    const fill = this.diagram.shapes.polygon(lay.def, lay.fill);
    this.add('fillCircle', fill);
    this.add('backgroundCircle', backgroundCircle);
    this.add('circle', circle);
  }

  addTriangles() {
    const lay = this.layout.polygons;
    lay.sides.forEach((sideNum) => {
      const fill = this.diagram.shapes.polygon(
        lay.def, lay.fill, { sides: sideNum },
      );
      this.add(`fill${sideNum}`, fill);

      const lines = this.diagram.shapes.radialLines(
        0, lay.def.radius, lay.radiusWidth, Math.PI * 2 / sideNum,
        this.layout.colors.lines, new Transform('lines'),
      );
      this.add(`lines${sideNum}`, lines);

      const poly = this.diagram.shapes.polygon(
        lay.def, { sides: sideNum },
      );
      this.add(`poly${sideNum}`, poly);

      const height = this.diagram.objects.line(this.layout.triangle.height(sideNum));
      this.add(`height${sideNum}`, height);

      const base = this.diagram.objects.line(this.layout.triangle.base(sideNum));
      this.add(`base${sideNum}`, base);
    });
  }

  addEquations() {
    addTriRectEquation(this.diagram, this.layout, this, 'triRectEqn');
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
      const fill = this[`_fill${sides}`];
      // $FlowFixMe
      const height = this[`_height${sides}`];
      // $FlowFixMe
      const base = this[`_base${sides}`];
      // $FlowFixMe
      const lines = this[`_lines${sides}`];
      if (sides === numSides) {
        polygon.show();
        fill.show();
        lines.show();
        height.showAll();
        base.showAll();
      } else {
        polygon.hide();
        fill.hide();
        lines.hide();
        height.hideAll();
        base.hideAll();
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
    this.addGrid();
    this.addCircles();
    this.addTriangles();
    this.addSelector();
    this.setPosition(this.layout.position);
    this.addEquations();
    this.hasTouchableElements = true;
  }
}
