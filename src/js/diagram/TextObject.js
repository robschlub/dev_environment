// @flow

// import * as g2 from '../g2';
import * as m2 from './m2';
import * as g2 from './g2';
import DrawingObject from './DrawingObject';
import DrawContext2D from './DrawContext2D';

// Base clase of all objects made from verteces for webgl.
// The job of a VertexObject is to:
//  - Havve the points of a object/shape
//  - Have the shape's border (used to determine whether a location is
//    within the shape)
//  - Setup the webgl buffer:
//      - Load vertices into a webgl buffer
//      - draw
class TextObject extends DrawingObject {
  drawContext2D: DrawContext2D;
  text: string;
  border: Array<Array<g2.Point>>;
  numPoints: number;
  location: g2.Point;
  align: Array<string>;
  offset: g2.Point;

  constructor(
    drawContext2D: DrawContext2D,
    text: string,
    location: g2.Point = new g2.Point(0, 0),
    align: Array<string> = ['top', 'middle'],
    offset: g2.Point = new g2.Point(0, 0),
  ) {
    super();
    this.drawContext2D = drawContext2D;
    this.text = text;
    this.location = location;
    this.align = align;
    this.offset = offset;
  }
  draw(
    translation: g2.Point,
    rotation: number,
    scale: g2.Point,
    count: number,
    color: Array<number>,
  ) {
    let transformation = m2.identity();
    transformation = m2.translate(transformation, translation.x, translation.y);
    transformation = m2.rotate(transformation, rotation);
    transformation = m2.scale(transformation, scale.x, scale.y);
    this.drawWithTransformMatrix(m2.t(transformation), count, color);
  }
  clipToElementPixels(clipPoint: g2.Point) {
    // transforming -1 to 1 to canvas width
    const px = (clipPoint.x + 1) / 2 * this.drawContext2D.canvas.width / this.drawContext2D.ratio;
    const py = -(clipPoint.y - 1) / 2 * this.drawContext2D.canvas.height / this.drawContext2D.ratio;
    return new g2.Point(px, py);
  }
  drawWithTransformMatrix(
    transformMatrix: Array<number>,
    count: number,
    color: Array<number>,
  ) {
    const transformedLocation = this.location.transformBy(transformMatrix);
    const { ctx } = this.drawContext2D;

    ctx.font = '200 12px Helvetica Neue';
    ctx.textAlign = this.align[0];    // eslint-disable-line
    ctx.textBaseline = this.align[1]; // eslint-disable-line

    this.drawContext2D.ctx.fillStyle = `rgba(${color[0] * 255},${color[1] * 255},${color[2] * 255},${color[3] * 255})`;
    // this.drawContext2D.ctx.save();
    const p = this.clipToElementPixels(transformedLocation.add(this.offset));
    // const t = transformMatrix;
    // const translation = this.clipToElementPixels(new g2.Point(t[2], t[5]));

    // this.drawContext2D.ctx.translate(translation.x, translation.y)
    // this.drawContext2D.ctx.rotate(Math.asin(-t[3]));
    // this.drawContext2D.ctx.translate(p.x, p.y)
    // this.drawContext2D.ctx.setTransform(t[0], t[1], 0, t[3], t[4], 0);
    // console.log(t)
    // p = p.add(new g2.Point(
    //   -this.drawContext2D.ctx.measureText(this.text).width / 2,
    //   16,
    // ));
    // p = p.add(this.offset);
    this.drawContext2D.ctx.fillText(this.text, p.x, p.y);
    // this.drawContext2D.ctx.restore();
  }
}

export default TextObject;

// Transform -1 to 1 space to 0 to width/height space