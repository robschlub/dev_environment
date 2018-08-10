// @flow

import Diagram from '../../../js/diagram/Diagram';
import {
  Transform, Point, minAngleDiff, polarToRect,
} from '../../../js/diagram/tools/g2';
import {
  DiagramElementCollection, DiagramElementPrimative,
} from '../../../js/diagram/Element';
import lessonLayout from './layout';
// import { Equation } from '../../../js/diagram/DiagramElements/Equation/GLEquation';


class RelatedAnglesCollection extends DiagramElementCollection {
  layout: Object;
  colors: Object;
  shapes: Object;
  diagram: Diagram;
  // varState: TypeVarStateExtended;
  // anglePairNames: Array<string>;
  // eqn: TypeMainTextEquation;

  makeSelector(
    titles: Object,
    firstSelection: string = Object.keys(titles)[0],
    id: string = 'id__lesson_selector',
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
      this.selectorClicked(key);
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
    const selector = this.diagram.shapes.htmlElement(table, id, 'lesson__selector_container');
    selector.setPosition(this.diagram.limits.left, this.layout.selector.y);
    this.add('_selector', selector);
    selectorHandler(firstSelection);
  }

  makeSelectorOld(titles: Object, yPosition: number = 1.8) {
    const selector = this.diagram.shapes.collection();
    let width = 0;
    const widthRecord = [];

    Object.keys(titles).forEach((key) => {
      const text = this.diagram.shapes.text(
        titles[key],
        new Point(0, 0),
        this.layout.selectorFont.color,
        this.layout.selectorFont,
      );
      text.setFirstTransform(this.diagram.diagramToGLSpaceTransform);
      text.isTouchable = true;
      text.onClick = this.selectorClicked.bind(this, key);
      const bounds = text.getRelativeDiagramBoundingRect();
      width += bounds.width;
      widthRecord.push(bounds.width);
      selector.add(key, text);
    });

    const numTitles = Object.keys(titles).length;
    const spacing = (this.diagram.limits.width - width) / numTitles;
    let x = this.diagram.limits.left + spacing / 2;
    selector.order.forEach((key, index) => {
      // console.log(key, x, widthRecord[index])
      const element = selector.elements[key];
      element.setPosition(x + widthRecord[index] / 2, yPosition);
      x += widthRecord[index] + spacing;
    });
    selector.hasTouchableElements = true;
    this.add('_selector', selector);
  }

  constructor(diagram: Diagram, transform: Transform = new Transform()) {
    super(transform, diagram.limits);
    this.diagram = diagram;
    this.layout = lessonLayout();

    this.makeSelector({
      parallel: 'Parallel',
      opposite: 'Vertically Opposite',
      corresponding: 'Corresponding',
      alternate: 'Alternate',
      interior: 'Interior',
    }, 'opposite');
  }

  selectorClicked(title: string) {
    console.log(title);
  }
  goToParallel() {
  }
  goToOpposite() {
  }
  goToCorresponding() {
  }
  goToAlternate() {
  }

  goToInterior() {
  }

}

export default RelatedAnglesCollection;
