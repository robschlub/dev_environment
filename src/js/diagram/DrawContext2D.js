// @flow

class DrawContext2D {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  ratio: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');

    /* $FlowFixMe */
    const bsr = this.ctx.webkitBackingStorePixelRatio ||
              /* $FlowFixMe */
              this.ctx.mozBackingStorePixelRatio ||
              /* $FlowFixMe */
              this.ctx.msBackingStorePixelRatio ||
              /* $FlowFixMe */
              this.ctx.oBackingStorePixelRatio ||
              /* $FlowFixMe */
              this.ctx.backingStorePixelRatio || 1;

    let dpr = window.devicePixelRatio || 1;
    if (dpr === 1) {
      dpr = 2;
    }

    this.ratio = dpr / bsr;

    this.canvas.width = this.canvas.offsetWidth * this.ratio;
    this.canvas.height = this.canvas.offsetHeight * this.ratio;
    this.canvas.style.width = `${this.canvas.offsetWidth}px`;
    this.canvas.style.height = `${this.canvas.offsetHeight}px`;
    this.ctx.scale(this.ratio, this.ratio);
  }
}

export default DrawContext2D;
