// @flow

// import * as g2 from '../g2';
import * as m2 from '../tools/m2';
import { Point, Transform, Translation, Rect, Scale, Rotation } from '../tools/g2';
import DrawingObject from '../DrawingObject';
import DrawContext2D from '../DrawContext2D';
// import { roundNum } from './mathtools';

class DiagramText {
  location: Point;
  text: string;

  constructor(location = new Point(0, 0), text = '') {
    this.location = location;
    this.text = text;
  }
}
// Base clase of all objects made from verteces for webgl.
// The job of a VertexObject is to:
//  - Havve the points of a object/shape
//  - Have the shape's border (used to determine whether a location is
//    within the shape)
//  - Setup the webgl buffer:
//      - Load vertices into a webgl buffer
//      - draw
class TextObjectSimple extends DrawingObject {
  drawContext2D: DrawContext2D;
  text: Array<DiagramText>;
  numPoints: number;
  location: Point;
  align: Array<string>;

  // Text clip space (-1 to 1) without any upstream trasnform
  // Meaning if the diagram clip space is 0, 4, then the offset will be
  // doubled.
  fontFamily: string;
  fontWeight: string;
  fontSize: number;
  fontStyle: string;
  lastDrawPoint: Point;
  pixelSize: {
    left: number,
    top: number,
    right: number,
    bottom: number,
  };
  rotation: number;
  transform: Transform;
  diagramLimits: Rect;

  constructor(
    drawContext2D: DrawContext2D,
    text: Array<DiagramText>,
    // text: string,
    location: Point = new Point(0, 0),
    align: Array<string> = ['center', 'middle'],
    diagramLimits: Rect = new Rect(-1, -1, 2, 2),
  ) {
    super();
    this.drawContext2D = drawContext2D;
    this.text = text;
    this.location = location;
    this.align = align;
    this.fontFamily = 'Helvetica Neue';
    this.fontWeight = '200';
    this.fontSize = 0.5;
    this.fontStyle = '';
    this.calcPixelSize();
    this.lastDrawPoint = this.location;
    this.transform = new Transform();
    this.diagramLimits = diagramLimits;
  }
  updateFont(
    size: string = '14px',
    weight: string = '200',
    family: string = 'Helvetica Neue',
  ) {
    this.fontFamily = family;
    this.fontWeight = weight;
    this.fontSize = size;
    this.calcPixelSize();
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
    this.drawWithTransformMatrix(m2.t(transformation), count, color);
  }
  clipToElementPixels(clipPoint: Point) {
    // transforming -1 to 1 to canvas width
    const px = (clipPoint.x + 1) / 2 * this.drawContext2D.canvas.width / this.drawContext2D.ratio;
    const py = -(clipPoint.y - 1) / 2 * this.drawContext2D.canvas.height / this.drawContext2D.ratio;
    return new Point(px, py);
  }
  // pixelPointToClip(pixelPoint: Point) {
  //   const px = pixelPoint.x * this.drawContext2D.ratio /
  //     this.drawContext2D.canvas.width * 2 - 1;
  //   const py = -(pixelPoint.y * this.drawContext2D.ratio /
  //     this.drawContext2D.canvas.height * 2 + 1);
  //   return new Point(px, py);
  // }
  // pixelsToClip(pixels: Point) {
  //   const px = pixels.x / this.drawContext2D.canvas.width * this.drawContext2D.ratio * 2;
  //   const py = pixels.y / this.drawContext2D.canvas.height * this.drawContext2D.ratio * 2;
  //   return new Point(px, py);
  // }
  // canvasPercentage(pixels: Point) {
  //   const px = pixels.x / this.drawContext2D.canvas.width * this.drawContext2D.ratio;
  //   const py = pixels.y / this.drawContext2D.canvas.height * this.drawContext2D.ratio;
  //   return new Point(px, py);
  // }
  drawWithTransformMatrix(
    transformMatrix: Array<number>,
    count: number,
    color: Array<number>,
  ) {
    const { ctx } = this.drawContext2D;
    const scalingFactor = this.drawContext2D.canvas.offsetWidth / this.fontSize;
    ctx.font = `${this.fontStyle} ${this.fontWeight} ${this.fontSize * scalingFactor}px ${this.fontFamily}`;
    ctx.textAlign = this.align[0];    // eslint-disable-line
    ctx.textBaseline = this.align[1]; // eslint-disable-line

    ctx.fillStyle = `rgba(
      ${Math.floor(color[0] * 255)},
      ${Math.floor(color[1] * 255)},
      ${Math.floor(color[2] * 255)},
      ${Math.floor(color[3] * 255)})`;

    ctx.save();

    // First convert pixel space to gl clip space (-1 to 1 for x, y)
    const sx = this.drawContext2D.canvas.offsetWidth / 2 / scalingFactor;
    const sy = this.drawContext2D.canvas.offsetHeight / 2 / scalingFactor;
    const tx = this.drawContext2D.canvas.offsetWidth / 2;
    const ty = this.drawContext2D.canvas.offsetHeight / 2;
    ctx.transform(sx, 0, 0, sy, tx, ty);
    // ctx.translate(
    //   this.drawContext2D.canvas.offsetWidth / 2,
    //   this.drawContext2D.canvas.offsetHeight / 2,
    // );
    // ctx.scale(
    //   this.drawContext2D.canvas.offsetWidth / 2 / scalingFactor,
    //   this.drawContext2D.canvas.offsetHeight / 2 / scalingFactor,
    // );

    // Transform clip space to diagram space
    const t = transformMatrix;
    ctx.transform(t[0], t[3], t[1], t[4], t[2] * scalingFactor, -t[5] * scalingFactor);

    // Fill in all the text
    this.text.forEach((diagramText) => {
      ctx.fillText(
        diagramText.text,
        diagramText.location.x * scalingFactor,
        diagramText.location.y * scalingFactor,
      );
    });
    ctx.restore();
  }
  calcPixelSize() {
    const { ctx } = this.drawContext2D;
    ctx.font = `${this.fontWeight} ${this.fontSize} ${this.fontFamily}`;
    ctx.textAlign = this.align[0];    // eslint-disable-line
    ctx.textBaseline = this.align[1]; // eslint-disable-line

    // get the text measurement
    const textMetrics = this.drawContext2D.ctx.measureText(this.text);
    const leftTop = (new Point(
      textMetrics.actualBoundingBoxLeft,
      textMetrics.actualBoundingBoxAscent,
    ));
    const rightBottom = (new Point(
      textMetrics.actualBoundingBoxRight,
      textMetrics.actualBoundingBoxDescent,
    ));
    const left = leftTop.x;
    const top = leftTop.y;
    const right = rightBottom.x;
    const bottom = rightBottom.y;

    this.pixelSize = {
      left, top, right, bottom,
    };
  }
  // calcBorder() {
  //   // first setup the text
  //   const { ctx } = this.drawContext2D;
  //   ctx.font = `${this.fontWeight} ${this.fontSize} ${this.fontFamily}`;
  //   ctx.textAlign = this.align[0];    // eslint-disable-line
  //   ctx.textBaseline = this.align[1]; // eslint-disable-line

  //   // get the text measurement
  //   const textMetrics = this.drawContext2D.ctx.measureText(this.text);
  //   const leftTop = this.canvasPercentage(new Point(
  //     textMetrics.actualBoundingBoxLeft,
  //     textMetrics.actualBoundingBoxAscent,
  //   ));
  //   const rightBottom = this.canvasPercentage(new Point(
  //     textMetrics.actualBoundingBoxRight,
  //     textMetrics.actualBoundingBoxDescent,
  //   ));
  //   const left = leftTop.x;
  //   const top = leftTop.y;
  //   const right = rightBottom.x;
  //   const bottom = rightBottom.y;

  //   // calculate the border
  //   const p1 = this.location.add(this.offset.add(new Point(-left, top)));
  //   const p2 = this.location.add(this.offset.add(new Point(right, top)));
  //   const p3 = this.location.add(this.offset.add(new Point(right, -bottom)));
  //   const p4 = this.location.add(this.offset.add(new Point(-left, -bottom)));
  //   this.border = [[p1, p2, p3, p4, p1]];
  // }
}

export { TextObjectSimple, DiagramText };
// Transform -1 to 1 space to 0 to width/height space
