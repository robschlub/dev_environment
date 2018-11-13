// @flow
import LessonDiagram from './diagram';
import {
  Transform, polarToRect,
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

  addCircle() {
    const lay = this.layout.circle;
    const circle = this.diagram.shapes.polygon(lay.def);
    const fill = this.diagram.shapes.polygon(lay.def, lay.fill);
    this.add('fillCircle', fill);
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

      const heightDimension = lay.def.radius * Math.cos(Math.PI * 2 / sideNum / 2);
      const height = this.diagram.objects.line({
        vertexSpaceStart: 'start',
        length: heightDimension,
        angle: -Math.PI * 2 / sideNum / 2,
        width: lay.def.width,
        color: this.layout.colors.height,
        label: {
          text: 'h',
          location: 'top',
          orientation: 'horizontal',
          offset: -0.02,
          linePosition: 0.5 + 0.4 * sideNum / Math.max(...lay.sides),
        },
      });
      this.add(`height${sideNum}`, height);

      const base = this.diagram.objects.line({
        vertexSpaceStart: 'start',
        p1: polarToRect(lay.def.radius - lay.def.width / 2, 0),
        p2: polarToRect(lay.def.radius - lay.def.width / 2, -Math.PI * 2 / sideNum),
        width: lay.def.width,
        color: this.layout.colors.border,
        label: {
          text: 'b',
          location: 'right',
          orientation: 'horizontal',
          offset: -0.02,
        },
      });
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
    this.addCircle();
    this.addTriangles();
    this.addSelector();
    this.setPosition(this.layout.position);
    this.addEquations();
    this.hasTouchableElements = true;
    console.log(this)
  }
}
