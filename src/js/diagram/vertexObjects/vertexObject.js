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
  // function PolygonFilled(webgl, radius, numSides, numSidesToDraw, rotation, center) {
  //   VertexObject.call(this, webgl);
    
  //   this.glPrimative = webgl.gl.TRIANGLE_FAN;

  //   this.points = [center.x, center.y];
  //   this.dAngle = 0;  
  //   this.radius = radius;
  //   this.center = center;

  //   if (numSides < 3) {
  //     this.dAngle = Math.PI/numSides;
  //   }
  //   else {
  //     this.dAngle = Math.PI*2.0/numSides;
  //   }
  //   let i;
  //   let j=2, b=0;

  //   // Make the encapsulating border
  //   if (numSidesToDraw < numSides) {
  //     this.border[0].push(center.copy());
  //     b = 1;
  //   }
  //   for (i = 0; i<numSidesToDraw+1; i++) {
  //     this.points[j] =   center.x + radius * Math.cos(i*this.dAngle+rotation);
  //     this.points[j+1] = center.y + radius * Math.sin(i*this.dAngle+rotation);
  //     this.border[0].push(g2.point(this.points[j], this.points[j+1]));
  //     b+=1;
  //     j=j+2;
  //   }
  //   if (numSidesToDraw < numSides) {
  //     this.border[0].push(center.copy());
  //   }

  //   this.setupBuffer();
  // }
  // PolygonFilled.prototype = Object.create(VertexObject.prototype);
  // PolygonFilled.prototype.drawToAngle = function (offset,rotate, scale, drawAngle, color) {
  //   let count = Math.floor(drawAngle / this.dAngle)*2.0 + 2;
  //   if (drawAngle >= Math.PI*2.0)
  //     count = this.numPoints;
  //   this.draw(this,offset, rotate, scale, count, color);
  // }
  // PolygonFilled.prototype.getPointCountForAngle = function(drawAngle) {
  //   let count = Math.floor(drawAngle / this.dAngle) + 1;
  //   if (drawAngle >= Math.PI*2.0) {
  //     count = this.numPoints;
  //   }
  //   return count;
  // }

  // function simpleIntersect(p1, p2, q1, q2) {
  //   let lineP = g2.line(p1, p2);
  //   let lineQ = g2.line(q1, q2);
  //   return lineP.intersectsWith(lineQ).intersect;
  // }
  // function polyLineTriangles(coords, close, width) {
  //   let points = [];
  //   let innerBorder = [];
  //   let outerBorder = [];
  //   let line1Pairs = [];
  //   let line2Pairs = [];
  //   let halfWidth = width/2;

  //   let p,q;
  //   if (close) {
  //     coords.push(coords[0]);
  //   }

  //   for (i=1;i<coords.length;++i) {
  //     p = coords[i-1];
  //     q = coords[i];
  //     let angle = Math.atan2(q.y-p.y,q.x-p.x);
  //     let offset1 = g2.point(halfWidth*Math.cos(angle+Math.PI/2),halfWidth*Math.sin(angle+Math.PI/2));
  //     let offset2 = g2.point(halfWidth*Math.cos(angle-Math.PI/2),halfWidth*Math.sin(angle-Math.PI/2));
  //     line1Pairs.push([p.add(offset1), q.add(offset1)]);
  //     line2Pairs.push([p.add(offset2), q.add(offset2)]);
  //   }

  //   if (close) {
  //     p = simpleIntersect(line1Pairs[0][0], line1Pairs[0][1], line1Pairs[line1Pairs.length-1][0],line1Pairs[line1Pairs.length-1][1]);
  //     q = simpleIntersect(line2Pairs[0][0], line2Pairs[0][1], line2Pairs[line1Pairs.length-1][0],line2Pairs[line2Pairs.length-1][1]);
  //   }
  //   else {
  //     p = line1Pairs[0][0];
  //     q = line2Pairs[0][0];
  //   }
  //   innerBorder.push(p.copy());
  //   outerBorder.push(q.copy());
  //   for (i=1;i<line1Pairs.length;++i) {
  //     points.push(p.x);
  //     points.push(p.y);
  //     points.push(q.x);
  //     points.push(q.y);
  //     // console.log(line1Pairs[i-1],line1Pairs[i],simpleIntersect(line1Pairs[i-1][0],line1Pairs[i-1][1], line1Pairs[i][0], line1Pairs[i][1]))
  //     p = simpleIntersect(line1Pairs[i-1][0],line1Pairs[i-1][1], line1Pairs[i][0], line1Pairs[i][1]);
  //     q = simpleIntersect(line2Pairs[i-1][0],line2Pairs[i-1][1], line2Pairs[i][0], line2Pairs[i][1]);
  //     // console.log(line2Pairs[i-1][0],line2Pairs[i-1][1], line2Pairs[i][0], line2Pairs[i][1])
  //     // console.log(q)
  //     // if (q == undefined) {
  //     //   debugger;
  //     // }
  //     innerBorder.push(p.copy());
  //     outerBorder.push(q.copy());
  //     points.push(q.x);
  //     points.push(q.y);
  //     points.push(points[points.length-6]);
  //     points.push(points[points.length-6]);
  //     points.push(q.x);
  //     points.push(q.y);
  //     points.push(p.x);
  //     points.push(p.y);
  //   }
  //   let endp, endq;
  //   if (!close) {
  //     endp = line1Pairs[line1Pairs.length-1][1];
  //     endq = line2Pairs[line2Pairs.length-1][1];
  //   }
  //   else {
  //     endp = g2.point(points[0],points[1]);
  //     endq = g2.point(points[2],points[3]);
  //   }
  //   points.push(p.x);
  //   points.push(p.y);
  //   points.push(q.x);
  //   points.push(q.y);
  //   points.push(endq.x);
  //   points.push(endq.y);
  //   points.push(p.x);
  //   points.push(p.y);
  //   points.push(endq.x);
  //   points.push(endq.y);
  //   points.push(endp.x);
  //   points.push(endp.y);
  //   innerBorder.push(endp.copy());
  //   outerBorder.push(endq.copy());

  //   if (close) {
  //     coords.pop();
  //   }
  //   let border = [];
  //   if (!close){
  //      border.push(innerBorder[0]);
  //   }
  //   for (let i=0; i<outerBorder.length; ++i) {
  //     border.push(outerBorder[i]);
  //   }
  //   if (!close){
  //     for (let i=innerBorder.length-1;i>=0;--i) {
  //       border.push(innerBorder[i]);
  //     }
  //   }
  //   return {
  //     points: points, 
  //     border: border,
  //   }
  // }
  // function cornerLength(coords, length, forceLength = true) {
  //   let center = coords[1];
  //   let ends = [coords[0], coords[2]];
  //   let angle, delta;
  //   let points = [];
  //   for (let i=0;i<2;++i) {
  //     delta = ends[i].sub(center);//g2.point(ends[i].x-center.x, ends[i].y-center.y);
  //     angle = Math.atan2(delta.y, delta.x);
  //     endLength = Math.sqrt(delta.x*delta.x + delta.y*delta.y);
  //     if (length < endLength || forceLength) {
  //       endLength = length;
  //     }
  //     points.push(g2.point(endLength*Math.cos(angle)+center.x,endLength*Math.sin(angle)+center.y));
  //   }
  //   points.push(points[1].copy());
  //   points[1] = center.copy();
  //   return points;
  // }
  // function Corner(webgl, coords, close, length, width) {
  //   VertexObject.call(this, webgl);
  //   // let tempBorder = [];
  //   let newCoords = coords;
  //   if (close){
  //     newCoords.push(coords[0]);
  //     newCoords.push(coords[1]);
  //   }
  //   for (let i=1,j=newCoords.length-1;i<j;++i) {
  //     let cornerPoints = cornerLength([newCoords[i-1],newCoords[i],newCoords[i+1]],length, true);
  //     let cornerTriangles = polyLineTriangles(cornerPoints, false, width)
  //     for (let k=0,m=cornerTriangles.points.length;k<m;++k){
  //       this.points.push(cornerTriangles.points[k]);
  //     }
  //     this.border[i-1] = [];
  //     for (let k=0,m=cornerTriangles.border.length;k<m;++k){
  //       this.border[i-1].push(cornerTriangles.border[k]);
  //     }
  //   }
  //   this.setupBuffer()
  // }
  // Corner.prototype = Object.create(VertexObject.prototype);
  

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