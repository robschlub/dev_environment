// @flow

import { Point, Rect } from './tools/g2';

// A Drawing object can be:
//  - GL primitive vertices
//  - Text object for 2D drawing contexts
//  - HTML Object in the diagram_html div
//
// It must have properties:
//    - border
//        Array of borders in Diagram Units
// Have methods:
//    - drawWithTransformMatrix(transformMatrix)
//    - calcBorder(lastDrawTransformMatrix, glToDiagramTransform)
//
class DrawingObject {
  // numPoints: number;           // Number of primative vertices
  border: Array<Array<Point>>; // Border vertices

  constructor() {
    // this.numPoints = 0;
    this.border = [[]];
  }

  /* eslint-disable class-methods-use-this, no-unused-vars */
  // glToDiagramTransformMatrix: Array<number>,
  getGLBoundaries(lastDrawTransformMatrix: Array<number>): Array<Array<Point>> {
    const glBoundaries = [];
    this.border.forEach((boundary) => {
      const glBorder = [];
      boundary.forEach((point) => {
        glBorder.push(point.transformBy(lastDrawTransformMatrix));
      });
      glBoundaries.push(glBorder);
    });
    return glBoundaries;
  }
  /* eslint-enable */

  /* eslint-disable class-methods-use-this, no-unused-vars */
  drawWithTransformMatrix(
    transformMatrix: Array<number>,
    color: Array<number>,
    numPoints: number,
  ) {
  }
  /* eslint-enable */

  getGLBoundingRect(lastDrawTransformMatrix: Array<number>): Rect {
    const boundaries = this.getGLBoundaries(lastDrawTransformMatrix);
    const min = new Point(0, 0);
    const max = new Point(0, 0);
    let firstPoint = true;

    boundaries.forEach((boundary) => {
      boundary.forEach((point) => {
        if (firstPoint) {
          min.x = point.x;
          min.y = point.y;
          max.x = point.x;
          max.y = point.y;
          firstPoint = false;
        } else {
          min.x = point.x < min.x ? point.x : min.x;
          min.y = point.y < min.y ? point.y : min.y;
          max.x = point.x > max.x ? point.x : max.x;
          max.y = point.y > max.y ? point.y : max.y;
        }
      });
    });
    return new Rect(min.x, min.y, max.x - min.x, max.y - min.y);
  }
}

export default DrawingObject;
