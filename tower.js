class Tower {
  // 타워가 자신의 격자 위치를 알 수 있도록 col, row를 받음
  constructor(x, y, col, row) { 
    this.x = x; // 픽셀 중앙 X
    this.y = y; // 픽셀 중앙 Y
    this.col = col;
    this.row = row;
    this.range = towerRange;
    this.fireRate = 30; // 30 프레임마다 발사
    this.lastShot = 0;
    this.w = GRID_SIZE * 0.8; // 격자 크기의 80%
    this.h = GRID_SIZE * 0.8;
  }

  show() {
    fill(0, 200, 255); // 파란색 타워
    rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    noFill();
    stroke(0, 200, 255, 50); // 범위 표시
    ellipse(this.x, this.y, this.range * 2);
  }

  shoot(targetEnemies) {
    if (frameCount - this.lastShot >= this.fireRate) {
      // 범위 내의 적 찾기
      let target = targetEnemies.find(e => dist(this.x, this.y, e.x, e.y) < this.range);
      
      if (target) {
        bullets.push(new Bullet(this.x, this.y, target));
        this.lastShot = frameCount;
      }
    }
  }
}