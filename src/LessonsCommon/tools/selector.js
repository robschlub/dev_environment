// @flow

import Diagram from '../../js/diagram/Diagram';
import { DiagramFont } from '../../js/diagram/DrawingObjects/TextObject/TextObject';
import { RGBToArray } from '../../js/tools/tools';

import { Point } from '../../js/diagram/tools/g2';
import baseLayout from '../layout';

const layout = baseLayout();

export function makeSelectorHTML(
  titles: Object,
  firstSelection: string = Object.keys(titles)[0],
  id: string = 'id__lesson_selector',
  diagram: Diagram,
  onclick: Function,
  yPosition: number = diagram.limits.top - diagram.limits.height / 2,
) {
  const table = document.createElement('table');
  table.classList.add('lesson__selector_table');
  const row = document.createElement('tr');
  const cols: Array<HTMLElement> = [];

  const selectorHandler = (key: string) => {
    const selectedId = `${id}__${key}`;
    cols.forEach((col) => {
      if (col.id !== selectedId) {
        col.classList.remove('lesson__selector_title_selected');
        col.classList.add('lesson__selector_table_not_selected');
      } else {
        col.classList.add('lesson__selector_title_selected');
        col.classList.remove('lesson__selector_table_not_selected');
      }
    });
    onclick(key);
  };

  Object.keys(titles).forEach((key) => {
    const col = document.createElement('td');
    col.innerHTML = titles[key];
    col.id = `${id}__${key}`;
    col.onclick = selectorHandler.bind(this, key);
    col.classList.add('lesson__selector_table_not_selected');
    cols.push(col);
    row.appendChild(col);
  });

  table.appendChild(row);
  const selector = diagram.shapes.htmlElement(table, id, 'lesson__selector_container');
  selector.setPosition(diagram.limits.left, yPosition);
  selectorHandler(firstSelection);
  return selector;
}

export function makeSelectorText(
  titles: Object,
  firstSelection: string = Object.keys(titles)[0],
  diagram: Diagram,
  onclick: Function = () => {},
  yPosition: number = diagram.limits.top - diagram.limits.height / 2,
  font: DiagramFont = layout.defaultFont,
  selectedColor: Array<number> = layout.colors.diagram.text.base,
) {
  const selector = diagram.shapes.collection();
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

  const selectorHandler = (key: string) => {
    selector.setColor(disabledColor);
    selector[`_${key}`].setColor(selectedColor.slice());
    onclick(key);
    diagram.animateNextFrame();
  };

  Object.keys(titles).forEach((key) => {
    const text = diagram.shapes.text(
      titles[key],
      new Point(0, 0),
      disabledColor,
      font,
    );
    text.setFirstTransform(diagram.diagramToGLSpaceTransform);
    text.isTouchable = true;
    text.onClick = selectorHandler.bind(this, key);
    const bounds = text.getRelativeDiagramBoundingRect();
    width += bounds.width;
    widthRecord.push(bounds.width);
    selector.add(key, text);
  });

  const numTitles = Object.keys(titles).length;
  const spacing = (diagram.limits.width - width) / numTitles;
  let x = diagram.limits.left + spacing / 2;
  selector.order.forEach((key, index) => {
    const element = selector.elements[key];
    element.setPosition(x + widthRecord[index] / 2, yPosition);
    x += widthRecord[index] + spacing;
  });
  selector.hasTouchableElements = true;
  selectorHandler(firstSelection);
  return selector;
}
