// @flow

// import * as m2 from '../tools/m2';
import { Point, spaceToSpaceTransformMatrix } from '../tools/g2';
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
  }

  getGLBoundaries(): Array<Array<Point>> {
    const parentRect = this.parentDiv.getBoundingClientRect();
    const glSpace = {
      x: { bottomLeft: -1, width: 2 },
      y: { bottomLeft: -1, height: 2 },
    };
    const pixelSpace = {
      x: { bottomLeft: 0, width: parentRect.width },
      y: { bottomLeft: parentRect.height, height: -parentRect.height },
    };
    const pixelToGLMatrix = spaceToSpaceTransformMatrix(pixelSpace, glSpace);

    const elementRect = this.element.getBoundingClientRect();
    const left = elementRect.left - parentRect.left;
    const right = left + elementRect.width;
    const top = elementRect.top - parentRect.top;
    const bottom = elementRect.top + elementRect.height;

    const boundary = [];
    boundary.push(new Point(left, top));
    boundary.push(new Point(right, top));
    boundary.push(new Point(right, bottom));
    boundary.push(new Point(left, bottom));

    return [boundary.map(p => p.transformBy(pixelToGLMatrix))];
  }

  // calcBorder(limits: Rect) {
  //   if (this.element) {
  //     this.border = [[]];
  //     const parentClient = this.parentDiv.getBoundingClientRect();
  //     const elementClient = this.element.getBoundingClientRect();

  //     // const rect = this.element.getBoundingClientRect();
  //     const rect = new Rect(
  //       elementClient.left - parentClient.left,
  //       elementClient.top - parentClient.top,
  //       elementClient.width * 1.01,
  //       elementClient.height,
  //     );
  //     this.border[0].push(this.pixelToDiagramSpace(
  //       limits,
  //       new Point(rect.left, rect.top),
  //     ));
  //     this.border[0].push(this.pixelToDiagramSpace(
  //       limits,
  //       new Point(rect.right, rect.top),
  //     ));
  //     this.border[0].push(this.pixelToDiagramSpace(
  //       limits,
  //       new Point(rect.right, rect.bottom),
  //     ));
  //     this.border[0].push(this.pixelToDiagramSpace(
  //       limits,
  //       new Point(rect.left, rect.bottom),
  //     ));
  //   }
  // }

  // pixelToDiagramSpace(limits: Rect, p: Point) {
  //   const x = p.x / this.parentDiv.offsetWidth * limits.width + limits.left;
  //   const y = limits.top - p.y / this.parentDiv.offsetWidth * limits.width;
  //   return new Point(x, y);
  // }

  glToPixelSpace(p: Point) {
    const x = (p.x - -1) / 2 * this.parentDiv.offsetWidth;
    const y = (1 - p.y) / 2 * this.parentDiv.offsetHeight;
    return new Point(x, y);
  }

  transformHtml(transformMatrix: Array<number>) {
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
    this.element.style.position = 'absolute';
    this.element.style.left = `${x}px`;
    this.element.style.top = `${y}px`;
    // this.element.style = `position:absolute; left:${x}px; top:${y}px;`;
  }
  drawWithTransformMatrix(transformMatrix: Array<number>) {
    this.transformHtml(transformMatrix);
  }
}

export default HTMLObject;
// Transform -1 to 1 space to 0 to width/height space
