// @flow

import Diagram from '../../../js/diagram/Diagram';
import { Transform, Point } from '../../../js/diagram/tools/g2';
// import { DiagramElementCollection, DiagramElementPrimative } from '../../../js/diagram/Element';
import SinCosCircle from '../../../LessonsCommon/SinCosCircle/SinCosCircle';
import type { SinCosCircleType, SinCosVarStateType } from '../../../LessonsCommon/SinCosCircle/SinCosCircle';
import lessonLayout from './layout';

export type extendedCircleType = {
  //
} & SinCosCircleType;


type varStateExtendedType = {
  //
} & SinCosVarStateType;

export type SineCollectionType = {
  _circle: extendedCircleType;
  varState: varStateExtendedType;
};

class SineCollection extends SinCosCircle {
  _circle: extendedCircleType;
  varState: varStateExtendedType;

  // addToCircle() {
  // }

  constructor(diagram: Diagram, transform: Transform = new Transform()) {
    super(lessonLayout(), diagram, transform);
    // this.addToCircle();
  }
}

export default SineCollection;
