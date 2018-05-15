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
  lastDrawTransformMatrix: Array<number>;

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
    this.lastDrawTransformMatrix = new Transform().matrix();
  }
  updateFont(
    size: number = 14,
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

  scalePixelToGLClip(p: Point) {
    return new Point(
      p.x / this.drawContext2D.canvas.offsetWidth * 2,
      p.y / this.drawContext2D.canvas.offsetHeight * 2,
    );
  }
  scaleGLClipToElementSpaces(p: Point) {
    return new Point(
      p.x / this.lastDrawTransformMatrix[0],
      p.y / this.lastDrawTransformMatrix[4],
    );
  }

  getFontSizeInPixels() {
    // console.log(this.drawContext2D.canvas.offsetWidth, this.drawContext2D.canvas.offsetHeight)
    const onePixelInGLSpace = this.scalePixelToGLClip(new Point(1, 1));
    // console.log(onePixelInGLSpace)
    const onePixelInElementSpace = this.scaleGLClipToElementSpaces(onePixelInGLSpace);
    // console.log(onePixelInElementSpace)
    const elementSpaceFontSize = this.fontSize;
    const pixelSpaceFontSize = elementSpaceFontSize / onePixelInElementSpace.y;
    return pixelSpaceFontSize;
  }

  getFontDimensionInElementSpace(pixelSpaceFontSize, scalingFactor) {
    // const onePixelInGLSpace = this.scalePixelToGLClip(new Point(1, 1));
    // const onePixelInElementSpace = this.scaleGLClipToElementSpaces(onePixelInGLSpace);
    // console.log("one Pixel in element space:", onePixelInElementSpace)
    // console.log("pixel space font size:", pixelSpaceFontSize)
    // const elementSpaceFontSize = pixelSpaceFontSize / onePixelInElementSpace.y / scalingFactor;
    // console.log("element space font size:", elementSpaceFontSize)
    // return elementSpaceFontSize;
    
  }
  // To Draw text:
  //  - convert ctx to gl clip space
  //  - convert gl clip space to diagram space
  //  - draw text using diagram coordinate locations
  // Text size is defined in pixels in the original pixel space
  // Therefore to define text size in diagram space, need to"
  //  - convert diagram space size to gl clip space size
  //  - convert gl clip space size to pixel space size
  // OR
  //  - take one pixel, convert it => gl clip space => diagram space
  //  - see the scale difference in diagram space and apply it to pixel space
  // 
  // However, the 
  drawWithTransformMatrix(
    transformMatrix: Array<number>,
    count: number,
    color: Array<number>,
  ) {
    const { ctx } = this.drawContext2D;
    const scalingFactor = this.drawContext2D.canvas.offsetWidth / this.fontSize;
    
    // ctx.font = `${this.fontStyle} ${this.fontWeight} 29.4px ${this.fontFamily}`;
    // ctx.textAlign = this.align[0];    // eslint-disable-line
    // ctx.textBaseline = this.align[1]; // eslint-disable-line
    // ctx.fillText("test", 300, 200);
    // ctx.font = `${this.fontStyle} ${this.fontWeight} ${this.fontSize * scalingFactor}px ${this.fontFamily}`;
    // ctx.textAlign = this.align[0];    // eslint-disable-line
    // ctx.textBaseline = this.align[1]; // eslint-disable-line
    this.setFont(scalingFactor);
    // console.log("Font Size", this.getFontSizeInPixels(), this.lastDrawTransformMatrix)
    ctx.fillStyle = `rgba(
      ${Math.floor(color[0] * 255)},
      ${Math.floor(color[1] * 255)},
      ${Math.floor(color[2] * 255)},
      ${Math.floor(color[3] * 255)})`;

    ctx.save();

    // First convert pixel space to gl clip space (-1 to 1 for x, y)
    // Zoom in so limits betcome 0 to 2:
    const sx = this.drawContext2D.canvas.offsetWidth / 2 / scalingFactor;
    const sy = this.drawContext2D.canvas.offsetHeight / 2 / scalingFactor;
    // Translate so limits become -1 to 1
    const tx = this.drawContext2D.canvas.offsetWidth / 2;
    const ty = this.drawContext2D.canvas.offsetHeight / 2;
    // ctx.transform(sx, 0, 0, sy, tx, ty);
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
    this.lastDrawTransformMatrix = t;
    t[5] *= -scalingFactor;
    t[2] *= scalingFactor;
    // ctx.transform(t[0], t[3], t[1], t[4], t[2] * scalingFactor, -t[5] * scalingFactor);

    const totalT = m2.mul([sx, 0, tx, 0, sy, ty, 0, 0, 1], t);
    ctx.transform(totalT[0], totalT[3], totalT[1], totalT[4], totalT[2], totalT[5])

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

  pixelToClip(p: Point) {
    const x = p.x / this.drawContext2D.canvas.offsetWidth *
              this.diagramLimits.width + this.diagramLimits.left;
    const y = p.y / this.drawContext2D.canvas.offsetHeight *
              this.diagramLimits.height + this.diagramLimits.bottom;
    return new Point(x, y);
  }

  scalePixelToClip(p: Point) {
    const x = p.x / this.drawContext2D.canvas.offsetWidth *
              this.diagramLimits.width;
    const y = p.y / this.drawContext2D.canvas.offsetHeight *
              this.diagramLimits.height;
    return new Point(x, y);
  }

  scalePixelToVertex(p: Point, scalingFactor: number) {
    const x = p.x / this.drawContext2D.canvas.offsetWidth * 2;
    const y = p.y / this.drawContext2D.canvas.offsetHeight * 2;
    // const tx = this.drawContext2D.canvas.offsetWidth / 2;
    // const ty = this.drawContext2D.canvas.offsetHeight / 2;
    return new Point(x, y);
  }

  vertexToClip(vertex: Point) {
    const scaleX = this.diagramLimits.width / 2;
    const scaleY = this.diagramLimits.height / 2;
    const biasX = -(-this.diagramLimits.width / 2 - this.diagramLimits.left);
    const biasY = -(this.diagramLimits.height / 2 - this.diagramLimits.top);
    const transform = new Transform().scale(scaleX, scaleY).translate(biasX, biasY);
    return vertex.transformBy(this.lastDrawTransformMatrix)
      .transformBy(transform.matrix());
  }

  setFont(scalingFactor: number = 1) {
    const { ctx } = this.drawContext2D;
    ctx.font = `${this.fontStyle} ${this.fontWeight} ${this.fontSize * scalingFactor}px ${this.fontFamily}`;
    ctx.textAlign = this.align[0];    // eslint-disable-line
    ctx.textBaseline = this.align[1]; // eslint-disable-line
  }

  calcBorder(text: DiagramText) {
    // const { ctx } = this.drawContext2D;
    // const scalingFactor = this.drawContext2D.canvas.offsetWidth / this.fontSize;
    const scalingFactor = this.drawContext2D.canvas.offsetWidth / this.fontSize;
    this.setFont(scalingFactor);

    // get the text measurement
    const textMetrics = this.drawContext2D.ctx.measureText(text.text);
    const box = [
      new Point(
        -textMetrics.actualBoundingBoxLeft,
        textMetrics.actualBoundingBoxAscent,
      ),
      new Point(
        textMetrics.actualBoundingBoxRight,
        textMetrics.actualBoundingBoxAscent,
      ),
      new Point(
        textMetrics.actualBoundingBoxRight,
        -textMetrics.actualBoundingBoxDescent,
      ),
      new Point(
        -textMetrics.actualBoundingBoxLeft,
        -textMetrics.actualBoundingBoxDescent,
      ),
    ];
    // First convert pixel space to gl clip space (-1 to 1 for x, y)
    // Zoom in so limits betcome 0 to 2:
    const sx = this.drawContext2D.canvas.offsetWidth / 2 / scalingFactor;
    const sy = this.drawContext2D.canvas.offsetHeight / 2 / scalingFactor;
    // const tx = this.drawContext2D.canvas.offsetWidth / 2;
    // const ty = this.drawContext2D.canvas.offsetHeight / 2;
    const tx = 0;
    const ty = 0;
    const t1 = [sx, 0, tx, 0, sy, ty, 0, 0, 1];
    const t2 = this.lastDrawTransformMatrix;

    // t[0] *= sx;
    // t[4] *= sy;
    t2[1] *= -1;
    t2[3] *= -1;
    // t2[2] *= scalingFactor;
    // t2[5] *= -scalingFactor;
    t2[5] *= -1;
    // t[2] = tx;
    // t[5] = ty;
    // console.log(t)
    const totalT = m2.mul(t1, t2);

    box.forEach((p, index) => {
      // console.log(p)
      // console.log("pixel", p.transformBy(t1))
      // console.log("pixel", p.transformBy(t2))
      // console.log(this.scalePixelToClip(p.transformBy(t1)));
      const newP = this.scalePixelToClip(p.transformBy(totalT)).add(new Point(
        text.location.x,
        text.location.y,
      ));

      box[index] = new Point(newP.x, newP.y);
      console.log("box corner", box[index])
    });
    // console.log("box", box);
    // ctx.transform(sx, 0, 0, sy, tx, ty);

    // // Transform clip space to diagram space
    // const t = transformMatrix;
    // this.lastDrawTransformMatrix = t;
    // ctx.transform(t[0], t[3], t[1], t[4], t[2] * scalingFactor, -t[5] * scalingFactor);


    // const left = leftTop.x;
    // const top = leftTop.y;
    // const right = rightBottom.x;
    // const bottom = rightBottom.y;

    // const clipLeftTop = this.scalePixelToVertex(leftTop, scalingFactor);
    // const clipRightBottom = this.scalePixelToVertex(rightBottom, scalingFactor);
    // const vertexTextPoint = text.location;
    // const width = clipLeftTop.x + clipRightBottom.x;
    // const height = clipLeftTop.y + clipRightBottom.y;

    // const border = [];
    // border.push(vertexTextPoint.sub(clipLeftTop));
    // border.push(border[0].add(new Point(width, 0)));
    // border.push(border[1].add(new Point(0, height)));
    // border.push(border[2].add(new Point(-width, 0)));
    // border.push(border[0]);

    // const newBorder = [];
    // border.forEach((p) => {
    //   const newP = p.transformBy(this.lastDrawTransformMatrix);
    //   newBorder.push(new Point(newP.x, newP.y));
    //   // newBorder.push(p.transformBy(this.lastDrawTransformMatrix));
    // });
    // console.log(newBorder)
    // console.log(scalingFactor)
    // console.log(left, top, right, bottom);
    // console.log(clipLeftTop, clipRightBottom);
    // console.log(`${this.fontStyle} ${this.fontWeight} ${this.fontSize * scalingFactor}px ${this.fontFamily}`)
    // console.log(textMetrics)
    // console.log(leftTop)
    // console.log(clipLeftTop)
    // console.log("font width", this.getFontDimensionInElementSpace(right, scalingFactor))
    // console.log(clipTextPoint)
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
