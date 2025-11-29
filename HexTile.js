class HexTile {
  constructor(col, row, x, y, r) {
    this.col = col;
    this.row = row;
    this.x = x;
    this.y = y;
    this.r = r;
    this.isPath = false;
    this.tower = null;
    this.justPlaced = false; // 타워 배치 직후 플래그
  }

  //육각형 타일 간 거리 계산 받아오는 method 
  getCubeCoords() {
    let x = this.col - (this.row - (this.row & 1)) / 2;
    let z = this.row;
    let y = -x - z;
    return { x, y, z };
  }

  draw() {
    const isHover = dist(mouseX, mouseY, this.x, this.y) <= this.r;

    if (isHover) {
      stroke(255);
      strokeWeight(2);

      if (this.isPath || (this.tower && !this.justPlaced)) {
        fill(255, 0, 0);
      } else if (!this.isPath && !this.tower) {
        fill(0, 255, 0);
      }
    } else {
      noStroke();
      fill(this.isPath ? 120 : 50);
    }

    polygon(this.x, this.y, this.r, 6);

    if (this.tower) this.tower.show();

    if (this.justPlaced) this.justPlaced = false;
  }

  // 타워를 새로 배치할 때 호출
  placeTower(tower) {
    this.tower = tower;
    this.justPlaced = true;
  }

  // 마우스가 타일을 벗어나면 호출
  clearJustPlaced() {
    this.justPlaced = false;
  }
}

function polygon(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius;
    let sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}



