class Enemy {
    constructor() {
      this.r = 15;
      this.x = -this.r; // 화면 왼쪽 밖에서 시작
      this.y = height / 2; // 길 위를 따라감
      this.speed = 2;
      this.health = 3;
    }
  
    update() {
      this.x += this.speed;
    }
  
    show() {
      fill(255, 50, 50); // 빨간색
      noStroke();
      ellipse(this.x, this.y, this.r * 2);
      
      // 체력바
      fill(255);
      rect(this.x - 10, this.y - 25, 20, 5);
      fill(0, 255, 0);
      rect(this.x - 10, this.y - 25, 20 * (this.health / 3), 5);
    }
  
    reachedEnd() {
      return this.x > width + this.r;
    }
  
    takeDamage(amount) {
      this.health -= amount;
    }
  
    isDead() {
      return this.health <= 0;
    }
  }