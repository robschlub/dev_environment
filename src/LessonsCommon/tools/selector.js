// @flow

import Diagram from '../../js/diagram/Diagram';
import { DiagramFont } from '../../js/diagram/DrawingObjects/TextObject/TextObject';
import { RGBToArray } from '../../js/tools/tools';

import { Point, Transform } from '../../js/diagram/tools/g2';
import baseLayout from '../layout';

const layout = baseLayout();

type SelectorItemType = {
  id: string;
  text: string;
  subText: string;
};

export class SelectorList {
  order: Array<SelectorItemType>;
  content: Object;

  constructor() {
    this.content = {};
    this.order = [];
  }

  add(id: string, text: string, subText: string = '') {
    const selectorItem = {
      id,
      text,
      subText,
    };
    this.content[id] = selectorItem;
    this.order.push(selectorItem);
  }
}

function selectorHandler(
  listId: string,
  htmlId: string,
  cols: Array<HTMLElement>,
  onclick: Function,
) {
  const selectedId = `${htmlId}__${listId}`;
  cols.forEach((col) => {
    if (col.id !== selectedId) {
      col.classList.remove('lesson__selector_title_selected');
      col.classList.add('lesson__selector_title_not_selected');
    } else {
      col.classList.add('lesson__selector_title_selected');
      col.classList.remove('lesson__selector_title_not_selected');
    }
  });
  onclick(listId);
}

export function makeSelectorHTML(
  selectorItems: SelectorList,
  firstSelection: string = selectorItems.order[0].id,
  id: string = 'id__lesson_selector',
  diagram: Diagram,
  onclick: Function,
  yPosition: number = diagram.limits.top - diagram.limits.height / 2,
  separator: string = '',
) {
  const table = document.createElement('table');
  table.classList.add('lesson__selector_table');
  const row = document.createElement('tr');
  const cols: Array<HTMLElement> = [];

  const numKeys = selectorItems.order.length;
  selectorItems.order.forEach((selectorItem, index) => {
    const col = document.createElement('td');
    col.innerHTML = selectorItem.text;
    col.id = `${id}__${selectorItem.id}`;
    col.onclick = selectorHandler.bind(this, selectorItem.id, id, cols, onclick);
    col.classList.add('lesson__selector_title_not_selected');
    col.classList.add('lesson__selector_table_selectable');
    cols.push(col);
    row.appendChild(col);
    if (separator !== '' && index < numKeys - 1) {
      const sep = document.createElement('td');
      sep.innerHTML = '/';
      sep.style.paddingLeft = '0';
      sep.style.paddingRight = '0';
      row.appendChild(sep);
    }
  });

  table.appendChild(row);
  const selector = diagram.shapes.htmlElement(table, id, 'lesson__selector_container');
  selector.setPosition(diagram.limits.left, yPosition);
  selectorHandler(firstSelection, id, cols, onclick);
  return selector;
}

export function makeVerticalSelectorHTML(
  selectorItems: SelectorList,
  firstSelection: string = selectorItems.order[0].id,
  id: string = 'id__lesson_selector',
  diagram: Diagram,
  onclick: Function,
) {
  const table = document.createElement('table');
  table.classList.add('lesson__vertical_selector_table');
  const cols: Array<HTMLElement> = [];

  selectorItems.order.forEach((selectorItem) => {
    const row = document.createElement('tr');
    const col = document.createElement('td');
    col.innerHTML = selectorItem.text;
    col.id = `${id}__${selectorItem.id}`;
    col.onclick = selectorHandler.bind(this, selectorItem.id, id, cols, onclick);
    col.classList.add('lesson__selector_title_not_selected');
    col.classList.add('lesson__selector_table_selectable');
    cols.push(col);
    row.appendChild(col);
    table.appendChild(row);
  });

  const selector = diagram.shapes.htmlElement(table, id, 'lesson__selector_container');
  selector.setPosition(0, 0);
  selectorHandler(firstSelection, id, cols, onclick);
  return selector;
}

export function makeSelectorText(
  selectorItems: SelectorList,
  firstSelection: string = selectorItems.order[0].id,
  diagram: Diagram,
  onclick: Function = () => {},
  yPosition: number = diagram.limits.top - diagram.limits.height / 2,
  font: DiagramFont = layout.defaultFont,
  selectedColor: Array<number> = layout.colors.diagram.text.base,
  separator: string = '',
  spacing: ?number = null,
) {
  const selector = diagram.shapes.collection(new Transform().translate(0, 0));
  let width = 0;
  const widthRecord = [];

  let disabledColor = font.color;
  if (typeof disabledColor === 'string') {
    disabledColor = RGBToArray(disabledColor).slice();
  } else if (disabledColor == null) {
    disabledColor = [0.5, 0.5, 0.5, 1];
  } else {
    disabledColor = disabledColor.slice();
  }

  const selectorHandlerText = (id: string) => {
    selector.setColor(disabledColor);
    selector[`_${id}`].setColor(selectedColor.slice());
    onclick(id);
    diagram.animateNextFrame();
  };

  const numTitles = selectorItems.order.length;
  selectorItems.order.forEach((selectorItem, index) => {
    const text = diagram.shapes.text(
      selectorItem.text,
      new Point(0, 0),
      disabledColor,
      font,
    );
    text.setFirstTransform(diagram.diagramToGLSpaceTransform);
    text.isTouchable = true;
    text.onClick = selectorHandlerText.bind(this, selectorItem.id);
    const bounds = text.getRelativeDiagramBoundingRect();
    width += bounds.width;
    widthRecord.push(bounds.width);
    selector.add(selectorItem.id, text);

    if (separator !== '' && index < numTitles - 1) {
      const sep = diagram.shapes.text(
        separator,
        new Point(0, 0),
        disabledColor,
        font,
      );
      sep.setFirstTransform(diagram.diagramToGLSpaceTransform);
      const sepBounds = sep.getRelativeDiagramBoundingRect();
      width += sepBounds.width;
      widthRecord.push(sepBounds.width);
      selector.add(`sep${index}`, sep);
    }
  });

  let space = 0;
  if (spacing == null) {
    space = (diagram.limits.width - width) / numTitles;
  } else {
    space = spacing;
  }

  let x = 0 - width / 2 - space * numTitles / 2;
  selector.order.forEach((key, index) => {
    const element = selector.elements[key];
    if (separator !== '' && index % 2 === 1) {
      element.setPosition(x + widthRecord[index] / 2, 0);
      x += widthRecord[index];
    } else {
      element.setPosition(x + widthRecord[index] / 2 + space / 2, 0);
      x += widthRecord[index] + space;
    }
  });
  selector.hasTouchableElements = true;
  selector.setPosition(0, yPosition);
  selectorHandlerText(firstSelection);
  return selector;
}

export function makeVerticalSelectorText(
  selectorItems: SelectorList,
  firstSelection: string = selectorItems.order[0].id,
  diagram: Diagram,
  onclick: Function = () => {},
  font: DiagramFont = layout.defaultFont,
  selectedColor: Array<number> = layout.colors.diagram.text.base,
  spacing: ?number = null,
) {
  const selector = diagram.shapes.collection(new Transform().translate(0, 0));
  let height = 0;
  const heightRecord = [];

  let disabledColor = font.color;
  if (typeof disabledColor === 'string') {
    disabledColor = RGBToArray(disabledColor).slice();
  } else if (disabledColor == null) {
    disabledColor = [0.5, 0.5, 0.5, 1];
  } else {
    disabledColor = disabledColor.slice();
  }

  const selectorHandlerText = (id: string) => {
    selector.setColor(disabledColor);
    selector[`_${id}`].setColor(selectedColor.slice());
    onclick(id);
    diagram.animateNextFrame();
  };

  const numTitles = selectorItems.order.length;
  selectorItems.order.forEach((selectorItem) => {
    const text = diagram.shapes.text(
      selectorItem.text,
      new Point(0, 0),
      disabledColor,
      font,
    );
    text.setFirstTransform(diagram.diagramToGLSpaceTransform);
    text.isTouchable = true;
    text.onClick = selectorHandlerText.bind(this, selectorItem.id);
    const bounds = text.getRelativeDiagramBoundingRect();
    height += bounds.height;
    heightRecord.push(bounds.height);
    selector.add(selectorItem.id, text);
  });

  let space = 0;
  if (spacing == null) {
    space = (diagram.limits.height - height) / numTitles;
  } else {
    space = spacing;
  }

  let y = 0;
  selector.order.forEach((key, index) => {
    const element = selector.elements[key];
    element.setPosition(0, y - heightRecord[index] / 2 - space / 2);
    y -= heightRecord[index] + space;
    // }
  });
  selector.hasTouchableElements = true;
  selectorHandlerText(firstSelection);
  return selector;
}
