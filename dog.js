class Enemy {
  constructor(_r, _y, _speed, _health) {
    this.r = _r;
    this.x = -_r; // 화면 왼쪽 밖에서 시작
    this.y = _y; // 길 위를 따라감
    this.speed = _speed;
    this.health = _health;
    this.active = true
  }

  update() {
    if (!this.active) return; // 죽으면 움직이지 않음
    this.x += this.speed;
  }

  show() {
    if (!this.active) return; // 죽으면 표시하지 않음

    fill(255, 50, 50);
    noStroke();
    ellipse(this.x, this.y, this.r * 2);
    
    // 체력바
    fill(255);
    rect(this.x - 20, this.y - 25, 40, 5);
    fill(0, 255, 0);
    rect(this.x - 20, this.y - 25, 40 * (this.health / 3), 5);
  }
  reachedEnd() {
    return this.x > width + this.r;
  }

  takeDamage(amount) {
    if (!this.active) return;
    this.health -= amount;
    this.health = max(this.health, 0);

    if (this.health === 0) {
      this.disappear();  // 체력이 0이면 자동 호출
    }
  }

  disappear() {
    this.active = false; // 화면에서 사라짐
  }

  isDead() {
    return this.health <= 0;
  }
}