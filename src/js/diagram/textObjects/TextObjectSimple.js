// @flow

// import * as g2 from '../g2';
import * as m2 from '../tools/m2';
import { Point, Transform, Translation, Rect, Scale, Rotation } from '../tools/g2';
import DrawingObject from '../DrawingObject';
import DrawContext2D from '../DrawContext2D';
// import { roundNum } from './mathtools';

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
  text: string;
  numPoints: number;
  location: Point;
  align: Array<string>;

  // Text clip space (-1 to 1) without any upstream trasnform
  // Meaning if the diagram clip space is 0, 4, then the offset will be
  // doubled.
  fontFamily: string;
  fontWeight: string;
  fontSize: string;
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
    text: string,
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
    this.fontSize = '14px';
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
    // const transformedLocation = this.location.transformBy(transformMatrix);
    const { ctx } = this.drawContext2D;
    const fontSize = 0.5;
    const scalingFactor = 100;
    // ctx.font = `${this.fontWeight} ${this.fontSize} ${this.fontFamily}`;
    ctx.font = `${this.fontWeight} ${fontSize * scalingFactor}px ${this.fontFamily}`;
    ctx.textAlign = this.align[0];    // eslint-disable-line
    ctx.textBaseline = this.align[1]; // eslint-disable-line

    ctx.fillStyle = `rgba(
      ${Math.floor(color[0] * 255)},
      ${Math.floor(color[1] * 255)},
      ${Math.floor(color[2] * 255)},
      ${Math.floor(color[3] * 255)})`;

    // let p = this.clipToElementPixels(transformedLocation.add(this.offset));
    // const p = this.clipToElementPixels(transformedLocation);
    ctx.save();
    // for (let i = 0; i < this.transform.order.length; i += 1) {
    //   const t = this.transform.order[i];
    //   if (t instanceof Translation) {
    //     ctx.translate(t.x, t.y);
    //   }
    //   if (t instanceof Rotation) {
    //     ctx.rotate(t.r);
    //   }
    //   if (t instanceof Scale) {
    //     ctx.scale(t.x, t.y);
    //   }
    // }
    // // Now transform the pixel space to clip space
    const t = transformMatrix;

    ctx.translate(
      this.drawContext2D.canvas.offsetWidth / 2,
      this.drawContext2D.canvas.offsetHeight / 2,
    );
    ctx.scale(
      this.drawContext2D.canvas.offsetWidth / 2 / scalingFactor,
      this.drawContext2D.canvas.offsetHeight / 2 / scalingFactor,
    );

    ctx.transform(t[0], t[3], t[1], t[4], t[2] * scalingFactor, -t[5] * scalingFactor);
    // ctx.translate(1, 0);
    // ctx.transform(t[0], t[1], t[3], t[4], t[6], t[7]);
    // console.log(t)
    // const scaleX = this.drawContext2D.canvas.clientWidth / this.diagramLimits.width;
    // const scaleY = this.drawContext2D.canvas.clientHeight / this.diagramLimits.height;
    // ctx.scale(
    //   scaleX,
    //   scaleY,
    // );
    // ctx.translate(
    //   -this.diagramLimits.left * scaleX,
    //   -this.diagramLimits.bottom * scaleY,
    // );
    // console.log(this.drawContext2D.canvas.width)
    // console.log(this.drawContext2D.canvas.height)
    // console.log(-this.diagramLimits.left, scaleX)
    // ctx.translate(-this.diagramLimits.left * scaleX, 100)
    // console.log(this.drawContext2D.canvas.width, this.drawContext2D.canvas.offsetWidth);
    // console.log(this.diagramLimits)

    // ctx.translate(
    //   -this.diagramLimits.left / this.diagramLimits.width * this.drawContext2D.canvas.clientWidth,
    //   this.diagramLimits.top / this.diagramLimits.height * this.drawContext2D.canvas.clientHeight,
    // );

    // ctx.translate(
    //   1 / 2 * this.drawContext2D.canvas.clientWidth,
    //   1 / 2 * this.drawContext2D.canvas.clientHeight,
    // );


    // ctx.translate(1478 / 4, 986/4);
    // const q = this.clipToElementPixels(transformedLocation.add(this.offset));
    // p = p.add(this.clipToElementPixels(this.offset));
    // p = p.add(this.offset)
    // this.lastDrawPoint = q;
    ctx.fillText(this.text, this.location.x, this.location.y);
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

export default TextObjectSimple;
// Transform -1 to 1 space to 0 to width/height space
