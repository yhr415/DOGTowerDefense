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
    this.enhanced = 1
    this.adjTiles = []  //인접한 타일의 col, row값
  }

  // 두 타일이 인접한지 확인하는 메서드
  isAdjacent(otherTile) {
    const a = this.getCubeCoords();
    const b = otherTile.getCubeCoords();
    const distance = Math.max(
      Math.abs(a.x - b.x), 
      Math.abs(a.y - b.y), 
      Math.abs(a.z - b.z)
    );
    return distance <= 1; // 거리가 1이면 인접한 타일
  }

  setAdjTiles(){
    for (let r = 0; r < hexGrid.rows; r++) {
      for (let c = 0; c < hexGrid.cols; c++) {
        const otherTile = hexGrid.tiles[r][c];
        if (this.isAdjacent(otherTile)) {
          this.adjTiles.push([r, c]); // [row, col] 형태로 저장
        }
      }
    }  
  }
  //육각형 타일 간 거리 계산 받아오는 method 
  getCubeCoords() {
    let x = this.col;
    let z = this.row - (this.col - (this.col & 1)) / 2;
    let y = -x - z;
    return { x, y, z };
  }

  draw() {
    const isHover = dist(mouseX, mouseY, this.x, this.y) <= this.r;

    if (isHover) {
      stroke(255,255,255,100);
      strokeWeight(2);

      if (this.isPath || (this.tower && !this.justPlaced)) {
        fill(255, 0, 0,100);
      } else if (!this.isPath && !this.tower) {
        fill(0, 40);
      }
    } else {
      noStroke();
      let colorPath = color(78,68,46,100); // #B9A989 in RGB
      fill(this.isPath ? colorPath : color(0, 0, 0, 0));
    }

    if (this.enhanced > 1 && !this.isPath){
      fill(100 * this.enhanced, 0, 100 * this.enhanced, 100 * this.enhanced)
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



