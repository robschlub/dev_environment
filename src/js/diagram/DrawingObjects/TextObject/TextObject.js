// @flow

import * as m2 from '../../tools/m2';
import { Point } from '../../tools/g2';
import DrawingObject from '../DrawingObject';
import DrawContext2D from '../../DrawContext2D';

// DiagramFont defines the font properties to be used in a TextObject
class DiagramFont {
  size: number;
  weight: string;
  style: string;
  family: string;
  alignH: 'left' | 'center' | 'right';
  alignV: 'top' | 'bottom' | 'middle';
  color: string | null;

  constructor(
    family: string = 'Helvetica Neue',
    style: string = '',
    size: number = 1,
    weight: string = '200',
    alignH: 'left' | 'center' | 'right' = 'center',
    alignV: 'top' | 'bottom' | 'middle' = 'middle',
    color: Array<number> | null | string = null,
  ) {
    this.family = family;
    this.style = style;
    this.size = size;
    this.weight = weight;
    this.alignH = alignH;
    this.alignV = alignV;
    if (Array.isArray(color)) {
      this.color = `rgba(${
        Math.floor(color[0] * 255)},${
        Math.floor(color[1] * 255)},${
        Math.floor(color[2] * 255)},${
        Math.floor(color[3] * 255)})`;
    } else {
      this.color = color;
    }
  }
  set(ctx: CanvasRenderingContext2D, scalingFactor: number = 1) {
    ctx.font = `${this.style} ${this.weight} ${this.size * scalingFactor}px ${this.family}`;
    ctx.textAlign = this.alignH;
    ctx.textBaseline = this.alignV;
  }
  copy() {
    return new DiagramFont(
      this.family,
      this.style,
      this.size,
      this.weight,
      this.alignH,
      this.alignV,
      this.color,
    );
  }
}

// DiagramText is a single text element of the diagram that is drawn at
// once and referenced to the same location
class DiagramText {
  location: Point;
  text: string;
  font: DiagramFont;

  constructor(
    location: Point = new Point(0, 0),
    text: string = '',
    font: DiagramFont = new DiagramFont(),
  ) {
    this.location = location.copy();
    this.text = text;
    this.font = font.copy();
  }
}

// TextObject is the DrawingObject used in the DiagramElementPrimative.
// TextObject will draw an array of DiagramText objects.
class TextObject extends DrawingObject {
  drawContext2D: DrawContext2D;
  border: Array<Array<Point>>;
  text: Array<DiagramText>;
  scalingFactor: number;

  constructor(
    drawContext2D: DrawContext2D,
    text: Array<DiagramText> = [],
  ) {
    super();
    this.drawContext2D = drawContext2D;
    this.text = text;
    this.scalingFactor = 1;
    if (text.length > 0) {
      let minSize = this.text[0].font.size;
      this.text.forEach((t) => {
        if (t.font.size > 0 && t.font.size < minSize) {
          minSize = t.font.size;
        }
      });
      if (minSize < 20) {
        this.scalingFactor = minSize * 50;
      }
      if (minSize < 1) {
        const power = -Math.log10(minSize) + 2;
        this.scalingFactor = 10 ** power;
      }
    }
  }

  draw(
    translation: Point,
    rotation: number,
    scale: Point,
    count: number,
    color: Array<number>,
  ) {
    let transformation = m2.identity();
    transformation = m2.translate(transformation, translation.x, translation.y);
    transformation = m2.rotate(transformation, rotation);
    transformation = m2.scale(transformation, scale.x, scale.y);
    this.drawWithTransformMatrix(m2.t(transformation), color);
  }

  // Text is drawn in pixel space which is 0, 0 in the left hand top corner on
  // a canvas of size canvas.offsetWidth x canvas.offsetHeight.
  //
  // Font size and text location is therefore defined in pixels.
  //
  // However, in a Diagram, the text canvas is overlaid on the diagram GL
  // canvas and we want to think about the size and location of text in
  // Diagram Space or Element Space (if the element has a specific transform).
  //
  // For example, if we have a diagram with limits: min: (0, 0), max(2, 1)
  // with a canvas of 1000 x 500 then:
  //    1) Transform pixel space (1000 x 500) to be GL Space (2 x 2). i.e.
  //         - Magnify pixel space by 500 so one unit in the 2D drawing
  //           context is equivalent to 1 unit in GL Space.
  //         - Translate pixel space so 0, 0 is in the middle of the canvas
  //    2) Transform GL Space to Element Space
  //         - The transform matrix in the input parameters includes the
  //           transform to Diagram Space and then Element Space.
  //         - Now one unit in the 2D drawing context is equivalent to 1 unit
  //           in Element Space - i.e. the canvas will have limits of min(0, 0)
  //           and max(2, 1).
  //    3) Plot out all text
  //
  // However, when font size is defined in Element Space, and ends up being
  // <1 Element Space units, we have a problem. This is because font size is
  // still in pixels (just now it's super scaled up). Therefore, a scaling
  // factor is needed to make sure the font size can stay well above 1. This
  // scaling factor scales the final space, so a larger font size can be used.
  // Then all locations definted in Element Space also need to be scaled by
  // this scaling factor.
  //
  // The scaling factor can be number that is large enough to make it so the
  // font size is >>1. In the TextObject constructor, the scaling factor is
  // designed to ensure drawn text always is >20px.
  drawWithTransformMatrix(
    transformMatrix: Array<number>,
    color: Array<number> = [1, 1, 1, 1],
  ) {
    const { ctx } = this.drawContext2D;

    // Arbitrary scaling factor used to ensure font size is >> 1 pixel
    // const scalingFactor = this.drawContext2D.canvas.offsetHeight /
    //                       (this.diagramLimits.height / 1000);

    const { scalingFactor } = this;

    // Color used if color is not defined in each DiagramText element
    const parentColor = `rgba(
      ${Math.floor(color[0] * 255)},
      ${Math.floor(color[1] * 255)},
      ${Math.floor(color[2] * 255)},
      ${Math.floor(color[3] * 255)})`;

    ctx.save();

    // First convert pixel space to a zoomed in pixel space with the same
    // dimensions as gl clip space (-1 to 1 for x, y), but inverted y
    // like to pixel space.
    // When zoomed: 1 pixel = 1 GL unit.
    // Zoom in so limits betcome 0 to 2:
    const sx = this.drawContext2D.canvas.offsetWidth / 2 / scalingFactor;
    const sy = this.drawContext2D.canvas.offsetHeight / 2 / scalingFactor;
    // Translate so limits become -1 to 1
    const tx = this.drawContext2D.canvas.offsetWidth / 2;
    const ty = this.drawContext2D.canvas.offsetHeight / 2;

    // Modify the incoming transformMatrix to be compatible with zoomed
    // pixel space
    //   - Scale by the scaling factor
    //   - Flip the y translation
    //   - Reverse rotation
    const tm = transformMatrix;
    const t = [
      tm[0], -tm[1], tm[2] * scalingFactor,
      -tm[3], tm[4], tm[5] * -scalingFactor,
      0, 0, 1,
    ];

    // Combine the zoomed pixel space with the incoming transform matrix
    // and apply it to the drawing context.
    const totalT = m2.mul([sx, 0, tx, 0, sy, ty, 0, 0, 1], t);
    ctx.transform(totalT[0], totalT[3], totalT[1], totalT[4], totalT[2], totalT[5]);

    // Fill in all the text
    this.text.forEach((diagramText) => {
      diagramText.font.set(ctx, scalingFactor);

      if (diagramText.font.color) {
        ctx.fillStyle = diagramText.font.color;
      } else {
        ctx.fillStyle = parentColor;
      }

      ctx.fillText(
        diagramText.text,
        diagramText.location.x * scalingFactor,
        diagramText.location.y * -scalingFactor,
      );
    });
    ctx.restore();
  }

  getGLBoundaries(lastDrawTransformMatrix: Array<number>): Array<Array<Point>> {
    const glBoundaries = [];
    this.text.forEach((t) => {
      glBoundaries.push(this.getGLBoundaryOfText(t, lastDrawTransformMatrix));
    });
    return glBoundaries;
  }

  getGLBoundaryOfText(
    text: DiagramText,
    lastDrawTransformMatrix: Array<number>,
  ): Array<Point> {
    const glBoundary = [];

    const { scalingFactor } = this;

    // Measure the text
    text.font.set(this.drawContext2D.ctx, scalingFactor);
    const textMetrics = this.drawContext2D.ctx.measureText(text.text);

    // Create a box around the text
    const { location } = text;
    const box = [
      new Point(
        -textMetrics.actualBoundingBoxLeft / scalingFactor,
        textMetrics.actualBoundingBoxAscent / scalingFactor,
      ).add(location),
      new Point(
        textMetrics.actualBoundingBoxRight / scalingFactor,
        textMetrics.actualBoundingBoxAscent / scalingFactor,
      ).add(location),
      new Point(
        textMetrics.actualBoundingBoxRight / scalingFactor,
        -textMetrics.actualBoundingBoxDescent / scalingFactor,
      ).add(location),
      new Point(
        -textMetrics.actualBoundingBoxLeft / scalingFactor,
        -textMetrics.actualBoundingBoxDescent / scalingFactor,
      ).add(location),
    ];

    box.forEach((p) => {
      glBoundary.push(p.transformBy(lastDrawTransformMatrix));
    });

    return glBoundary;
  }
}

export { TextObject, DiagramText, DiagramFont };
