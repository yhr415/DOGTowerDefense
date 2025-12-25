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

  setAdjTiles() {
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
    // 1. [다중 선택 방지] 반지름을 0.85배로 줄여서 옆 타일 침범 막기!
    const isHover = dist(mouseX, mouseY, this.x, this.y) <= this.r * 0.85;

    // 2. [기본 초기화] 그리기 전에 붓 깨끗이 씻기 (흰색 묻어남 방지)
    noStroke();
    noFill();

    // 1225 update : 경로에 이미지 넣기
    if (this.isPath) {
      push();
      imageMode(CENTER);
      if (typeof floorImg !== 'undefined') {
        // 이미지 크기 살짝 조정 (2.1배면 적당)
        image(floorImg, this.x, this.y, this.r * 2.1, this.r * 2.1);
      }
      pop();
    }
    // isPath가 아닐 때 fill(0,0,0,0)은 위에서 noFill() 했으니 생략 가능

    // 하이라이트 로직
    if (isHover) {
      stroke(255, 255, 255, 100);
      strokeWeight(2); // 선 두께 좀 줘야 보임

      if (this.isPath || (this.tower && !this.justPlaced)) {
        fill(255, 0, 0, 100); // 빨간색 (설치 불가)
      } else if (!this.isPath && !this.tower) {
        fill(0, 40); // 검은색 투명 (설치 가능)
      }
    } else {
      // 마우스 안 올렸을 때
      noStroke();
      noFill(); // 🔥 [핵심] 여기서 확실하게 색을 빼줘야 흰색이 안 생겨!
    }

    // 강화된 타일 표시
    if (this.enhanced > 1 && !this.isPath) {
      fill(100 * this.enhanced, 0, 100 * this.enhanced, 100 * this.enhanced)
    }

    // 육각형 그리기 (위에서 noFill()이 먹혔으면 투명하게, 색이 있으면 색칠해서 그려짐)
    polygon(this.x, this.y, this.r, 6);

    // 타워 그리기
    if (this.tower) {
      this.tower.show();
      // 💡 혹시 모르니 타워 그리고 나서 붓 씻어주기 (안전장치)
      noFill();
      noStroke();
    }

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



