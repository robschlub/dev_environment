// @flow

// import * as g2 from '../g2';
import * as m2 from '../m2';
import WebGLInstance from '../webgl';
import * as g2 from '../g2';

// Base clase of all objects made from verteces for webgl.
// The job of a VertexObject is to:
//  - Havve the points of a object/shape
//  - Have the shape's border (used to determine whether a location is
//    within the shape)
//  - Setup the webgl buffer:
//      - Load vertices into a webgl buffer
//      - draw
class VertexObject {
  gl: WebGLRenderingContext;    // shortcut for the webgl context
  webgl: WebGLInstance;         // webgl instance for a html canvas
  glPrimative: number;          // primitive tyle (e.g. TRIANGLE_STRIP)
  buffer: WebGLBuffer;          // Vertex buffer

  points: Array<number>;        // Primative vertices of shape
  numPoints: number;            // Number of primative vertices
  border: Array<Array<g2.Point>>; // Border vertices

  constructor(webgl: WebGLInstance) {
    this.gl = webgl.gl;
    this.webgl = webgl;
    this.glPrimative = webgl.gl.TRIANGLES;
    this.points = [];
    this.border = [[]];
  }
  setupBuffer(numPoints: number = 0) {
    if (numPoints === 0) {
      this.numPoints = this.points.length / 2.0;
    } else {
      this.numPoints = numPoints;
    }
    // this.buffer = createBuffer(this.gl, this.vertices);
    this.buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.points), this.gl.STATIC_DRAW);
  }
  // Abstract method - should be reimplemented for any vertexObjects that
  getPointCountForAngle(drawAngle: number = Math.PI * 2) {
    return this.numPoints * drawAngle / (Math.PI * 2);
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
    // let scale2 = scale;
    // if (typeof scale2 != "object") {
    //   scale2 = point(scale, scale);
    // }

    const size = 2;         // 2 components per iteration
    const type = this.gl.FLOAT;   // the data is 32bit floats
    const normalize = false;    // don't normalize the data
    // 0 = move forward size * sizeof(type) each iteration to get
    // the next position
    const stride = 0;
    const offset = 0;       // start at the beginning of the buffer

    // Turn on the attribute
    this.gl.enableVertexAttribArray(this.webgl.locations.a_position);

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    this.gl.vertexAttribPointer(
      this.webgl.locations.a_position,
      size, type, normalize, stride, offset,
    );

    // let matrix = g2.identity();
    // // matrix = g2.translate(matrix, this.bias_offset.x, this.bias_offset.y);
    // // matrix = g2.scale(matrix, this.bias_scale.x, this.bias_scale.y);
    // matrix = g2.translate(matrix, translation.x, translation.y);
    // matrix = g2.rotate(matrix,rotation);
    // matrix = g2.scale(matrix,scale.x ,scale.y);

    this.gl.uniformMatrix3fv(
      this.webgl.locations.u_matrix,
      false,
      m2.t(transformMatrix),
    );  // Translate

    this.gl.uniform4f(
      this.webgl.locations.u_color,
      color[0], color[1], color[2], color[3],
    );  // Translate

    this.gl.drawArrays(this.glPrimative, offset, count);
  }
}

/* eslint-disable */

  // function PolyLine(webgl, coords, close, width) {
  //   VertexObject.call(this, webgl);
  //   // console.log(coords);

  //   let lineTriangles = polyLineTriangles(coords, close, width);
    
  //   this.points = lineTriangles.points;
  //   this.border[0] = lineTriangles.border;

  //   this.setupBuffer();
  // }
  // PolyLine.prototype = Object.create(VertexObject.prototype);

  // function ArrowHeadTriangle(webgl, tip, width, height, rotation=0) {
  //   VertexObject.call(this, webgl);
  //   // this.glPrimative = this.gl.TRIANGLE_FAN;

  //   this.height = height;
  //   // let tip = g2.point(0,0);
  //   this.points = [       0,    0,
  //              -width/2,  -height,
  //              +width/2,  -height];
  //   let i;
  //   for (i=0;i<this.points.length;i+=2) {
  //     let point = g2.point(this.points[i],this.points[i+1]);
  //     point = point.rotate(rotation);
  //     point = point.add(tip);
  //     this.points[i]  = point.x;
  //     this.points[i+1] = point.y;
  //     this.border[0].push(point);
  //   }
  //   this.border[0].push(this.border[0][0].copy());
  //   this.setupBuffer();
  // }
  // ArrowHeadTriangle.prototype = Object.create(VertexObject.prototype);

  // function Arrow(webgl, tip, width, legWidth, height, legHeight) {
  //   VertexObject.call(this, webgl);
  //   this.glPrimative = this.gl.TRIANGLE_FAN;

  //   this.height = height;
  //   let arrowHeight = height-legHeight;
  //   // let tip = g2.point(0,0);
  //   this.points = [       0,       0,
  //              -width/2,  -arrowHeight,
  //           -legWidth/2.0,  -arrowHeight,
  //           -legWidth/2.0,     -height,
  //           +legWidth/2.0,     -height,
  //           +legWidth/2.0,  -arrowHeight,
  //              +width/2,  -arrowHeight];
  //   let i;
  //   for (i=0;i<this.points.length;i+=2) {
  //     this.points[i] += tip.x;
  //     this.points[i+1] += tip.y;
  //     this.border[0].push(g2.point(this.points[i], this.points[i+1]));
  //   }
  //   this.border[0].push(this.border[0][0].copy());
  //   this.setupBuffer(7);
  // }
  // Arrow.prototype = Object.create(VertexObject.prototype);

  // function HorizontalLine(webgl, start, length, width) {
  //   VertexObject.call(this, webgl);
  //   this.glPrimative = this.gl.TRIANGLE_STRIP;

  //   let cx = start.x;
  //   let cy = start.y-width/2.0;
  //   this.start = start.copy();
  //   this.points = [cx, cy,
  //            cx, cy+width,
  //            cx+length, cy,
  //            cx+length, cy+width];
  //   for(let i=0; i<this.points.length; i+=2) {
  //     this.border[0].push(g2.point(this.points[i], this.points[i+1]));
  //   }
  //   this.border[0].push(this.border[0][0].copy());
  //   this.setupBuffer(4);
  // }
  // HorizontalLine.prototype = Object.create(VertexObject.prototype);

  // function RadialLines(webgl, innerRadius, outerRadius, width, dAngle, maxAngle) {
  //   VertexObject.call(this, webgl);
    
  //   this.innerRadius = innerRadius;
  //   this.outerRadius = outerRadius;
  //   this.dAngle = dAngle;
  //   this.maxAngle = maxAngle;
  //   let currentAngle = 0;
  //   let j = 0;
  //   let b = 0
  //   let referenceLine = [innerRadius,   -width/2.0,
  //             outerRadius, -width/2.0,
  //             outerRadius,  width/2.0,
  //             innerRadius,    -width/2.0,
  //             outerRadius,  width/2.0,
  //             innerRadius,     width/2.0];
  //   let rot;
  //   while (currentAngle <= maxAngle) {
  //     for (i=0;i<6;++i) {
  //       let newPoint = g2.point(referenceLine[i*2],referenceLine[i*2+1]).rotate(currentAngle);
  //       // let newPoint = rotate(new coord(referenceLine[i*2],referenceLine[i*2+1]), currentAngle);
  //       this.points[j++] = newPoint.x;
  //       this.points[j++] = newPoint.y;
  //     }
  //     let radialLineBorder = [g2.point(this.points[j-12], this.points[j-11]),
  //                 g2.point(this.points[j-10], this.points[j-9]),
  //                 g2.point(this.points[j-8], this.points[j-7]),
  //                 g2.point(this.points[j-2], this.points[j-1]),
  //                 g2.point(this.points[j-12], this.points[j-11])];
  //     this.border[b++] = radialLineBorder;
  //     currentAngle += dAngle;
  //   }
  //   this.setupBuffer();
  // }
  // RadialLines.prototype = Object.create(VertexObject.prototype);
  // RadialLines.prototype.drawToAngle = function(offset, rotate, scale, drawAngle, color) {
  //   let count = Math.floor(drawAngle / this.dAngle)*6.0+6.0;
  //   if (drawAngle >= this.maxAngle) {
  //     count = this.numPoints;
  //   }
  //   this.draw(this,offset, rotate, scale, count, color);
  // }
  // RadialLines.prototype.getPointCountForAngle = function(drawAngle) {
  //   let count = Math.floor(drawAngle / this.dAngle)*6.0 + 6;
  //   if (drawAngle >= Math.PI*2.0) {
  //     count = this.numPoints;
  //   }
  //   return count;
  // }

  

// return {
//   Polygon: Polygon,
//   PolygonFilled: PolygonFilled,
//   Corner: Corner,
//   PolyLine: PolyLine,
//   Arrow: Arrow,
//   HorizontalLine: HorizontalLine,
//   ArrowHeadTriangle: ArrowHeadTriangle,
//   RadialLines: RadialLines,
// }

export default VertexObject;

// exports.tools = tools;