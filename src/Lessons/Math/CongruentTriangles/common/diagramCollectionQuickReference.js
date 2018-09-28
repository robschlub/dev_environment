// @flow
import LessonDiagram from './diagram';
import {
  Transform,
} from '../../../../js/diagram/tools/g2';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';
import QRTriangle from '../../Triangles/quickReference/quickReference';
import { QRAsa, QRSss, QRAas, QRSsa } from '../quickReference/quickReference';
// import { QRAlternateAngles } from '../../RelatedAngles/quickReference/quickReference';
// import { QRSupplementaryAngles } from '../../AdjacentAngles/quickReference/quickReference';

export default class QuickReferenceCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _tri: QRSsa;
  _asa: QRAsa;
  _sss: QRSss;
  _aas: QRAas;
  // _alternateAngles: QRAlternateAngles;

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform('QR Collection').scale(1, 1).translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.add('tri', new QRSsa(this.diagram));
    this.add('asa', new QRAsa(this.diagram));
    // this.add('sss', diagram.shapes.collection());
    this.add('sss', new QRSss(this.diagram));
    this.add('aas', new QRAas(this.diagram));
    this.hasTouchableElements = true;
  }
}
