export class Point2D {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  distance(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  equals(other) {
    return this.x === other.x && this.y === other.y;
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }

  clone() {
    return new Point2D(this.x, this.y);
  }

  set(x, y) {
    this.x = x;
    this.y = y;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }
}
