// @flow
import { Transform, Point } from '../../../../js/diagram/tools/g2';
import { DiagramElementCollection } from '../../../../js/diagram/Element';
import lessonLayout from './layout';
import * as html from '../../../../js/tools/htmlGenerator';
import ThreeLinesCollection from '../common/diagramCollectionThreeLines';
import CommonLessonDiagramCollection from '../common/diagramCollection';


class PopupBoxCollection extends CommonLessonDiagramCollection {
  id: string;
  modifiers: {};
  description: string;
  title: string;
  titleElement: HTMLElement;
  descriptionElement: HTMLElement;
  spaceForDiagramElement: HTMLElement;
  container: HTMLElement;

  // toggle(toState: ?boolean = null) {
  //   const box = this.container;
  //   if (box instanceof HTMLElement) {
  //     if (typeof toState === 'boolean' && toState === true) {
  //       box.classList.remove('lesson__popup_hide');
  //       // this.show();
  //     } else if (typeof toState === 'boolean' && toState === false) {
  //       box.classList.add('lesson__popup_hide');
  //       // this.hide();
  //       // if (this.collection) {
  //       //   this.collection.hideAll();
  //       //   this.diagram.animateNextFrame();
  //       // }
  //       // this.setPosition(-10000, -10000, 'topLeft');
  //     } else {
  //       box.classList.toggle('lesson__popup_hide');
  //     }
  //   }
  // }

  setTitle(title: string, modifiers: Object = {}) {
    const modifiedText = html.applyModifiers(title, modifiers);
    this.titleElement.innerHTML = modifiedText;
    html.setOnClicks(modifiers);
    this.modifiers = modifiers;
  }

  setDescription(description: string, modifiers: Object = {}) {
    const modifiedText = html.applyModifiers(description, modifiers);
    this.descriptionElement.innerHTML = modifiedText;
    html.setOnClicks(modifiers);
    this.modifiers = modifiers;
  }

  makeBox(
    id: string,
    title: string = '',
    description: string = '',
    modifiers: Object = {},
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.modifiers = modifiers;

    const container = document.createElement('div');
    // container.id = `id_lesson__popup_box__${this.id}`;
    // container.classList.add('lesson__popup_box');
    // container.classList.add('lesson__popup_hide');
    this.container = container;

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
    close.onclick = this.hideAll.bind(this);
    titleElement.appendChild(close);

    const titleText = document.createElement('div');
    titleText.classList.add('lesson__popup_box__title_text');
    this.titleElement = titleText;
    this.setTitle(title);
    titleElement.appendChild(titleText);

    const spaceForDiagram = document.createElement('div');
    spaceForDiagram.classList.add('lesson__popup_box__diagram');
    spaceForDiagram.id = (`id_lesson__popup_box__diagram__${id}`);
    this.spaceForDiagramElement = spaceForDiagram;
    container.appendChild(spaceForDiagram);

    const descriptionElement = document.createElement('div');
    descriptionElement.classList.add('lesson__popup_box__text');
    descriptionElement.id = `id_lesson__popup_box__text__${id}`;
    this.descriptionElement = descriptionElement;
    this.setDescription(description);

    container.appendChild(descriptionElement);

    const element = this.diagram.shapesHigh.htmlElement(
      container,
      `id_lesson__popup_box__${this.id}`,
      'lesson__popup_box',
      new Point(0, 0),
      'middle',
      'center',
    );
    return element;
    // diagram.htmlCanvas.appendChild(container);
  }

  constructor(
    diagram: LessonDiagram,
    layout: Object,
    transform: Transform = new Transform(),
    collectionName: string,
    collection: Object,
  ) {
    // const layout = lessonLayout();
    super(diagram, layout, transform);
    this.add('box', this.makeBox(collectionName));
    this.diagram.shapes = this.diagram.shapesHigh;
    this.diagram.equation = this.diagram.equationHigh;
    this.add(collectionName, new collection(diagram, layout));
    this.diagram.shapes = this.diagram.shapesLow;
    this.diagram.equation = this.diagram.equationLow;
  }

  getDiagramSpacePosition(reference: 'topLeft' | 'center') {
    const matrix = this.diagram.pixelToDiagramSpaceTransform.matrix();

    const dBound = this.spaceForDiagramElement.getBoundingClientRect();
    const cBound = this.diagram.htmlCanvas.getBoundingClientRect();
    const pixelTopLeft = new Point(
      dBound.left - cBound.left,
      dBound.top - cBound.top,
    );
    const pixelBottomRight = new Point(
      dBound.right - cBound.left,
      dBound.bottom - cBound.top,
    );

    const topLeft = pixelTopLeft.transformBy(matrix);
    const bottomRight = pixelBottomRight.transformBy(matrix);

    if (reference === 'topLeft') {
      return topLeft;
    }

    const width = bottomRight.x - topLeft.x;
    const height = topLeft.y - bottomRight.y;
    return new Point(topLeft.x + width / 2, bottomRight.y + height / 2);
  }

  setDiagramSize(width: number, height: number) {
    // As css 0, 0 is in top left and we are converting a relative dimension,
    // not absolute, then first make a point of the relavent dimension relative
    // to the top left of the diagram
    const diagramSpace = new Point(
      this.diagram.limits.left + width,
      this.diagram.limits.top - height,
    );
    const cssSpace = diagramSpace
      .transformBy(this.diagram.diagramToCSSPercentSpaceTransform.matrix());

    this.spaceForDiagramElement.style.width
      = `calc(var(--lesson__content-width) * ${cssSpace.x})`;
    this.spaceForDiagramElement.style.height
      = `calc(var(--lesson__content-height) * ${cssSpace.y})`;
  }

  showAll() {
    this.show();
  }

  showOnly() {
    this.show();
  }

  show() {
    super.show();
    // this.toggle(true);
    this._box.show();
  }

  hideAll() {
    super.hideAll();
    this.diagram.animateNextFrame();
  }
}

// class PopupBox {
//   id: string;
//   modifiers: {};
//   description: string;
//   title: string;
//   titleElement: HTMLElement;
//   descriptionElement: HTMLElement;
//   spaceForDiagramElement: HTMLElement;
//   container: HTMLElement;
//   diagram: Object;
//   collection: DiagramElementCollection | null;

//   toggle(toState: ?boolean = null) {
//     const box = this.container;
//     if (box instanceof HTMLElement) {
//       if (typeof toState === 'boolean' && toState === true) {
//         box.classList.remove('lesson__popup_hide');
//       } else if (typeof toState === 'boolean' && toState === false) {
//         box.classList.add('lesson__popup_hide');
//         if (this.collection) {
//           this.collection.hideAll();
//           this.diagram.animateNextFrame();
//         }
//         this.setPosition(-10000, -10000, 'topLeft');
//       } else {
//         box.classList.toggle('lesson__popup_hide');
//       }
//     }
//   }

//   hide() {
//     if (this.collection) {
//       this.collection.hideAll();
//       this.diagram.animateNextFrame();
//     }
//     this.setPosition(-10000, -10000, 'topLeft');
//   }

//   setPosition(
//     xOrPoint: Point | number,
//     yOrReference: 'center' | 'topLeft' | number = 'center',
//     reference: 'center' | 'topLeft' = 'center',
//   ) {
//     let point = xOrPoint;
//     let ref = yOrReference;
//     if (typeof xOrPoint === 'number' && typeof yOrReference === 'number') {
//       point = new Point(xOrPoint, yOrReference);
//       ref = reference;
//     }
//     if (point instanceof Point) {
//       const cssSpace = point
//         .transformBy(this.diagram.diagramToCSSPercentSpaceTransform.matrix());
//       this.container.style.left = `${cssSpace.x * 100}%`;
//       this.container.style.top = `${cssSpace.y * 100}%`;
//       if (ref === 'topLeft') {
//         this.container.style.transform = 'none';
//       }
//       if (ref === 'center') {
//         this.container.style.transform = 'translate(-50%, -50%)';
//       }
//     }
//   }

//   getDiagramSpacePosition(reference: 'topLeft' | 'center') {
//     const matrix = this.diagram.pixelToDiagramSpaceTransform.matrix();

//     const dBound = this.spaceForDiagramElement.getBoundingClientRect();
//     const cBound = this.diagram.htmlCanvas.getBoundingClientRect();
//     const pixelTopLeft = new Point(
//       dBound.left - cBound.left,
//       dBound.top - cBound.top,
//     );
//     const pixelBottomRight = new Point(
//       dBound.right - cBound.left,
//       dBound.bottom - cBound.top,
//     );

//     const topLeft = pixelTopLeft.transformBy(matrix);
//     const bottomRight = pixelBottomRight.transformBy(matrix);

//     if (reference === 'topLeft') {
//       return topLeft;
//     }

//     const width = bottomRight.x - topLeft.x;
//     const height = topLeft.y - bottomRight.y;
//     return new Point(topLeft.x + width / 2, bottomRight.y + height / 2);
//   }

//   setDiagramSize(width: number, height: number) {
//     // As css 0, 0 is in top left and we are converting a relative dimension,
//     // not absolute, then first make a point of the relavent dimension relative
//     // to the top left of the diagram
//     const diagramSpace = new Point(
//       this.diagram.limits.left + width,
//       this.diagram.limits.top - height,
//     );
//     const cssSpace = diagramSpace
//       .transformBy(this.diagram.diagramToCSSPercentSpaceTransform.matrix());

//     this.spaceForDiagramElement.style.width
//       = `calc(var(--lesson__content-width) * ${cssSpace.x})`;
//     this.spaceForDiagramElement.style.height
//       = `calc(var(--lesson__content-height) * ${cssSpace.y})`;
//   }

  

//   constructor(
//     diagram: Object,
//     id: string,
//     title: string = '',
//     description: string = '',
//     modifiers: Object = {},
//     collection: DiagramElementCollection | null = null,
//   ) {
//     this.id = id;
//     this.title = title;
//     this.description = description;
//     this.modifiers = modifiers;
//     this.diagram = diagram;
//     this.collection = collection;

//     const container = document.createElement('div');
//     container.id = `id_lesson__popup_box__${this.id}`;
//     container.classList.add('lesson__popup_box');
//     container.classList.add('lesson__popup_hide');
//     this.container = container;

//     const titleElement = document.createElement('div');
//     titleElement.classList.add('lesson__popup_box__title');
//     container.appendChild(titleElement);

//     const infoSymbol = document.createElement('div');
//     infoSymbol.classList.add('lesson__popup_box__title_i');
//     infoSymbol.innerHTML = 'i';
//     titleElement.appendChild(infoSymbol);

//     const close = document.createElement('div');
//     close.classList.add('lesson__popup_box__close');
//     close.id = 'id_lesson__popup_box__close';
//     close.innerHTML = 'X';
//     close.onclick = this.toggle.bind(this, false);
//     titleElement.appendChild(close);

//     const titleText = document.createElement('div');
//     titleText.classList.add('lesson__popup_box__title_text');
//     this.titleElement = titleText;
//     this.setTitle(title);
//     titleElement.appendChild(titleText);

//     const spaceForDiagram = document.createElement('div');
//     spaceForDiagram.classList.add('lesson__popup_box__diagram');
//     spaceForDiagram.id = (`id_lesson__popup_box__diagram__${id}`);
//     this.spaceForDiagramElement = spaceForDiagram;
//     container.appendChild(spaceForDiagram);

//     const descriptionElement = document.createElement('div');
//     descriptionElement.classList.add('lesson__popup_box__text');
//     descriptionElement.id = `id_lesson__popup_box__text__${id}`;
//     this.descriptionElement = descriptionElement;
//     this.setDescription(description);

//     container.appendChild(descriptionElement);

//     diagram.htmlCanvas.appendChild(container);
//   }
// }

export default class AlternateAnglesQR extends PopupBoxCollection {
  _threeLines: ThreeLinesCollection;
  // qrBox: PopupBox;

  // makeBox() {
  //   const box = new PopupBox(this.diagram, 'alternate_angles');

  //   const modifiers = {
  //     Alternate_angles: html.click(
  //       this._threeLines.alternateToggleAngles,
  //       [this._threeLines, null], this.layout.colors.angleA,
  //     ),
  //   };

  //   box.setTitle('Alternate Angles');
  //   box.setDescription('|Alternate_angles| are angles on opposite sides of an intersecting line crossing two lines. When the two lines are parallel, |alternate angles are equal|.', modifiers);

  //   return box;
  // }

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
    // this.diagram.shapes = this.diagram.shapesHigh;
    // this.diagram.equation = this.diagram.equationHigh;
    // this.add('threeLines', );
    // // this.qrBox = this.makeBox();
    // this.qrBox.collection = this._threeLines;
    this._threeLines.calculateFuturePositions('corresponding');
    this._threeLines.setFuturePositions();
    this._threeLines.alternateToggleAngles();
    this.hasTouchableElements = true;
    // this.diagram.shapes = this.diagram.shapesLow;
    // this.diagram.equation = this.diagram.equationLow;

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
    super.show();
    this._threeLines.transform.updateScale(0.7, 0.7);
    this._threeLines.setPosition(0, 0.1);
    this._threeLines.transform.updateRotation(0);
    this.setDiagramSize(2.5, 1.85);
    console.log(this)
    // this.setPosition(0, 0);
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
    // this.setPosition(-1, 0);
  }
}
