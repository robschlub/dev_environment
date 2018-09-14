// @flow
import { Transform, Point } from '../../../../js/diagram/tools/g2';
import { DiagramElementPrimative } from '../../../../js/diagram/Element';
import lessonLayout from './layout';

// import { addSelectorHTML } from '../../../../LessonsCommon/tools/selector';
// eslint-disable-next-line import/no-cycle
import CommonLessonDiagram from '../common/diagram';

// import OppositeCollection from '../common/diagramCollectionOpposite';
import ThreeLinesCollection from '../common/diagramCollectionThreeLines';
import CommonLessonDiagramCollection from '../common/diagramCollection';
// import type { TypeUnits } from '../../../../LessonsCommon/DiagramCollection';

export default class AlternateAnglesQR extends CommonLessonDiagramCollection {
  _threeLines: ThreeLinesCollection;
  _tile: DiagramElementPrimative;

  makeTile(width: number, height: number) {
    const tile = this.diagram.shapes.rectangleFilled(
      new Point(-3, 1), width, height, 0.3, 10, [1, 0, 0, 1],
    );
    return tile;
  }

  constructor(
    diagram: CommonLessonDiagram,
    transform: Transform = new Transform(),
  ) {
    const layout = lessonLayout();
    super(diagram, layout, transform);
    this.add('tile', this.makeTile(2, 1));
    this.add('threeLines', new ThreeLinesCollection(diagram, this.layout));
    this._threeLines.calculateFuturePositions('corresponding');
    this._threeLines.setFuturePositions();
    this._threeLines.alternateToggleAngles();
    this.hasTouchableElements = true;
  }

  showInitial() {
    this._threeLines.transform.updateScale(0.7, 0.7);

    this.show();
    this._tile.show();
    this._threeLines.show();
    this._threeLines._line1.show();
    this._threeLines._line1._end1.show();
    this._threeLines._line1._end2.show();
    this._threeLines._line1._mid.show();
    this._threeLines._line2.show();
    this._threeLines._line2._end1.show();
    this._threeLines._line2._end2.show();
    this._threeLines._line2._mid.show();
    this._threeLines._line3.show();
    this._threeLines._line3._end1.show();
    this._threeLines._line3._end2.show();
    this._threeLines._line3._mid.show();
    this._threeLines.alternateToggleAngles();

    this._threeLines._line1.setColor(this.layout.colors.line);
    this._threeLines._line2.setColor(this.layout.colors.line);
  }
}
