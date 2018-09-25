// @flow
import LessonDiagram from './diagram';
import {
  Transform,
} from '../../../../js/diagram/tools/g2';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';
import QRTriangle from '../../Triangles/quickReference/quickReference';
import { QRAsa, QRSss } from '../quickReference/quickReference';
// import { QRAlternateAngles } from '../../RelatedAngles/quickReference/quickReference';
// import { QRSupplementaryAngles } from '../../AdjacentAngles/quickReference/quickReference';

export default class QuickReferenceCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _tri: QRTriangle;
  _asa: QRAsa;
  _sss: QRSss;
  // _alternateAngles: QRAlternateAngles;

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform('QR Collection').scale(1, 1).translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.add('tri', new QRTriangle(this.diagram));
    this.add('asa', new QRAsa(this.diagram));
    this.add('sss', new QRSss(this.diagram));
    // this.add('alternateAngles', new QRAlternateAngles(this.diagram));
    // this._supplementary.setPosition(0, 0);
    // this._alternateAngles.setPosition(0, 0);
    console.log(this)
    this.hasTouchableElements = true;
  }
}
