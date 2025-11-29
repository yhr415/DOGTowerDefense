class Tower {
  constructor(x, y, col, row, level = 1) {
    this.x = x; this.y = y;
    this.col = col; this.row = row;
    this.level = level;
    this.range = towerRange[level];
    this.fireRate = towerFireRate[level];
    this.cooldown = 0;
  }

  update() { if (this.cooldown > 0) this.cooldown--; }

  show() {
    fill(0,200,0);
    noStroke();
    ellipse(this.x, this.y, 10 + this.level*5);
  }

  shoot(enemies) {
    if (this.cooldown > 0) return;
    for (let e of enemies) {
      if (dist(this.x, this.y, e.x, e.y) <= this.range) {
        bullets.push(new Bullet(this.x, this.y, e));
        this.cooldown = this.fireRate;
        break;
      }
    }
  }
}