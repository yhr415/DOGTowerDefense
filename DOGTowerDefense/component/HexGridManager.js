class HexGridManager {
  constructor(cols, rows, r, margin) {
    this.cols = cols;
    this.rows = rows;
    this.r = r;
    this.margin = margin;
    this.tiles = [];
    this.generate();
    this.totalW = this.cols * this.r * 3/2 + this.margin*2;
    this.totalH = this.rows * Math.sqrt(3) * this.r + this.margin*2;
  }

  generate() {
    this.tiles = [];
    const w = this.r * 2;
    const h = Math.sqrt(3) * this.r;
    const xOffset = w * 3/4;

    for (let row = 0; row < this.rows; row++) {
      this.tiles[row] = [];
      for (let col = 0; col < this.cols; col++) {
        let x = col * xOffset + this.margin;
        let y = row * h + (col % 2 === 0 ? this.margin : this.margin + h/2);
        this.tiles[row][col] = new HexTile(col, row, x, y, this.r);
      }
    }
  }

  draw() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.tiles[row][col].draw();
      }
    }
  }

  getTileAt(px, py) {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const t = this.tiles[row][col];
        if (dist(px, py, t.x, t.y) <= this.r) return t;
      }
    }
    return null;
  }

  setPathTile(row, col, flag = true) {
    if (this.tiles[row] && this.tiles[row][col]) this.tiles[row][col].isPath = flag;
  }

  //육각형 타일 간 거리 계산
  distance(tileA, tileB) {
    const a = tileA.getCubeCoords();
    const b = tileB.getCubeCoords();
    return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.z - b.z));
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

