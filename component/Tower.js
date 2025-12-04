const towerStats = {
  normal: {
    range:            [null, 100, 130, 160, 190, 220],
    fireRate:         [null, 30, 26, 22, 18, 14],
    damage:           [null, 1, 2, 3, 4, 6],
    maxRadius:        [null, null, null, null, null, null],
    maxPenetrate:     [null, null, null, null, null, null]
  },
  splash: {
    range:            [null, 150, 180, 210, 250, 300],
    fireRate:         [null, 60, 54, 48, 42, 36],
    damage:           [null, 2, 2, 3, 4, 5],
    maxRadius:        [null, 70, 75, 80, 85, 90],
    maxPenetrate:     [null, null, null, null, null, null]
  },
  penetrate: {
    range:            [null, 180, 210, 240, 270, 310],
    fireRate:         [null, 72, 66, 60, 54, 48],
    damage:           [null, 1, 2, 3, 4, 5],
    maxRadius:        [null, null, null, null, null, null],
    maxPenetrate:     [null, 3, 3, 4, 4, 5]
  }
}

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

  generate(){
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
    ellipse(this.x, this.y, 10 + this.level*5);
  }

  shoot(dogs) {
    if (this.cooldown > 0) return;
    for (let e of dogs) {
      if (dist(this.x, this.y, e.x, e.y) <= this.range) {
        bullets.push(new Bullet(e, this));
        this.cooldown = this.fireRate;
        break;
      }
    }
  }
}