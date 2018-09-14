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
  _background: DiagramElementPrimative;
  _title: DiagramElementPrimative;
  _description: DiagramElementPrimative;

  makeBackground(width: number, height: number) {
    const background = this.diagram.shapes.rectangleFilled(
      'center', width, height, 0.2, 20, [0.2, 0.2, 0.2, 0.9], new Transform().translate(0, 0),
    );
    return background;
  }

  makeTitle(text: string) {
    const element = document.createElement('div');
    element.innerHTML = text;
    return this.diagram.shapes.htmlElement(
      element,
      'id_lesson__reference_tile__title__alternate_angles',
      'lesson__reference_tile_title',
      new Point(0, 1.05),
      'middle',
      'center',
    );
  }

  makeDescription(text: string) {
    const element = document.createElement('div');
    element.innerHTML = text;
    return this.diagram.shapes.htmlElement(
      element,
      'id_lesson__reference_tile__description__alternating_angles',
      'lesson__reference_tile_description',
      new Point(0, -0.35),
      'top',
      'center',
    );
  }

  constructor(
    diagram: CommonLessonDiagram,
    transform: Transform = new Transform().scale(1, 1).translate(0, 0),
  ) {
    const layout = lessonLayout();
    super(diagram, layout, transform);
    this.add('background', this.makeBackground(2, 2.5));
    this.add('title', this.makeTitle('Alternate Angles'));
    this.add('description', this.makeDescription('Alternate angles are angles on opposite sides of an intersecting line crossing two lines. When the two lines are parallel, |alternate angles are equal|.'));
    this.add('threeLines', new ThreeLinesCollection(diagram, this.layout));
    this._threeLines.calculateFuturePositions('corresponding');
    this._threeLines.setFuturePositions();
    this._threeLines.alternateToggleAngles();
    this.hasTouchableElements = true;
  }

  showInitial() {
    this._threeLines.transform.updateScale(0.5, 0.5);
    this._threeLines.setPosition(0, 0.3);
    this._threeLines.transform.updateRotation(0);
    this.show();
    this._background.show();
    this._title.show();
    this._description.show();
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
