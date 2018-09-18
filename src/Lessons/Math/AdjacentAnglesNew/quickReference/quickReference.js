// @flow

import { Transform, Point } from '../../../../js/diagram/tools/g2';
import lessonLayout from './layout';
import * as html from '../../../../js/tools/htmlGenerator';
import AdjacentCollection from '../common/diagramCollectionAdjacent';
import PopupBoxCollection from '../../../../LessonsCommon/DiagramCollectionPopup';

function showAdjacent(
  adjacent: AdjacentCollection,
  colorA: Array<number>,
  colorB: Array<number>,
  position: Point,
) {
  // adjacent.transform.updateTranslation(position);
  adjacent.transform.updateScale(0.7, 0.7);
  adjacent.transform.updateRotation(0);
  adjacent.calculateFuturePositions(adjacent.angleType);
  adjacent.setFuturePositions();
  adjacent.show();
  adjacent._lines.show();
  adjacent._lines._line1.showAll();
  adjacent._lines._line2.showAll();
  adjacent._lines._line3.showAll();
  adjacent.showAngles([
    [adjacent._lines._angleA, 'a', colorA],
    [adjacent._lines._angleB, 'b', colorB],
  ]);
  // eslint-disable-next-line no-param-reassign
  adjacent._lines._line3.isTouchable = false;
  // eslint-disable-next-line no-param-reassign
  adjacent._lines._line3.hasTouchableElements = false;
  // eslint-disable-next-line no-param-reassign
  adjacent._lines._line3.isMovable = false;
  // eslint-disable-next-line no-param-reassign
  adjacent._lines._line1.isTouchable = false;
  // eslint-disable-next-line no-param-reassign
  adjacent._lines._line1.hasTouchableElements = false;
  // eslint-disable-next-line no-param-reassign
  adjacent._lines._line1.isMovable = false;
  adjacent._lines.setPosition(position);
}

export class QRComplementaryAngles extends PopupBoxCollection {
  _adjacent: AdjacentCollection;

  constructor(
    diagram: Object,
    transform: Transform = new Transform('QRComplementaryAngles').scale(1, 1).translate(0, 0),
  ) {
    const layout = lessonLayout();
    super(diagram, layout, transform, 'adjacent', AdjacentCollection);
    this.hasTouchableElements = true;
    const modifiers = {
      Complementary_Angles: html.click(
        this._adjacent.goToRandomComplementaryAngle,
        [this._adjacent], this.layout.colors.angleA,
      ),
    };
    this.setTitle('Complementary Angles');
    this.setDescription('|Complementary_Angles| add up to 90º or &pi;/2 radians.', modifiers);
  }

  show() {
    this.setDiagramSize(2, 1.5);
    super.show();
    this._adjacent._eqn.show();
    this._adjacent.eqn.showForm('com_add');
    this._adjacent._eqn.setPosition(this.layout.complementary.equationPosition);
    this._adjacent.angleType = 'complementary';
    showAdjacent(
      this._adjacent,
      this.layout.colors.angleA,
      this.layout.colors.angleB,
      this.layout.complementary.linesPosition,
    );
  }
}


export class QRSupplementaryAngles extends PopupBoxCollection {
  _adjacent: AdjacentCollection;

  constructor(
    diagram: Object,
    transform: Transform = new Transform().scale(1, 1).translate(0, 0),
  ) {
    const layout = lessonLayout();
    super(diagram, layout, transform, 'adjacent', AdjacentCollection);
    this.hasTouchableElements = true;

    const modifiers = {
      Supplementary_Angles: html.click(
        this._adjacent.goToRandomSupplementaryAngle,
        [this._adjacent], this.layout.colors.angleA,
      ),
    };

    this.setTitle('Supplementary Angles');
    this.setDescription('|Supplementary_Angles| add up to 180º or &pi; radians.', modifiers);
  }

  show() {
    this.setDiagramSize(2, 1.5);
    super.show();
    this._adjacent._eqn.show();
    this._adjacent.eqn.showForm('sup_add');
    this._adjacent._eqn.setPosition(this.layout.supplementary.equationPosition);
    this._adjacent.angleType = 'supplementary';
    showAdjacent(
      this._adjacent,
      this.layout.colors.angleA,
      this.layout.colors.angleB,
      this.layout.supplementary.linesPosition,
    );
  }
}


export class QRExplementaryAngles extends PopupBoxCollection {
  _adjacent: AdjacentCollection;

  constructor(
    diagram: Object,
    transform: Transform = new Transform().scale(1, 1).translate(0, 0),
  ) {
    const layout = lessonLayout();
    super(diagram, layout, transform, 'adjacent', AdjacentCollection);
    this.hasTouchableElements = true;

    const modifiers = {
      Explementary_Angles: html.click(
        this._adjacent.goToRandomExplementaryAngle,
        [this._adjacent], this.layout.colors.angleA,
      ),
    };

    this.setTitle('Explementary Angles');
    this.setDescription('|Explementary_Angles| add up to 360º or 2&pi; radians.', modifiers);
    this.setLink('/Lessons/Math/AdjacentAngles/1');
  }

  show() {
    this.setDiagramSize(2.5, 2);
    super.show();
    this._adjacent._eqn.show();
    this._adjacent.eqn.showForm('exp_add');
    this._adjacent._eqn.setPosition(this.layout.explementary.equationPosition);
    this._adjacent.angleType = 'explementary';
    showAdjacent(
      this._adjacent,
      this.layout.colors.angleA,
      this.layout.colors.angleB,
      this.layout.explementary.linesPosition,
    );
  }
}
