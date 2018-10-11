// @flow
import { DiagramElementCollection } from '../../../../../js/diagram/Element';
import CircleCollection from './diagramCollectionCircle';
import type { TypeCircleCollectionExtended } from './diagramCollectionCircle';
import lessonLayout from './layout';
import AngleCircleDiagram from '../../../../LessonsCommon/AngleCircle/diagram';


type typeElements = {
  _circle: TypeCircleCollectionExtended;
} & DiagramElementCollection ;

// $FlowFixMe
class LessonDiagram extends AngleCircleDiagram {
  elements: typeElements;

  constructor(id: string) {
    super(id, lessonLayout(), CircleCollection);
  }
}

export default LessonDiagram;
