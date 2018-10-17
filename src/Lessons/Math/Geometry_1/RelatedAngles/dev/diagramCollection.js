// @flow
import {
  Transform,
} from '../../../../../js/diagram/tools/g2';
import lessonLayout from '../quickReference/layout';
// eslint-disable-next-line import/no-cycle
import LessonDiagram from './diagram';
import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';
import {
  QRCorrespondingAngles, QRAlternateAngles,
  QRInteriorAngles, QROppositeAngles,
} from '../quickReference/quickReference';

export default class DiagramCollection extends CommonDiagramCollection {
  _corresponding: QRCorrespondingAngles;
  _alternate: QRAlternateAngles;
  _interior: QRInteriorAngles;
  _opposite: QROppositeAngles;

  constructor(
    diagram: LessonDiagram,
    transform: Transform = new Transform('Dev'),
  ) {
    const layout = lessonLayout();
    super(diagram, layout, transform);
    this.add('corresponding', new QRCorrespondingAngles(diagram, transform));
    this.add('alternate', new QRAlternateAngles(diagram, transform));
    this.add('interior', new QRInteriorAngles(diagram, transform));
    this.add('opposite', new QROppositeAngles(diagram, transform));
    this.hasTouchableElements = true;
  }
}
