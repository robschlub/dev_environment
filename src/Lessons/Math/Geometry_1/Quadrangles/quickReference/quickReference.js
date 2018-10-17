// @flow

import { Transform } from '../../../../../js/diagram/tools/g2';
import lessonLayout from './layout';
import * as html from '../../../../../js/tools/htmlGenerator';
import PopupBoxCollection from '../../../../LessonsCommon/DiagramCollectionPopup';
import details from '../details';

import QuadCollection from '../common/diagramCollectionQuad';


export default class QRQuadrangle extends PopupBoxCollection {
  _quad: QuadCollection;

  constructor(
    diagram: Object,
    transform: Transform = new Transform().scale(1, 1).translate(0, 0),
  ) {
    const layout = lessonLayout();
    super(
      diagram,
      layout,
      transform,
      'quad',
      QuadCollection,
    );
    this.hasTouchableElements = true;

    const modifiers = {};

    this.setTitle('Quadrangle');
    this.setDescription('A |Quadrangle| is a shape with |four sides|, and |four angles|. All the angles within a quadrangle add up to |360º| (|2π radians|).', modifiers);
    this.setLink(details.details.uid);
  }

  show() {
    this.setDiagramSize(2.5, 1.3);
    super.show();
    const quad = this._quad;
    quad.show();
    quad._quad1.show();
    quad._quad2.show();
    quad._quad3.show();
    quad.transform.updateScale(0.7, 0.7);
    quad.setPosition(this.layout.quadPosition);
    this.diagram.animateNextFrame();
  }
}
