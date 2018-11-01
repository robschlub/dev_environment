// @flow

import { Transform } from '../../../../../js/diagram/tools/g2';
import lessonLayout from './layout';
import * as html from '../../../../../js/tools/htmlGenerator';
import PopupBoxCollection from '../../../../LessonsCommon/DiagramCollectionPopup';
import details from '../details';

import MeasureCollection from '../common/diagramCollectionMeasure';


export default class QRArea extends PopupBoxCollection {
  _collection: MeasureCollection;

  constructor(
    diagram: Object,
    transform: Transform = new Transform().scale(1, 1).translate(0, 0),
  ) {
    const layout = lessonLayout();
    super(
      diagram,
      layout,
      transform,
      'collection',
      MeasureCollection,
    );
    this.hasTouchableElements = true;

    const modifiers = {};

    this.setTitle('Area');
    this.setDescription(`
      <p>
      |Area| is the |amount of space a shape takes up| and is measured in squares of some reference size.
      </p>
      <p>
      For example, a reference square might have a side length of |1 meter|, and therefore area would be measured in |square meters| which would normally be written as |m<sup>2</sup>|.
      </p>
    `, modifiers);
    this.setLink(details.details.uid);
  }

  show() {
    this.setDiagramSize(2.5, 1.2);
    super.show();
    const collection = this._collection;
    collection.show();
    collection._mediumGrid.show();
    collection._squareA.show();
    collection._squareLabelMeters.show();
    collection._circleA.showAll();
    collection._circleLabel.show();
    collection._triangleA.show();
    collection._triLabelMeters.show();
    collection.transform.updateScale(0.5, 0.5);
    collection.setPosition(this.layout.areaPosition);
    this.diagram.animateNextFrame();
  }
}
