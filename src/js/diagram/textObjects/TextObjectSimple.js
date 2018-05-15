// @flow

// import * as g2 from '../g2';
import * as m2 from '../tools/m2';
import { Point, Transform, Translation, Rect, Scale, Rotation } from '../tools/g2';
import DrawingObject from '../DrawingObject';
import DrawContext2D from '../DrawContext2D';
// import { roundNum } from './mathtools';

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
    color: Array<number> | null = null,
  ) {
    this.family = family;
    this.style = style;
    this.size = size;
    this.weight = weight;
    this.alignH = alignH;
    this.alignV = alignV;
    if (color !== null) {
      this.color = `rgba(
        ${Math.floor(color[0] * 255)},
        ${Math.floor(color[1] * 255)},
        ${Math.floor(color[2] * 255)},
        ${Math.floor(color[3] * 255)})`;
    }
  }
  set(ctx: CanvasRenderingContext2D, scalingFactor: number = 1) {
    ctx.font = `${this.style} ${this.weight} ${this.size * scalingFactor}px ${this.family}`;
    ctx.textAlign = this.alignH;
    ctx.textBaseline = this.alignV;
  }
}

class DiagramText {
  location: Point;
  text: string;
  font: DiagramFont;

  constructor(
    location: Point = new Point(0, 0),
    text: string = '',
    font: DiagramFont = new DiagramFont(),
  ) {
    this.location = location;
    this.text = text;
    this.font = font;
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
  align: Array<string>;

  // Text clip space (-1 to 1) without any upstream trasnform
  // Meaning if the diagram clip space is 0, 4, then the offset will be
  // doubled.
  fontFamily: string;
  fontWeight: string;
  fontSize: number;
  fontStyle: string;
  diagramLimits: Rect;
  lastDrawTransformMatrix: Array<number>;

  constructor(
    drawContext2D: DrawContext2D,
    text: Array<DiagramText>,
    // align: Array<string> = ['center', 'middle'],
    diagramLimits: Rect = new Rect(-1, -1, 2, 2),
  ) {
    super();
    this.drawContext2D = drawContext2D;
    this.text = text;
    // this.align = align;
    // this.fontFamily = 'Helvetica Neue';
    // this.fontWeight = '200';
    // this.fontSize = 0.5;
    // this.fontStyle = '';
    this.diagramLimits = diagramLimits;
    this.lastDrawTransformMatrix = new Transform().matrix();
  }
  // updateFont(
  //   size: number = 14,
  //   weight: string = '200',
  //   family: string = 'Helvetica Neue',
  // ) {
  //   this.fontFamily = family;
  //   this.fontWeight = weight;
  //   this.fontSize = size;
  // }
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
  // clipToElementPixels(clipPoint: Point) {
  //   // transforming -1 to 1 to canvas width
  //   const px = (clipPoint.x + 1) / 2 * this.drawContext2D.canvas.width / this.drawContext2D.ratio;
  //   const py = -(clipPoint.y - 1) / 2 * this.drawContext2D.canvas.height / this.drawContext2D.ratio;
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

  // Get the font size defined in Element Space in pixels
  getFontSizeInPixels() {
    const onePixelInGLSpace = this.scalePixelToGLClip(new Point(1, 1));
    const onePixelInElementSpace = this.scaleGLClipToElementSpaces(onePixelInGLSpace);
    const elementSpaceFontSize = this.fontSize;
    const pixelSpaceFontSize = elementSpaceFontSize / onePixelInElementSpace.y;
    return pixelSpaceFontSize;
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
    const scalingFactor = this.drawContext2D.canvas.offsetWidth / this.text[0].font.size;

    const parentColor = `rgba(
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

    // Transform clip space to diagram space
    const t = transformMatrix;
    this.lastDrawTransformMatrix = t;
    t[5] *= -scalingFactor;
    t[2] *= scalingFactor;

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
        diagramText.location.y * scalingFactor,
      );
    });
    ctx.restore();
  }


  scalePixelToClip(p: Point) {
    const x = p.x / this.drawContext2D.canvas.offsetWidth *
              this.diagramLimits.width;
    const y = p.y / this.drawContext2D.canvas.offsetHeight *
              this.diagramLimits.height;
    return new Point(x, y);
  }

  calcBorder(text: DiagramText) {
    // Calculate the scaling factor
    const scalingFactor = this.drawContext2D.canvas.offsetWidth / this.text[0].font.size;
    // Measure the text
    text.font.set(this.drawContext2D.ctx, scalingFactor);
    const textMetrics = this.drawContext2D.ctx.measureText(text.text);

    // Create a box around the text
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

    // First scale pixel space to gl clip space (-1 to 1 for x, y)
    //  - Scale only (and no translation) as box is relative to (0, 0)
    //  - Pixel Space Y axis stays inverted compared to GL space
    const sx = this.drawContext2D.canvas.offsetWidth / 2 / scalingFactor;
    const sy = this.drawContext2D.canvas.offsetHeight / 2 / scalingFactor;
    const tx = 0;
    const ty = 0;
    const t1 = [sx, 0, tx, 0, sy, ty, 0, 0, 1];

    // Convert to Element Space (Diagram Space is included in the last draw
    // transform matrix)
    // Note, rotations and y are negative in GL/Element space compared to pixel
    // space
    const t2 = this.lastDrawTransformMatrix;
    t2[1] *= -1;  // Rotation
    t2[3] *= -1;  // Rotation
    t2[5] *= -1;  // Y translation in GL space is -ve of pixel space

    // Final transform incorporating
    const totalT = m2.mul(t1, t2);

    box.forEach((p, index) => {
      const newP = this.scalePixelToClip(p.transformBy(totalT)).add(new Point(
        text.location.x,
        text.location.y,
      ));
      box[index] = new Point(newP.x, newP.y);
      console.log("box corner", box[index])
    });
  }
}

export { TextObjectSimple, DiagramText, DiagramFont };
// Transform -1 to 1 space to 0 to width/height space
