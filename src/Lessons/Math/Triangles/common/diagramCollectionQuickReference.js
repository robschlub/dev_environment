// @flow
import LessonDiagram from './diagram';
import {
  Transform,
} from '../../../../js/diagram/tools/g2';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';
// import AlternateAnglesQR from '../../RelatedAngles/quickReference/alternateAngles';
import { QROppositeAngles } from '../../RelatedAngles/quickReference/quickReference';

export default class QuickReferenceCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _alternateAngles: QROppositeAngles;

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().scale(1, 1).translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.add('alternateAngles', new QROppositeAngles(this.diagram));
    this._alternateAngles.setPosition(0, 0);
    this.hasTouchableElements = true;
  }
}
