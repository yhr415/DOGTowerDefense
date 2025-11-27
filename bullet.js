class Bullet {
  constructor(x, y, target) {
    this.x = x;
    this.y = y;
    this.speed = 5;
    this.target = target;
    this.hit = false;
  }

  update() {
    // 목표가 죽었거나 사라졌으면 총알도 제거되도록 처리
    if (this.target.isDead() || this.target.reachedEnd()) {
      this.hit = true; 
      return;
    }
    
    // 타겟을 향해 이동 (벡터 계산)
    let angle = atan2(this.target.y - this.y, this.target.x - this.x);
    this.x += cos(angle) * this.speed;
    this.y += sin(angle) * this.speed;

    // 충돌 감지
    if (dist(this.x, this.y, this.target.x, this.target.y) < 10) {
      this.hit = true;
    }
  }

  show() {
    fill(255, 255, 0); // 노란색 총알
    ellipse(this.x, this.y, 5, 5);
  }

  hasHit() {
    return this.hit;
  }
  
  isOffScreen() {
    return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
  }
}