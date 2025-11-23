class Bullet {
    constructor(x, y, target) {
      this.x = x;
      this.y = y;
      this.target = target;
      this.speed = 8;
      this.r = 5;
    }
  
    update() {
      // 유도탄 방식 (적이 움직여도 따라감)
      if (this.target) {
        let angle = atan2(this.target.y - this.y, this.target.x - this.x);
        this.x += cos(angle) * this.speed;
        this.y += sin(angle) * this.speed;
      }
    }
  
    show() {
      fill(255, 255, 0); // 노란색
      noStroke();
      ellipse(this.x, this.y, this.r * 2);
    }
  
    hasHit() {
      if (!this.target) return false;
      let d = dist(this.x, this.y, this.target.x, this.target.y);
      return d < (this.r + this.target.r);
    }
  
    isOffScreen() {
      return (this.x < 0 || this.x > width || this.y < 0 || this.y > height);
    }
  }