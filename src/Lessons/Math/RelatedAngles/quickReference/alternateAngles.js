// @flow
import { Transform } from '../../../../js/diagram/tools/g2';
import lessonLayout from './layout';
import * as html from '../../../../js/tools/htmlGenerator';
import ThreeLinesCollection from '../common/diagramCollectionThreeLines';
import PopupBoxCollection from '../../../../LessonsCommon/DiagramCollectionPopup';


export default class AlternateAnglesQR extends PopupBoxCollection {
  _threeLines: ThreeLinesCollection;

  constructor(
    diagram: Object,
    transform: Transform = new Transform().scale(1, 1).translate(0, 0),
  ) {
    const layout = lessonLayout();
    super(
      diagram,
      layout,
      transform,
      'threeLines',
      ThreeLinesCollection,
    );
    this.hasTouchableElements = true;

    const modifiers = {
      Alternate_angles: html.click(
        this._threeLines.alternateToggleAngles,
        [this._threeLines, null], this.layout.colors.angleA,
      ),
    };

    this.setTitle('Alternate Angles');
    this.setDescription('|Alternate_angles| are angles on opposite sides of an intersecting line crossing two lines. When the two lines are parallel, |alternate angles are equal|.', modifiers);
  }

  show() {
    this.setDiagramSize(2.5, 1.85);
    super.show();
    this._threeLines.transform.updateScale(0.7, 0.7);
    this._threeLines.transform.updateRotation(0);
    this._threeLines.calculateFuturePositions('corresponding');
    this._threeLines.setFuturePositions();
    this._threeLines.setPosition(0, 0.1);
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
