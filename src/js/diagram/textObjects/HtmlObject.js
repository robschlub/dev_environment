// @flow

import * as m2 from '../tools/m2';
import { Point, Transform, Rect } from '../tools/g2';
import DrawingObject from '../DrawingObject';


class HTMLObject extends DrawingObject {
  border: Array<Array<Point>>;
  id: string;
  location: Point;
  // diagramLimits: Rect;
  element: HTMLElement;
  parentDiv: HTMLElement;
  alignH: 'left' | 'right' | 'center';
  alignV: 'top' | 'bottom' | 'middle';

  constructor(
    parentDiv: HTMLElement,
    id: string,
    location: Point,
    alignV: 'top' | 'bottom' | 'middle' = 'middle',
    alignH: 'left' | 'right' | 'center' = 'center',
  ) {
    super();
    const element = document.getElementById(id);
    if (element) {
      this.element = element;
    }
    this.location = location;
    this.alignV = alignV;
    this.alignH = alignH;
    this.parentDiv = parentDiv;
    this.calcBorder();
  }

  calcBorder() {
    if (this.element) {
      this.border = [[]];
      const rect = this.element.getBoundingClientRect();
      this.border[0].push(this.pixelToGlSpace(new Point(
        rect.left,
        rect.top,
      )));
      this.border[0].push(this.pixelToGlSpace(new Point(
        rect.right,
        rect.top,
      )));
      this.border[0].push(this.pixelToGlSpace(new Point(
        rect.right,
        rect.bottom,
      )));
      this.border[0].push(this.pixelToGlSpace(new Point(
        rect.left,
        rect.bottom,
      )));
    }
  }
  pixelToGlSpace(p: Point) {
    const x = p.x * 2 / this.parentDiv.offsetWidth - 1;
    const y = 1 - p.y * 2 / this.parentDiv.offsetHeight;
    return new Point(x, y);
  }

  glToPixelSpace(p: Point) {
    const x = (p.x - -1) / 2 * this.parentDiv.offsetWidth;
    const y = (1 - p.y) / 2 * this.parentDiv.offsetHeight;
    return new Point(x, y);
  }

  drawWithTransformMatrix(
    transformMatrix: Array<number>,
    count: number,
    color: Array<number>,
  ) {
    const glLocation = this.location.transformBy(transformMatrix);
    const pixelLocation = this.glToPixelSpace(glLocation);
    const w = this.element.offsetWidth;
    const h = this.element.offsetHeight;
    let left = 0;
    let top = 0;
    if (this.alignH === 'center') {
      left = -w / 2;
    } else if (this.alignH === 'right') {
      left = -w;
    }
    if (this.alignV === 'middle') {
      top = -h / 2;
    } else if (this.alignV === 'bottom') {
      top = -h;
    }
    const x = pixelLocation.x + left;
    const y = pixelLocation.y + top;
    console.log(x, y)
    console.log(this.parentDiv.offsetWidth, this.parentDiv.offsetHeight)
    this.element.style = `position:absolute; left:${x}px; top:${y}px`;
  }
}

export default HTMLObject;
// Transform -1 to 1 space to 0 to width/height space
