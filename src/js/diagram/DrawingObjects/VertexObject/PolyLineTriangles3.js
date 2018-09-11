// @flow
import {
  Point, Line, polarToRect, minAngleDiff,
} from '../../tools/g2';


function simpleIntersect(p1: Point, p2: Point, q1: Point, q2: Point) {
  const lineP = new Line(p1, p2);
  const lineQ = new Line(q1, q2);
  return lineP.intersectsWith(lineQ).intersect;
}

// Generate a thick line assuming gl.TRIANGLES where corners are sharp.
// Input:
//   * coords: an array of points that will define the center of the line
export default function polyLineTriangles3(coords: Array<Point>, close: boolean, width: number) {
  const points = [];
  const border1 = [];
  const border2 = [];
  const angleDir = [];
  const cornerAngle = [];
  // const cornerAngleDelta = [];
  const preLineAngle = [];
  const preLineLength = [];
  const postLineLength = [];

  function calcAngleDir(
    pre: Point,
    mid: Point,
    post: Point,
  ) {
    const midPost = post.sub(mid).toPolar();
    const midPre = pre.sub(mid).toPolar();
    const minAngle = minAngleDiff(midPost.angle, midPre.angle);
    let direction = Math.sin(minAngle);
    if (direction < 0) {
      direction = -1;
    } else if (direction > 0) {
      direction = 1;
    }
    const midPostUnit = polarToRect(1, midPost.angle);
    const midPreUnit = polarToRect(1, midPre.angle);
    const innerAngle = midPostUnit.add(midPreUnit).toPolar().angle || 0.00001;
    const innerAngleDelta = midPre.angle + minAngle / 2 * direction;
    angleDir.push(direction);
    cornerAngle.push(innerAngle);
    // cornerAngleDelta.push(innerAngleDelta);
    preLineAngle.push(midPre.angle);
    preLineLength.push(midPre.mag);
    postLineLength.push(midPost.mag);
  }
  if (close) {
    calcAngleDir(coords[coords.length - 1], coords[0], coords[1]);
  } else {
    angleDir.push(0);
  }

  for (let i = 1; i < coords.length - 1; i += 1) {
    calcAngleDir(coords[i - 1], coords[i], coords[i + 1]);
  }

  if (close) {
    calcAngleDir(coords[coords.length - 2], coords[coords.length - 1], coords[0]);
  } else {
    angleDir.push(0);
  }

  console.log("Direction", angleDir)
  console.log("PreLine Angle", preLineAngle.map(a => a * 180 / Math.PI))
  console.log("InnerAngle", cornerAngle.map(a => a * 180 / Math.PI))
  // console.log(preLineLength)
  // got through the points that define the outside border of the line, and generate
  // offset lines on one side of them (named Line1 and Line2).
  function findCornerPointsConstantCornerWidth(
    pre: Point | null,
    mid: Point,
    post: Point | null,
  ) {
    let innerAngle = 0;
    let direction = 0;
    if (pre != null && post != null) {
      const midPost = post.sub(mid).toPolar();
      const midPre = pre.sub(mid).toPolar();
      const midPostUnit = polarToRect(1, midPost.angle);
      const midPreUnit = polarToRect(1, midPre.angle);
      innerAngle = midPostUnit.add(midPreUnit).toPolar().angle || 0.00001;
      direction = Math.sin(midPost.angle - midPre.angle);
    } else if (pre == null && post != null) {
      const midPost = post.sub(mid).toPolar();
      innerAngle = midPost.angle - Math.PI / 2;
      direction = -1;
    } else if (post == null && pre != null) {
      const midPre = pre.sub(mid).toPolar();
      innerAngle = midPre.angle - Math.PI / 2;
      direction = 1;
    }

    let corner1 = polarToRect(width / 2, innerAngle).add(mid);
    let corner2 = polarToRect(width / 2, innerAngle + Math.PI).add(mid);
    if (direction < 0) {
      corner2 = polarToRect(width / 2, innerAngle).add(mid);
      corner1 = polarToRect(width / 2, innerAngle + Math.PI).add(mid);
    }
    border1.push(corner1);
    border2.push(corner2);
  }

  function findCornerPointsConstantBorderWidth(
    pre: Point | null,
    mid: Point,
    post: Point | null,
  ) {
    let innerAngle = 0;
    let cornerR = width / 2;
    let direction = 0;
    if (pre != null && post != null) {
      const midPost = post.sub(mid).toPolar();
      const midPre = pre.sub(mid).toPolar();
      const midPostUnit = polarToRect(1, midPost.angle);
      const midPreUnit = polarToRect(1, midPre.angle);
      innerAngle = midPostUnit.add(midPreUnit).toPolar().angle || 0.00001;
      cornerR = Math.abs(width / 2 / Math.sin(innerAngle - midPost.angle));
      direction = Math.sin(midPost.angle - midPre.angle);
    } else if (pre == null && post != null) {
      const midPost = post.sub(mid).toPolar();
      innerAngle = midPost.angle - Math.PI / 2;
      cornerR = Math.abs(width / 2 / Math.sin(innerAngle - midPost.angle));
      direction = -1;
    } else if (post == null && pre != null) {
      const midPre = pre.sub(mid).toPolar();
      innerAngle = midPre.angle - Math.PI / 2;
      cornerR = Math.abs(width / 2 / Math.sin(innerAngle - midPre.angle));
      direction = 1;
    }
    let corner1 = polarToRect(cornerR, innerAngle).add(mid);
    let corner2 = polarToRect(cornerR, innerAngle + Math.PI).add(mid);
    if (direction < 0) {
      corner2 = polarToRect(cornerR, innerAngle).add(mid);
      corner1 = polarToRect(cornerR, innerAngle + Math.PI).add(mid);
    }
    border1.push(corner1);
    border2.push(corner2);
  }

  function findCornerPoints(
    preIndex: number | null,
    midIndex: number,
    postIndex: number | null,
  ) {
    // let innerAngle = 0;
    // let cornerR = width / 2;
    // let direction = 0;
    let corner1;
    let corner2;
    if (preIndex != null && postIndex != null) {
      const mid = coords[midIndex];
      const dir = angleDir[midIndex];
      const vertex = mid;
      const preDir = angleDir[preIndex];
      let borderAngle = preLineAngle[midIndex];
      if (preDir !== dir) {
        const midToBorderAngleDelta = Math.asin(width / preLineLength[midIndex]);
        borderAngle -= dir * midToBorderAngleDelta;
        console.log(midToBorderAngleDelta * 180 / Math.PI)
      }
      console.log(
        midIndex,
        borderAngle * 180 / Math.PI)
      // At this point, we know the border will go through mid,
      // and have an angle of borderAngle
      const cornerWidth = Math.min(
        Math.abs(width / Math.sin(cornerAngle[midIndex] - borderAngle)),
        preLineLength[midIndex],
        postLineLength[midIndex],
      );

      const innerCorner = polarToRect(cornerWidth, cornerAngle[midIndex]).add(mid);

      if (dir === 1) {
        corner1 = (vertex);
        corner2 = (innerCorner);
      } else {
        corner1 = (innerCorner);
        corner2 = (vertex);
      }
    }
    // else if (preIndex == null && postIndex != null) {
    //   const dir = angleDir[postIndex];
    //   if (dir === 1) {
    //     corner1 = (vertex);
    //     corner2 = (innerCorner);
    //   } else {
    //     corner1 = (innerCorner);
    //     corner2 = (vertex);
    //   }
    // } else if (post == null && pre != null) {
    //   const midPre = pre.sub(mid).toPolar();
    //   innerAngle = midPre.angle - Math.PI / 2;
    //   cornerR = Math.abs(width / Math.sin(innerAngle - midPre.angle));
    //   cornerR = Math.min(cornerR, midPre.mag);
    //   direction = 1;
    // }
    // let corner1 = polarToRect(cornerR, innerAngle).add(mid);
    // let corner2 = polarToRect(0, innerAngle + Math.PI).add(mid);
    // if (direction < 0) {
    //   corner2 = polarToRect(cornerR, innerAngle).add(mid);
    //   corner1 = polarToRect(0, innerAngle + Math.PI).add(mid);
    // }
    // const corner1 = polarToRect(cornerR, innerAngle).add(mid);
    // const corner2 = polarToRect(0, innerAngle + Math.PI).add(mid);
    border1.push(corner1);
    border2.push(corner2);
    // angleDir.push(direction);
  }

  if (close) {
    findCornerPoints(coords.length - 1, 0, 1);
  } else {
    findCornerPoints(null, 0, 1);
  }

  for (let i = 1; i < coords.length - 1; i += 1) {
    findCornerPoints(i - 1, i, i + 1);
  }

  if (close) {
    findCornerPoints(coords.length - 2, coords.length - 1, 0);
  } else {
    findCornerPoints(coords.length - 2, coords.length - 1, null);
  }

  const addTriangles = (i1, i2) => {
    points.push(border1[i1].x);
    points.push(border1[i1].y);

    points.push(border2[i1].x);
    points.push(border2[i1].y);

    points.push(border2[i2].x);
    points.push(border2[i2].y);

    points.push(border1[i1].x);
    points.push(border1[i1].y);

    points.push(border2[i2].x);
    points.push(border2[i2].y);

    points.push(border1[i2].x);
    points.push(border1[i2].y);
  };

  for (let i = 0; i < coords.length - 1; i += 1) {
    addTriangles(i, i + 1);
  }

  if (close) {
    addTriangles(coords.length - 1, 0);
  }
  // // If the line closes on itself, then find the intersection point of
  // // the first and last offset lines.
  // // p and q will represent the first points of offset lines 1 and 2.
  // if (close) {
  //   // intersection point of first and last offset 1 lines
  //   p = simpleIntersect(
  //     line1Pairs[0][0],
  //     line1Pairs[0][1],
  //     line1Pairs[line1Pairs.length - 1][0],
  //     line1Pairs[line1Pairs.length - 1][1],
  //   );
  //   // intersection point of first and last offset 2 lines
  //   q = simpleIntersect(
  //     line2Pairs[0][0],
  //     line2Pairs[0][1],
  //     line2Pairs[line1Pairs.length - 1][0],
  //     line2Pairs[line2Pairs.length - 1][1],
  //   );
  // } else {
  //   // if not closing on itself, then the first point is simply the first
  //   // point of the offset lines.
  //   p = line1Pairs[0][0];   // eslint-disable-line prefer-destructuring
  //   q = line2Pairs[0][0];   // eslint-disable-line prefer-destructuring
  // }
  // // The line effectively has two borders (named an inside and outside border)
  // // but the inner border isn't necessarily the INSIDE border, it is just a
  // // name.
  // // p and q are the first points of the borders.
  // innerBorder.push(p._dup());
  // outerBorder.push(q._dup());

  // // Go through all offset lines, calculate their intersection points
  // // and from them calculate the triangle and border points.
  // for (let i = 1; i < line1Pairs.length; i += 1) {
  //   // First two points of the Triangle 1 are the two ending points
  //   // of the last line segment
  //   points.push(p.x);
  //   points.push(p.y);
  //   points.push(q.x);
  //   points.push(q.y);

  //   // Next points are the intersection between the first line and the second line
  //   p = simpleIntersect(
  //     line1Pairs[i - 1][0],
  //     line1Pairs[i - 1][1],
  //     line1Pairs[i][0],
  //     line1Pairs[i][1],
  //   );
  //   q = simpleIntersect(
  //     line2Pairs[i - 1][0],
  //     line2Pairs[i - 1][1],
  //     line2Pairs[i][0],
  //     line2Pairs[i][1],
  //   );

  //   // Push the next points to the border
  //   innerBorder.push(p._dup());
  //   outerBorder.push(q._dup());

  //   // Finish triangle 1
  //   points.push(q.x);
  //   points.push(q.y);

  //   // Make triangle 2
  //   points.push(points[points.length - 6]);
  //   points.push(points[points.length - 6]);
  //   points.push(q.x);
  //   points.push(q.y);
  //   points.push(p.x);
  //   points.push(p.y);
  // }


  // // Calculate the last end points
  // let endp;
  // let endq;

  // // In not closing the polyline, the end points are just the last offset
  // // line points
  // if (!close) {
  //   endp = line1Pairs[line1Pairs.length - 1][1]; // eslint-disable-line prefer-destructuring
  //   endq = line2Pairs[line2Pairs.length - 1][1]; // eslint-disable-line prefer-destructuring
  // // If closing the polyline, then the end points are the start points
  // } else {
  //   endp = new Point(points[0], points[1]);
  //   endq = new Point(points[2], points[3]);
  // }
  // // Close out the last two triangles
  // points.push(p.x);             // Last two points of last line segment
  // points.push(p.y);
  // points.push(q.x);
  // points.push(q.y);
  // points.push(endq.x);
  // points.push(endq.y);
  // points.push(p.x);             // Last triangle
  // points.push(p.y);
  // points.push(endq.x);
  // points.push(endq.y);
  // points.push(endp.x);
  // points.push(endp.y);
  // innerBorder.push(endp._dup());
  // outerBorder.push(endq._dup());

  // // If closing, then remove the last duplicate coord as it was added by this
  // // function
  // if (close) {
  //   coords.pop();
  // }

  // function makeOuter(
  //   midPre: Point,
  //   mid: Point,
  //   midPost: Point,
  //   midIndex: number,
  // ) {
  //   const i = midIndex;
  //   const n = i * 12;
  //   const midAngle = threePointAngle(midPre, mid, midPost);
  //   const innerAngle = threePointAngle(midPre, innerBorder[i], midPost);
  //   const outerAngle = threePointAngle(midPre, outerBorder[i], midPost);
  //   const replace = (index, replacementPoint) => {
  //     let normIndex = index;
  //     if (index < 0) {
  //       normIndex += points.length;
  //     }
  //     if (index > points.length - 1) {
  //       normIndex -= points.length;
  //     }
  //     points[normIndex] = replacementPoint.x;
  //     points[normIndex + 1] = replacementPoint.y;
  //   };

  //   const minDistance = Math.min(distance(midPre, mid), distance(midPost, mid));
  //   let newInnerBorder;
  //   let newOuterBorder;
  //   if (innerAngle < midAngle || innerAngle === midAngle) {
  //     newInnerBorder = mid;
  //   }
  //   if (outerAngle < midAngle || outerAngle === midAngle) {
  //     newOuterBorder = mid;
  //   }
  //   if (newOuterBorder) {
  //     replace(n - 4 * 2, newOuterBorder);
  //     replace(n - 2 * 2, newOuterBorder);
  //     replace(n + 1 * 2, newOuterBorder);
  //     outerBorder[i] = newOuterBorder;
  //   }

  //   if (newInnerBorder) {
  //     replace(n - 1 * 2, newInnerBorder);
  //     replace(n, newInnerBorder);
  //     replace(n + 3 * 2, newInnerBorder);
  //     innerBorder[i] = newInnerBorder;
  //   }

  //   let midToBorderVector = innerBorder[i].sub(mid).toPolar();
  //   if (midToBorderVector.mag > minDistance) {
  //     newInnerBorder = mid.add(new Point(
  //       minDistance * Math.cos(midToBorderVector.angle),
  //       minDistance * Math.sin(midToBorderVector.angle),
  //     ));
  //   }

  //   midToBorderVector = outerBorder[i].sub(mid).toPolar();
  //   if (midToBorderVector.mag > minDistance) {
  //     newOuterBorder = mid.add(new Point(
  //       minDistance * Math.cos(midToBorderVector.angle),
  //       minDistance * Math.sin(midToBorderVector.angle),
  //     ));
  //   }

  //   if (newOuterBorder) {
  //     replace(n - 4 * 2, newOuterBorder);
  //     replace(n - 2 * 2, newOuterBorder);
  //     replace(n + 1 * 2, newOuterBorder);
  //     outerBorder[i] = newOuterBorder;
  //   }

  //   if (newInnerBorder) {
  //     replace(n - 1 * 2, newInnerBorder);
  //     replace(n, newInnerBorder);
  //     replace(n + 3 * 2, newInnerBorder);
  //     innerBorder[i] = newInnerBorder;
  //   }
  // }
  // for (let i = 1; i < coords.length - 1; i += 1) {
  //   makeOuter(coords[i - 1], coords[i], coords[i + 1], i);
  // }

  // if (close) {
  //   makeOuter(
  //     coords[line1Pairs.length - 2],
  //     coords[line1Pairs.length - 1],
  //     coords[0],
  //     line1Pairs.length - 1,
  //   );
  //   makeOuter(
  //     coords[line1Pairs.length - 1],
  //     coords[0],
  //     coords[1],
  //     0,
  //   );
  // }
  // // Form the border array
  let border = [];
  // console.log(innerBorder)
  // console.log(outerBorder)
  // If the poly line is closed, only one of the offset lines is the outside
  // border. If open, then both are the border.
  if (close) {
    if (border1[0].isInPolygon(border2)) {
      border = border2;
    } else {
      border = border1;
    }
  } else {
    border.push(border1[0]);
    for (let i = 0; i < border2.length; i += 1) {
      border.push(border2[i]);
    }
    for (let i = border1.length - 1; i >= 0; i -= 1) {
      border.push(border1[i]);
    }
  }


  return {
    points,
    border,
  };
}

// export default polyLineTriangles;
