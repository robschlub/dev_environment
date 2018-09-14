// @flow
import { Transform, Point } from '../../../../js/diagram/tools/g2';
import { DiagramElementPrimative } from '../../../../js/diagram/Element';
import lessonLayout from './layout';

// import { addSelectorHTML } from '../../../../LessonsCommon/tools/selector';
// eslint-disable-next-line import/no-cycle
// import CommonLessonDiagram from '../common/diagram';

// import OppositeCollection from '../common/diagramCollectionOpposite';
import ThreeLinesCollection from '../common/diagramCollectionThreeLines';
import CommonLessonDiagramCollection from '../common/diagramCollection';
// import type { TypeUnits } from '../../../../LessonsCommon/DiagramCollection';

export default class AlternateAnglesQR extends CommonLessonDiagramCollection {
  _threeLines: ThreeLinesCollection;
  _background: DiagramElementPrimative;
  _title: DiagramElementPrimative;
  _description: DiagramElementPrimative;

  // eslint-disable-next-line class-methods-use-this
  toggleInfo(toState: ?boolean = null) {
    const infoButton = document.getElementById('id_lesson__info_button');
    const infoBox = document.getElementById('id_lesson__info_box');
    if (infoButton instanceof HTMLElement && infoBox instanceof HTMLElement) {
      if (typeof toState === 'boolean' && toState === true) {
        infoButton.classList.add('lesson__info_button_show');
        infoBox.classList.remove('lesson__info_hide');
      } else if (typeof toState === 'boolean' && toState === false) {
        infoButton.classList.remove('lesson__info_button_show');
        infoBox.classList.add('lesson__info_hide');
      } else {
        infoButton.classList.toggle('lesson__info_button_show');
        infoBox.classList.toggle('lesson__info_hide');
      }
    }
    // if (infoBox instanceof HTMLElement) {
    //   infoBox.classList.toggle('lesson__info_hide');
    // }
  }

  addQRBox() {
    const container = document.createElement('div');
    container.classList.add('lesson__info_box');
    container.classList.add('lesson__info_hide');
    container.id = 'id_lesson__info_box';

    const title = document.createElement('div');
    title.classList.add('lesson__info_box__title');
    container.appendChild(title);

    const infoSymbol = document.createElement('div');
    infoSymbol.classList.add('lesson__info_box__title_i');
    infoSymbol.innerHTML = 'i';
    title.appendChild(infoSymbol);

    const close = document.createElement('div');
    close.classList.add('lesson__info_box__close');
    close.id = 'id_lesson__info_box__close';
    close.innerHTML = 'X';
    close.onclick = this.toggleInfo.bind(this);
    title.appendChild(close);

    const titleText = document.createElement('div');
    titleText.classList.add('lesson__info_box__title_text');
    titleText.innerHTML = 'What can you do on this page?';
    title.appendChild(titleText);

    const text = document.createElement('div');
    text.classList.add('lesson__info_box__text');
    text.id = ('id_lesson__info_box__text');
    container.appendChild(text);

    this.diagram.htmlCanvas.appendChild(container);
  }

  makeBackground(width: number, height: number) {
    const background = this.diagram.shapes.rectangleFilled(
      'center', width, height, 0.2, 20, [0.2, 0.2, 0.2, 1.0], new Transform().translate(0, 0),
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
    diagram: Object,
    transform: Transform = new Transform().scale(1, 1).translate(0, 0),
  ) {
    const layout = lessonLayout();
    super(diagram, layout, transform);
    this.add('background', this.makeBackground(2, 2.5));
    this.diagram.shapes = this.diagram.shapesHigh;
    this.add('title', this.makeTitle('Alternate Angles'));
    this.add('description', this.makeDescription('Alternate angles are angles on opposite sides of an intersecting line crossing two lines. When the two lines are parallel, |alternate angles are equal|.'));
    this.add('threeLines', new ThreeLinesCollection(diagram, this.layout));
    this._threeLines.calculateFuturePositions('corresponding');
    this._threeLines.setFuturePositions();
    this._threeLines.alternateToggleAngles();
    this.hasTouchableElements = true;
    this.diagram.shapes = this.diagram.shapesLow;
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
