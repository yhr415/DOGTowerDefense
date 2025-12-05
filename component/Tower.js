class Tower {
  constructor(x, y, col, row, level, type, color) {
    this.x = x; this.y = y;
    this.col = col; this.row = row;

    this.level = level;
    this.type = type
    this.color = color

    this.cooldown = 0;
    this.generate()
  }

  generate() {
    const stats = towerStats[this.type];

    this.range = stats.range[this.level];
    this.fireRate = stats.fireRate[this.level];
    this.damage = stats.damage[this.level];

    this.maxRadius = stats.maxRadius[this.level];
    this.maxPenetrate = stats.maxPenetrate[this.level];
  }


  levelUp() {
    if (this.level < maxTowerLevel) {
      this.level++;
      this.generate();
    }
  }

  update() { if (this.cooldown > 0) this.cooldown--; }

  show() {
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, 10 + this.level * 5);
  }

  shoot(enemies) {
    if (this.cooldown > 0) return;
    for (let e of enemies) {
      if (dist(this.x, this.y, e.x, e.y) <= this.range) {
        bullets.push(new Bullet(e, this));
        this.cooldown = this.fireRate;
        break;
      }
    }
  }
}