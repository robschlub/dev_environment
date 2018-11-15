// @flow

import { Transform } from '../../../../../js/diagram/tools/g2';
import lessonLayout from './layout';
import * as html from '../../../../../js/tools/htmlGenerator';
import PopupBoxCollection from '../../../../LessonsCommon/DiagramCollectionPopup';
import details from '../details';

import CircleAreaCollection from '../common/diagramCollectionCircleArea';


export default class QR_TODO extends PopupBoxCollection {
  _collection: CircleAreaCollection;

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
      CircleAreaCollection,
    );
    this.hasTouchableElements = true;

    const modifiers = { radius: html.highlight(this.layout.colors.radius) };

    this.setTitle('Area of a Circle');
    this.setDescription('|Circle area| is the product of |π| and the |radius| squared.', modifiers);
    this.setLink(details.details.uid);
  }

  show() {
    this.setDiagramSize(2.5, 1.7);
    super.show();
    const collection = this._collection;
    collection.show();
    collection._circle.show();
    collection._radius.showAll();
    collection.eqns.triRectEqn.showForm('14');
    collection.eqns.triRectEqn.getCurrentForm().arrange(1.5, 'center', 'middle');
    console.log(collection);
    // collection._triRectEqn._area
    collection.setScenario(collection._radius, { rotation: 0 });
    collection.transform.updateScale(0.5, 0.5);
    collection.setPosition(this.layout.position);
    this.diagram.animateNextFrame();
  }
}
