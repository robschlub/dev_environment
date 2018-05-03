
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
      measureText: () => {    // eslint-disable-line arrow-body-style
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
