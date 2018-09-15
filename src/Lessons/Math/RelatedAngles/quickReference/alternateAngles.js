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

class PopupBox {
  id: string;
  modifiers: {};
  body: string;
  title: string;

  toggle(toState: ?boolean = null) {
    const box = document
      .getElementById(`id_lesson__popup_box__${this.id}`);
    if (box instanceof HTMLElement) {
      if (typeof toState === 'boolean' && toState === true) {
        box.classList.remove('lesson__popup_hide');
      } else if (typeof toState === 'boolean' && toState === false) {
        box.classList.add('lesson__popup_hide');
      } else {
        box.classList.toggle('lesson__popup_hide');
      }
    }
  }

  // setTitle(title: string, modifiers: Object | null) {

  // }

  constructor(
    diagram: Object,
    id: string,
    title: string = '',
    body: string = '',
    modifiers: Object = {},
  ) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.modifiers = modifiers;

    const container = document.createElement('div');
    container.id = `id_lesson__popup_box__${this.id}`;
    container.classList.add('lesson__popup_box');
    container.classList.add('lesson__popup_hide');

    const titleElement = document.createElement('div');
    titleElement.classList.add('lesson__popup_box__title');
    container.appendChild(titleElement);

    const infoSymbol = document.createElement('div');
    infoSymbol.classList.add('lesson__popup_box__title_i');
    infoSymbol.innerHTML = 'i';
    titleElement.appendChild(infoSymbol);

    const close = document.createElement('div');
    close.classList.add('lesson__popup_box__close');
    close.id = 'id_lesson__popup_box__close';
    close.innerHTML = 'X';
    close.onclick = this.toggle.bind(this, false);
    titleElement.appendChild(close);

    const titleText = document.createElement('div');
    titleText.classList.add('lesson__popup_box__title_text');
    titleText.innerHTML = title;
    titleElement.appendChild(titleText);

    const spaceForDiagram = document.createElement('div');
    spaceForDiagram.classList.add('lesson__popup_box__diagram');
    spaceForDiagram.id = (`id_lesson__popup_box__diagram__${id}`);
    container.appendChild(spaceForDiagram);

    const text = document.createElement('div');
    text.classList.add('lesson__popup_box__text');
    text.id = `id_lesson__popup_box__text__${id}`;
    text.innerHTML = body;
    container.appendChild(text);

    diagram.htmlCanvas.appendChild(container);
  }
}

export default class AlternateAnglesQR extends CommonLessonDiagramCollection {
  _threeLines: ThreeLinesCollection;
  _background: DiagramElementPrimative;
  _title: DiagramElementPrimative;
  _description: DiagramElementPrimative;

  // eslint-disable-next-line class-methods-use-this
  toggleInfo(id: string, toState: ?boolean = null) {
    const infoBox = document.getElementById(`id_lesson__popup_box__${id}`);
    if (infoBox instanceof HTMLElement) {
      if (typeof toState === 'boolean' && toState === true) {
        infoBox.classList.remove('lesson__popup_hide');
      } else if (typeof toState === 'boolean' && toState === false) {
        infoBox.classList.add('lesson__popup_hide');
      } else {
        infoBox.classList.toggle('lesson__popup_hide');
      }
    }
  }

  addPopupBox(id: string, title: string, body: string) {
    const container = document.createElement('div');
    container.id = `id_lesson__popup_box__${id}`;
    container.classList.add('lesson__popup_box');
    container.classList.add('lesson__popup_hide');

    const titleElement = document.createElement('div');
    titleElement.classList.add('lesson__popup_box__title');
    container.appendChild(titleElement);

    const infoSymbol = document.createElement('div');
    infoSymbol.classList.add('lesson__popup_box__title_i');
    infoSymbol.innerHTML = 'i';
    titleElement.appendChild(infoSymbol);

    const close = document.createElement('div');
    close.classList.add('lesson__popup_box__close');
    close.id = 'id_lesson__popup_box__close';
    close.innerHTML = 'X';
    close.onclick = this.toggleInfo.bind(this, id, null);
    titleElement.appendChild(close);

    const titleText = document.createElement('div');
    titleText.classList.add('lesson__popup_box__title_text');
    titleText.innerHTML = title;
    titleElement.appendChild(titleText);

    const diagram = document.createElement('div');
    diagram.classList.add('lesson__popup_box__diagram');
    diagram.id = (`id_lesson__popup_box__diagram__${id}`);
    container.appendChild(diagram);

    const text = document.createElement('div');
    text.classList.add('lesson__popup_box__text');
    text.id = `id_lesson__popup_box__text__${id}`;
    text.innerHTML = body;
    container.appendChild(text);

    this.diagram.htmlCanvas.appendChild(container);
  }

  setDiagramSize(id: string, width: number, height: number) {
    // As css 0, 0 is in top left and we are converting a relative dimension,
    // not absolute, then first make a point of the relavent dimension relative
    // to the top left of the diagram
    const diagramSpace = new Point(
      this.diagram.limits.left + width,
      this.diagram.limits.top - height,
    );
    const cssSpace = diagramSpace
      .transformBy(this.diagram.diagramToCSSPercentSpaceTransform.matrix());
    const popupBox = document.getElementById(`id_lesson__popup_box__diagram__${id}`);
    if (popupBox) {
      // popupBox.style.width = `${cssSpace.x * 100}%`;
      // popupBox.style.height = `${cssSpace.y * 100}%`;
      // popupBox.style.height = 'calc(var(--lesson__content-height) * 0.4)';
      popupBox.style.width = `calc(var(--lesson__content-width) * ${cssSpace.x})`;
      popupBox.style.height = `calc(var(--lesson__content-height) * ${cssSpace.y})`;
    }
  }
  // makeBackground(width: number, height: number) {
  //   const background = this.diagram.shapes.rectangleFilled(
  //     'center', width, height, 0.2, 20, [0.2, 0.2, 0.2, 1.0], new Transform().translate(0, 0),
  //   );
  //   return background;
  // }

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

  // makeDescription(text: string) {
  //   const element = document.createElement('div');
  //   element.innerHTML = text;
  //   return this.diagram.shapes.htmlElement(
  //     element,
  //     'id_lesson__reference_tile__description__alternating_angles',
  //     'lesson__reference_tile_description',
  //     new Point(0, -0.35),
  //     'top',
  //     'center',
  //   );
  // }

  constructor(
    diagram: Object,
    transform: Transform = new Transform().scale(1, 1).translate(0, 0),
  ) {
    const layout = lessonLayout();
    super(diagram, layout, transform);
    // this.add('background', this.makeBackground(2, 2.5));
    this.addPopupBox('test', 'title', 'Alternate angles are angles on opposite sides of an intersecting line crossing two lines. When the two lines are parallel, |alternate angles are equal|.');
    this.diagram.shapes = this.diagram.shapesHigh;
    this.diagram.equation = this.diagram.equationHigh;
    this.add('title', this.makeTitle('Alternate Angles'));
    // this.add('description', this.makeDescription('Alternate angles are angles on opposite sides of an intersecting line crossing two lines. When the two lines are parallel, |alternate angles are equal|.'));
    this.add('threeLines', new ThreeLinesCollection(diagram, this.layout));
    this._threeLines.calculateFuturePositions('corresponding');
    this._threeLines.setFuturePositions();
    this._threeLines.alternateToggleAngles();
    this.hasTouchableElements = true;
    this.diagram.shapes = this.diagram.shapesLow;
    this.diagram.equation = this.diagram.equationLow;
  }

  showInitial() {
    this._threeLines.transform.updateScale(0.7, 0.7);
    this._threeLines.setPosition(0, 0.3);
    this._threeLines.transform.updateRotation(0);
    this.show();
    this.toggleInfo('test', true);
    this.setDiagramSize('test', 3, 1);
    // this._background.show();
    this._title.show();
    // this._description.show();
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
