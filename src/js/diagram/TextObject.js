// @flow

// import * as g2 from '../g2';
import * as m2 from './m2';
import * as g2 from './g2';
import DrawingObject from './DrawingObject';

// Base clase of all objects made from verteces for webgl.
// The job of a VertexObject is to:
//  - Havve the points of a object/shape
//  - Have the shape's border (used to determine whether a location is
//    within the shape)
//  - Setup the webgl buffer:
//      - Load vertices into a webgl buffer
//      - draw
class TextObject extends DrawingObject {
  ctx: CanvasRenderingContext2D;
  text: string;
  border: Array<Array<g2.Point>>;
  numPoints: number;
  location: g2.Point;

  constructor(
    ctx: CanvasRenderingContext2D,
    text: string,
    location: g2.Point = new g2.Point(0, 0),
  ) {
    super();
    this.ctx = ctx;
    this.text = text;
    this.location = location;
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
  drawWithTransformMatrix(
    transformMatrix: Array<number>,
    count: number,
    color: Array<number>,
  ) {
    const transformedLocation = this.location.transformBy(transformMatrix);
    this.ctx.font = '200 16px Helvetica Neue';
    this.ctx.fillStyle = `rgba(${color[0] * 255},${color[1] * 255},${color[2] * 255},${color[3] * 255})`;
    this.ctx.save();
    const t = transformMatrix;
    // this.ctx.setTransform(t[0], t[1], t[2], t[3], t[4], t[5]);
    // console.log(t)
    this.ctx.fillText(this.text, transformedLocation.x, transformedLocation.y);
    this.ctx.restore();
  }
}

export default TextObject;
