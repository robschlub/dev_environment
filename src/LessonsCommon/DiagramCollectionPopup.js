// @flow
import { Transform, Point } from '../js/diagram/tools/g2';
import { DiagramElementPrimative } from '../js/diagram/Element';
import * as html from '../js/tools/htmlGenerator';
import CommonDiagramCollection from './DiagramCollection';

export default class PopupBoxCollection extends CommonDiagramCollection {
  id: string;
  modifiers: {};
  description: string;
  title: string;
  titleElement: HTMLElement;
  descriptionElement: HTMLElement;
  spaceForDiagramElement: HTMLElement;
  container: HTMLElement;
  _box: DiagramElementPrimative;
  linkElement: HTMLElement;

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

    const linkElement = document.createElement('div');
    linkElement.classList.add('lesson__popup_box__link');
    this.linkElement = linkElement;
    container.appendChild(linkElement);


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
    diagram: Object,
    layout: Object,
    transform: Transform = new Transform(),
    collectionName: string,
    Collection: Function | null = null,
  ) {
    super(diagram, layout, transform);
    this.add('box', this.makeBox(collectionName));
    if (Collection) {
      this.diagram.shapes = this.diagram.shapesHigh;
      this.diagram.equation = this.diagram.equationHigh;
      this.add(collectionName, new Collection(diagram, layout));
      this.diagram.shapes = this.diagram.shapesLow;
      this.diagram.equation = this.diagram.equationLow;
    }
  }

  setLink(link: string) {
    const a = document.createElement('a');
    a.classList.add('interactive_word');
    a.href = link;
    a.innerHTML = 'Go to lesson';
    this.linkElement.appendChild(a);
    // this.linkElement.innerHTML = `<a href=${link}>Go to lesson</a>`;
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
    // console.log(this.diagram.elements.elements)
    // Object.keys(this.diagram.elements.elements).forEach((key) => {
    //   const element = this.diagram.elements.elements[key];
    //   if (element.name !== this.name) {
    //     console.log(element.name)
    //   }
    // })
    console.log(this.diagram.htmlCanvas.children)
    this._box.show();
  }

  hideAll() {
    super.hideAll();
    this.diagram.animateNextFrame();
  }
}

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
