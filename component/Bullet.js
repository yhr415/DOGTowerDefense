class Bullet {
  constructor(target, tower) {
    this.target = target;
    this.x = tower.x;
    this.y = tower.y;
    this.towerX = tower.x
    this.towerY = tower.y
    
    this.speed = 6;
    this.damage = 1;
    this.type = tower.type
    this.color = tower.color
    this.hitDogs = []

    // Splash
    this.maxRadius = tower.maxRadius
    this.currentRadius = 0
    this.expandSpeed = 3
    this.exploding = false

    // Penetrate
    this.maxPenetrate = tower.maxPenetrate
    this.penetrated = 0
    this.dir = null
  }

  update() {
    if (this.type === "splash" && this.exploding) {
      this.currentRadius += this.expandSpeed;
      return;
    }

    if (!this.target && this.type !== "penetrate") return;

    if (this.type === "penetrate" && this.dir) {
      this.x += this.dir.x * this.speed;
      this.y += this.dir.y * this.speed;
      return;
    }

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
    if (this.type === "splash" && this.exploding) {
      noFill();
      stroke(this.color);
      strokeWeight(2);
      ellipse(this.x, this.y, this.currentRadius * 2);
    }
    else {
      fill(this.color);
      noStroke();
      ellipse(this.x, this.y, 6);
    }
  }

  hasHit() {
    if (this.type === "splash") {
      if (!this.exploding && this.target && dist(this.x, this.y, this.target.x, this.target.y) < 8) {
        this.exploding = true;
        return false;
      }

      if (this.exploding) {
        for (let d of dogs) {
          if (!this.hitDogs.includes(d) && dist(this.x, this.y, d.x, d.y) <= this.currentRadius) {
            d.takeDamage(this.damage / 2);
            this.hitDogs.push(d);
          }
        }

        if (this.currentRadius >= this.maxRadius) return true;
      }
      return false;
    }

    if (this.type === "penetrate") {
      for (let d of dogs) {
        if (!this.hitDogs.includes(d) && dist(this.x, this.y, d.x, d.y) < 8) {
          this.hitDogs.push(d);
          d.takeDamage(this.damage);
          this.penetrated++;

          if (!this.dir) {
            const vx = d.x - this.towerX;
            const vy = d.y - this.towerY;
            const len = sqrt(vx*vx + vy*vy);
            this.dir = {x: vx/len, y: vy/len};
          }

          if (this.penetrated >= this.penetrateLimit) return true;
        }
      }
      return false;
    }

    return this.target && dist(this.x, this.y, this.target.x, this.target.y) < 4;
  }

  isOffScreen() {
    return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
  }
}