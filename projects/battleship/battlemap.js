import { Battleship } from "./battleship.js";
import { Point2D } from "./point2d.js";

export class BattleMap {
  constructor(size) {
    this.isSetupComplete = false;
    this.placed = [];
    this.battleships = [];
    this.map = [];
    while (this.map.push([]) < size);

    if (this.isCorrectSize(size)) {
      this.mapSize = size;
      for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
          this.map[i][j] = "";
        }
      }
    } else {
      throw new Error("Map must be of size 7x7 or 10x10.");
    }
  }

  getPlacedBattleships() {
    return this.placed;
  }

  placeShip(start, end, battleship) {
    var direction = "";
    var battleshipClone = new Battleship(battleship.getLength());

    try {
      direction = this.determineDirection(start, end);
    } catch (error) {
      throw new Error("One or more of the given points are out of bounds!");
    }

    if (this.isCorrectLength(start, end, direction, battleship)) {
      if (direction == "right") {
        for (let i = parseInt(start.getX()); i <= parseInt(end.getX()); i++) {
          battleshipClone
            .getPositions()
            .push(new Point2D(i, parseInt(start.getY())));
        }
      } else if (direction === "left") {
        let tempList = [];
        for (let i = parseInt(end.getX()); i <= parseInt(start.getX()); i++) {
          tempList.add(new Point2D(i, parseInt(start.getY())));
        }
        for (let i = tempList.length - 1; i >= 0; i--) {
          battleshipClone.getPositions().push(tempList[i]);
        }
      } else if (direction === "down") {
        for (let i = parseInt(start.getY()); i <= parseInt(end.getY()); i++) {
          battleshipClone
            .getPositions()
            .push(new Point2D(parseInt(start.getX()), i));
        }
      } else if (direction === "up") {
        let tempList = [];
        for (let i = parseInt(end.getY()); i <= parseInt(start.getY()); i++) {
          tempList.add(new Point2D(parseInt(start.getX())), i);
        }
        for (let i = tempList.length - 1; i >= 0; i--) {
          battleshipClone.getPositions().push(tempList[i]);
        }
      }
      if (this.isValidPlacement(battleshipClone)) {
        battleship.setDirection(direction);
        for (const apoint of battleshipClone.getPositions()) {
          battleship.getPositions().push(apoint);
        }
        this.placed.push(battleship);
        for (let i = 0; i < battleship.getPositions().length; i++) {
          this.map[parseInt(battleship.getPositions()[i].getY())][
            parseInt(battleship.getPositions()[i].getX())
          ] = "o";
        }
      } else {
        battleship.clearPositions();
        throw new Error(
          "Invalid ship placement: placement overlaps with previously placed ships!"
        );
      }
    } else {
      throw new Error("Distance between points do not match ship length!");
    }
  }

  getMap() {
    return this.map;
  }

  getBattleships() {
    return this.battleships;
  }

  getMapSize() {
    return this.mapSize;
  }

  isSetupComplete() {
    return this.isSetupComplete;
  }

  completeSetup() {
    this.isSetupComplete = true;
  }

  isCorrectSize(size) {
    return size === 7 || size === 10;
  }

  isCorrectLength(start, end, direction, battleship) {
    if (direction === "right" || direction === "left") {
      if (
        Math.abs(parseInt(start.getX() - end.getX())) !=
        battleship.getLength() - 1
      ) {
        return false;
      }
    } else if (direction === "down" || direction === "up") {
      if (
        Math.abs(parseInt(start.getY() - end.getY())) !=
        battleship.getLength() - 1
      ) {
        return false;
      }
    } else {
      return false;
    }
    return true;
  }

  isValidPlacement(battleship) {
    // Sjekker om noen av posisjonene i Positions allerede er opptatt:
    for (let i = 0; i < battleship.getPositions().length; i++) {
      if (
        this.map[parseInt(battleship.getPositions()[i].getY())][
          parseInt(battleship.getPositions()[i].getX())
        ] != ""
      ) {
        return false;
      }
    }
    return true;
  }

  determineDirection(start, end) {
    // Returnerer "right", "left", "up" eller "down" hvis to forskjellige, gyldige punkter velges
    // Hvis retningen er diagonal eller begge punktene er like, returneres en tom streng
    if (start.equals(end)) {
      return "";
    }
    // Hvis det er endring i både y- og x-retningen samtidig (diagonal):
    else if (
      Math.abs(parseInt(start.getX() - end.getX())) != 0 &&
      Math.abs(parseInt(start.getY() - end.getY())) != 0
    ) {
      return "";
    }
    if (Math.abs(parseInt(start.getX() - end.getX())) != 0) {
      // Bevegelse horisontalt (i x-retning)
      if (end.getX() > start.getX()) {
        return "right";
      } else if (end.getX() < start.getX()) {
        return "left";
      }
    } else if (Math.abs(parseInt(start.getY() - end.getY())) != 0) {
      // Bevegelse vertikalt (i y-retning)
      if (end.getY() > start.getY()) {
        return "down";
      } else if (end.getY() < start.getY()) {
        return "up";
      }
    }
    return "";
  }
}
