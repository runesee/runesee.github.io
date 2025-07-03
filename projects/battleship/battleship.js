export class Battleship {
  constructor(length) {
    this.length = length;
    this.positions = [];
    this.shipArray = [];
    this.direction = "";
    for (let i = 0; i < length; i++) {
      this.shipArray[i] = "o";
    }
  }

  isWithinLength(length) {
    return length >= 2 && length <= 5;
  }

  getLength() {
    return this.length;
  }

  getShipArray() {
    return this.shipArray;
  }

  getStartPos() {
    return this.positions[0];
  }

  getEndPos() {
    return this.positions[this.positions.length - 1];
  }

  getPositions() {
    return this.positions;
  }

  clearPositions() {
    this.positions = [];
  }

  getDirection() {
    return this.direction;
  }

  setDirection(direction) {
    this.direction = direction;
  }
}
