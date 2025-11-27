class Enemy {
  constructor(initialHp = 3) {
    this.x = -GRID_SIZE / 2; // 화면 왼쪽 첫 칸 중앙에서 시작
    this.y = NUM_ROWS * GRID_SIZE / 2; // 경로 중앙 Y
    this.speed = 1;
    this.maxHp = initialHp;
    this.hp = initialHp;
    this.w = GRID_SIZE * 0.5;
    this.h = GRID_SIZE * 0.5;
  }

  update() {
    this.x += this.speed;
  }

  show() {
    // 🐕 강아지 모양 (갈색 원)
    fill(200, 100, 0); 
    ellipse(this.x, this.y, this.w, this.h);
    
    // HP바
    noStroke();
    fill(255, 0, 0); // 빨간색 배경
    rect(this.x - this.w / 2, this.y - this.h - 5, this.w, 3);
    fill(0, 255, 0); // 초록색 HP
    let hpWidth = map(this.hp, 0, this.maxHp, 0, this.w);
    rect(this.x - this.w / 2, this.y - this.h - 5, hpWidth, 3);
  }

  takeDamage(damage) {
    this.hp -= damage;
  }

  isDead() {
    return this.hp <= 0;
  }

  reachedEnd() {
    return this.x > width + 10;
  }
}