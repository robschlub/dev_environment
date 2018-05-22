// @flow

import { Point } from './tools/g2';

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
}

export default DrawingObject;
