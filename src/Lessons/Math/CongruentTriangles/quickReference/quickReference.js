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
  }

  toggleCongruentRotate() {
    const lay = this.layout.triangles;
    const tri = this._triangle;
    const tri1 = lay.congruentRot.tri1.scenario;
    const tri2 = lay.congruentRot.tri2.scenario;
    const r = tri._tri2.transform.r();
    if (r != null) {
      tri2.rotation = normAngle(r + rand(Math.PI));
    }
    tri.calcTriFuturePositions(tri1, tri2);
    tri.moveToFuturePositions(1);
    this.diagram.animateNextFrame();
  }

  toggleCongruentFlip() {
    const lay = this.layout.triangles;
    const tri = this._triangle;
    const tri1 = lay.congruent.tri1.scenario;
    const tri2 = lay.congruent.tri2.scenario;
    const r = tri._tri2.transform.r();
    if (r != null) {
      tri2.rotation = r;
    }
    let s = tri._tri2.transform.s();
    if (s != null) {
      s = s.x / Math.abs(s.x) * -1;
      tri2.scale = new Point(s, 1);
    }
    tri.calcTriFuturePositions(tri1, tri2);
    tri.moveToFuturePositions(1);
    this.diagram.animateNextFrame();
  }

  toggleCongruent() {
    const next = removeRandElement([
      this.toggleCongruentFlip.bind(this),
      this.toggleCongruentRotate.bind(this),
    ]);
    next.call(this);
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
    tri._tri2.update = () => {
      
      const s = tri._tri2.transform.s();
      if (s != null) {
        tri._tri2._angle1.label.updateScale(s);
        tri._tri2._angle2.label.updateScale(s);
        tri._tri2._angle3.label.updateScale(s);
        tri._tri2._dimension12.label.updateScale(s);
      }
      tri._tri2.updateAngles();
      tri._tri2.updateDimensions();
    };
    tri._tri2.setTransformCallback = tri._tri2.update.bind(tri._tri2);
    this.diagram.animateNextFrame();
  }
}

