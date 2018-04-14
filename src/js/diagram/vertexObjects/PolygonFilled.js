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
