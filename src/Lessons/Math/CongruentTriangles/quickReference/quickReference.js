// @flow

import { Transform } from '../../../../js/diagram/tools/g2';
import lessonLayout from './layout';
import * as html from '../../../../js/tools/htmlGenerator';
import TriangleCollection from '../common/diagramCollectionTriangles';
import PopupBoxCollection from '../../../../LessonsCommon/DiagramCollectionPopup';
import details from '../details';

class QRCongruent extends PopupBoxCollection {
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

    this.setLink(details.details.uid);
  }

  setDescription(specificText: string, extraModifiers: Object = {}) {
    const finalText = `<p>
        Two triangles are |congruent| (same size and shape) if they share the same |side_lengths| and |angles|.
      </p>
      ${specificText}
      <p>
        Triangles will be congruent even if |rotated| or |mirrored|.
      </p>`;
    const modifiers = Object.assign({}, {
      angles: html.highlight(this.layout.colors.angleLabels),
      side_lengths: html.highlight(this.layout.colors.lineLabels),
      rotated: html.click(
        this._triangle.toggleCongruentRotate, [this._triangle],
        this.layout.colors.line,
      ),
      mirrored: html.click(
        this._triangle.toggleCongruentFlip, [this._triangle],
        this.layout.colors.line,
      ),
    }, extraModifiers);
    super.setDescription(finalText, modifiers);
  }

  show() {
    this.setDiagramSize(2.5, 1.5);
    super.show();
    const tri = this._triangle;
    const lay = this.layout.triangles.congruent;
    
    this.hasTouchableElements = true;
    tri.hasTouchableElements = true;
    tri._tri2.isMovable = true;
    tri._tri2.isTouchable = true;
    tri._tri2.touchInBoundingRect = true;
    tri._tri2.move.type = 'rotation';

    tri.setTriangleScenarios(lay.points, lay.points, lay.tri1.scenario, lay.tri2.scenario);
    tri.show();
    tri._tri1.show();
    tri._tri2.show();
    tri._tri1._line.show();
    tri._tri2._line.show();
    tri.transform.updateScale(0.7, 0.7);
    tri.setPosition(0, 0.75);
    this.diagram.animateNextFrame();
  }
}

export class QRAsa extends QRCongruent {
  _triangle: TriangleCollection;
  last: string;

  constructor(
    diagram: Object,
    transform: Transform = new Transform().scale(1, 1).translate(0, 0),
  ) {
    super(diagram, transform);
    const modifiers = {
      two_angles: html.highlight(this.layout.colors.angleLabels),
      side_between_them: html.highlight(this.layout.colors.lineLabels),
    };

    this.setTitle('Congruent by Angle-Side-Angle');
    this.setDescription(`
      <p>
        All angles and side lengths of a triangle can be calculated if only |two_angles| and the |side_between_them| is known (|Angle-Side-Angle configuration|). Therefore, if two triangles share the same two angles and enclosed side length, the triangles will be congruent.
      </p>`, modifiers);
  }

  show() {
    super.show();
    const tri = this._triangle;
    tri._tri1._angle1.showAll();
    tri._tri2._angle1.showAll();
    tri._tri1._angle2.showAll();
    tri._tri2._angle2.showAll();
    tri._tri1._dimension12.showAll();
    tri._tri2._dimension12.showAll();
    this.diagram.animateNextFrame();
  }
}

export class QRSss extends QRCongruent {
  _triangle: TriangleCollection;
  last: string;

  constructor(
    diagram: Object,
    transform: Transform = new Transform().scale(1, 1).translate(0, 0),
  ) {
    super(diagram, transform);
    const modifiers = {
      three_side_lengths: html.highlight(this.layout.colors.lineLabels),
    };

    this.setTitle('Congruent by Side-Side-Side');
    this.setDescription(`
      <p>
        All angles and side lengths of a triangle can be calculated if only the |three_side_lengths| are known (|Side-Side-Side configuration|). Therefore, if two triangles share the same side lengths, the triangles will be congruent.
      </p>`, modifiers);
  }

  show() {
    super.show();
    const tri = this._triangle;
    tri._tri1._dimension12.showAll();
    tri._tri2._dimension12.showAll();
    tri._tri1._dimension23.showAll();
    tri._tri2._dimension23.showAll();
    tri._tri1._dimension31.showAll();
    tri._tri2._dimension31.showAll();
    this.diagram.animateNextFrame();
  }
}

