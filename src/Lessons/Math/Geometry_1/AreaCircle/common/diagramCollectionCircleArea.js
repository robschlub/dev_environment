// @flow
import LessonDiagram from './diagram';
import {
  Transform, Rect,
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
  _circleFill: DiagramElementPrimative;
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
    const circle = this.diagram.shapes.polygon(lay.default, lay.circle);
    const backgroundCircle = this.diagram.shapes.polygon(lay.default, lay.back);
    const fill = this.diagram.shapes.polygon(lay.default, lay.fill);
    this.add('circleFill', fill);
    this.add('backgroundCircle', backgroundCircle);
    this.add('circle', circle);
  }

  addTriangles() {
    const lay = this.layout.polygon;
    this.layout.polygonSides.forEach((sideNum) => {
      const fill = this.diagram.shapes.polygon(
        lay.default, lay.fill, { sides: sideNum },
      );
      this.add(`fill${sideNum}`, fill);

      const triFill = this.diagram.shapes.fan(this.layout.triangle.fill(sideNum));
      this.add(`triFill${sideNum}`, triFill);

      const radialLines = this.layout.radialLines.lines(sideNum);
      const lines = this.diagram.shapes.radialLines(
        radialLines.innerRadius,
        radialLines.outerRadius,
        radialLines.width,
        radialLines.angleStep,
        radialLines.color,
        radialLines.transform,
      );
      this.add(`lines${sideNum}`, lines);

      const poly = this.diagram.shapes.polygon(
        lay.default, lay.polygon, { sides: sideNum },
      );
      this.add(`poly${sideNum}`, poly);

      const border = this.diagram.shapes.polygon(
        lay.default, lay.border, { sides: sideNum },
      );
      this.add(`border${sideNum}`, border);

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
    this.showTriangles(parseInt(title, 10), 'tri');
  }

  showTriangles(numSides: number, area: 'tri' | 'tris' | 'circle' | 'none') {
    this.layout.polygonSides.forEach((sides) => {
      // $FlowFixMe
      const polygon = this[`_poly${sides}`];
      // $FlowFixMe
      const border = this[`_border${sides}`];
      // $FlowFixMe
      const fill = this[`_fill${sides}`];
      // $FlowFixMe
      const height = this[`_height${sides}`];
      // $FlowFixMe
      const base = this[`_base${sides}`];
      // $FlowFixMe
      const lines = this[`_lines${sides}`];
      // $FlowFixMe
      const triFill = this[`_triFill${sides}`];
      if (sides === numSides) {
        polygon.show();
        if (area === 'tris') {
          fill.show();
        }
        lines.show();
        height.showAll();
        base.showAll();
        border.show();
        if (area === 'tri') {
          triFill.show();
        }
      } else {
        polygon.hide();
        fill.hide();
        lines.hide();
        height.hideAll();
        base.hideAll();
        border.hide();
        triFill.hide();
      }
    });
    if (area === 'circle') {
      this._circleFill.show();
    } else {
      this._circleFill.hide();
    }
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
