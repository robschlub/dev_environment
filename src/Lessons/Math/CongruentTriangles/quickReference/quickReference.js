// @flow

import { Transform, normAngle, Point } from '../../../../js/diagram/tools/g2';
import lessonLayout from './layout';
import * as html from '../../../../js/tools/htmlGenerator';
import TriangleCollection from '../common/diagramCollectionTriangles';
import PopupBoxCollection from '../../../../LessonsCommon/DiagramCollectionPopup';
import details from '../details';
import {
  rand, removeRandElement,
} from '../../../../js/diagram/tools/mathtools';


export default class QRAsa extends PopupBoxCollection {
  _triangle: TriangleCollection;
  last: string;

  constructor(
    diagram: Object,
    transform: Transform = new Transform().scale(1, 1).translate(0, 0),
  ) {
    const layout = lessonLayout();
    super(
      diagram,
      layout,
      transform,
      'triangle',
      TriangleCollection,
    );
    this.hasTouchableElements = true;

    const modifiers = {
      two_angles_that_are_equal: html.highlight(this.layout.colors.colorA),
      side_between_the_two_angles_is_also_equal: html.highlight(this.layout.colors.colorB),
      congruent: html.click(this.toggleCongruent, [this], this.layout.colors.line),
    };

    this.setTitle('Congruent by Angle-Side-Angle');
    this.setDescription('When two triangles have |two_angles_that_are_equal| , and the |side_between_the_two_angles_is_also_equal|, then the triangles are |congruent|.', modifiers);
    this.setLink(details.details.uid);
    this.last = 'rotate';
  }

  toggleCongruentRotate() {
    const lay = this.layout.triangles;
    const tri = this._triangle;
    const tri1 = Object.assign({}, lay.congruentRot.tri1.scenario);
    const tri2 = Object.assign({}, lay.congruentRot.tri2.scenario);
    const r = tri._tri2.transform.r();
    if (r != null) {
      tri2.rotation = r + normAngle(rand(Math.PI));
    }
    tri.calcTriFuturePositions(tri1, tri2);
    tri.moveToFuturePositions(1);
    this.diagram.animateNextFrame();
  }

  toggleCongruentFlip() {
    const lay = this.layout.triangles;
    const tri = this._triangle;
    const tri1 = lay.congruent.tri1.scenario;
    const tri2 = Object.assign({}, lay.congruent.tri2.scenario);
    let s = tri._tri2.transform.s();
    const r = tri._tri2.transform.r();
    if (s != null && r != null) {
      s = s.x / Math.abs(s.x) * -1;
      tri2.scale = new Point(s, 1);
      tri2.rotation = r;
      tri.calcTriFuturePositions(tri1, tri2);
      const done = () => {
        tri._tri2.setTriangleCollectionScaleTo(new Point(1, 1));
        tri._tri2._angle1.showAll();
        tri._tri2._angle2.showAll();
        tri._tri2._dimension12.showAll();
      };
      tri._tri2._angle1.hide();
      tri._tri2._angle2.hide();
      tri._tri2._dimension12.hide();
      tri.moveToFuturePositions(1, done);
    }
    this.diagram.animateNextFrame();
  }

  toggleCongruent() {
    const chooseFrom = ['flip', 'rotate'];
    if (this.last === 'flip') {
      chooseFrom.push('rotate');
      chooseFrom.push('rotate');
    } else {
      chooseFrom.push('flip');
      chooseFrom.push('flip');
    }
    const next = removeRandElement(chooseFrom);
    this.last = next;

    if (next === 'flip') {
      this.toggleCongruentFlip();
    } else {
      this.toggleCongruentRotate();
    }
  }

  show() {
    this.setDiagramSize(2.5, 1.2);
    super.show();
    const tri = this._triangle;
    const lay = this.layout.triangles.congruent;
    tri.setTriangleScenarios(lay.points, lay.points, lay.tri1.scenario, lay.tri2.scenario);

    tri.show();
    tri._tri1.show();
    tri._tri2.show();
    tri._tri1._angle1.showAll();
    tri._tri2._angle1.showAll();
    tri._tri1._angle2.showAll();
    tri._tri2._angle2.showAll();
    tri._tri1._dimension12.showAll();
    tri._tri2._dimension12.showAll();
    tri._tri1._line.show();
    tri._tri2._line.show();
    tri.transform.updateScale(0.7, 0.7);
    this.diagram.animateNextFrame();
  }
}

