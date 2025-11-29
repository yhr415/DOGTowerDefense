class Bullet {
  constructor(x, y, target) {
    this.x = x;
    this.y = y;
    this.target = target;
    this.speed = 6;
    this.damage = 1;
  }

  update() {
    if (!this.target) return;
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const distToTarget = sqrt(dx*dx + dy*dy);
    if (distToTarget < this.speed) {
      this.x = this.target.x;
      this.y = this.target.y;
    } else {
      this.x += dx / distToTarget * this.speed;
      this.y += dy / distToTarget * this.speed;
    }
  }

  show() {
    fill(255, 255, 0);
    noStroke();
    ellipse(this.x, this.y, 6);
  }

  hasHit() {
    return this.target && dist(this.x, this.y, this.target.x, this.target.y) < 4;
  }

  isOffScreen() {
    return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
  }
}