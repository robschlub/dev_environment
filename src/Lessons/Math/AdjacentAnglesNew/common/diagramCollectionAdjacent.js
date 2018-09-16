// @flow
import LessonDiagram from './diagram';
import {
  Transform,
} from '../../../../js/diagram/tools/g2';
import {
  DiagramElementPrimative,
} from '../../../../js/diagram/Element';

import CommonDiagramCollection from '../../../../LessonsCommon/DiagramCollection';
import type { TypeScenario } from '../../../../LessonsCommon/DiagramCollection';
import { makeLine } from '../../../../LessonsCommon/tools/line';
import type { TypeLine } from '../../../../LessonsCommon/tools/line';

import { makeAngle } from '../../../../LessonsCommon/tools/angle';
import type { TypeAngle } from '../../../../LessonsCommon/tools/angle';
// type TypeAdjacentAngle = 'adjacent' | 'supplementary' | 'complementary' | 'reflex' | 'right' | 'full';

export default class AdjacentCollection extends CommonDiagramCollection {
  diagram: LessonDiagram;
  _line1: TypeLine;
  _line2: TypeLine;
  _line3: TypeLine;
  _line4: TypeLine;
  _angle1: TypeAngle;

  makeAdjacentLine(color: Array<number>) {
    const line = makeLine(
      this.diagram,
      'end',
      this.layout.line.length,
      this.layout.line.width,
      color,
      true,
    );
    line.setMovable();
    line.move.type = 'rotation';
    return line;
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform().translate(0, 0),
  ) {
    super(diagram, layout, transform);
    this.add('line1', this.makeAdjacentLine(this.layout.colors.line));
    this.add('line2', this.makeAdjacentLine(this.layout.colors.line));
    this.add('line3', this.makeAdjacentLine(this.layout.colors.line));
    this.add('line4', this.makeAdjacentLine(this.layout.colors.line));

    this.hasTouchableElements = true;
  }

  calculateFuturePositions(scenario: TypeScenario) {
    this.futurePositions = [];
    this.addFuturePosition(this._line1, scenario);
    this.addFuturePosition(this._line2, scenario);
    this.addFuturePosition(this._line3, scenario);
    this.addFuturePosition(this._line4, scenario);
  }
}
