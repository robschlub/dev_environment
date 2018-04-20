
class DrawContext2D {
  constructor(width, height) {
    this.ratio = 2;
    this.canvas = {
      width: width * this.ratio,
      height: height * this.ratio,
      style: {
        width: `${width}px`,
        height: `${height}px`,
      },
    };
    this.ctx = {
      scale: () => {},
      font: () => {},
      textAlign: () => {},
      textBaseline: () => {},
      measureText: () => {
        return {
          actualBoundingBoxLeft: 10,
          actualBoundingBoxAscent: 10,
          actualBoundingBoxRight: 10,
          actualBoundingBoxDescent: 10,
        };
      },
    };
  }
}

export default DrawContext2D;

//     }
//   }
//   canvas: {
//     width = 
//   }
//   locations: {
//     a_position: '',
//   },
//   gl: {
//     TRIANGLES: 1,
//     TRIANGLE_STRIP: 2,
//     createBuffer: () => {},
//     bindBuffer: () => {},
//     bufferData: () => {},
//     enableVertexAttribArray: () => {},
//     vertexAttribPointer: () => {},
//     uniformMatrix3fv: () => {},
//     uniform4f: () => {},
//     drawArrays: () => {},
//     clearColor: () => {},
//     clear: () => {},
//   },
// };

// export default webgl;
