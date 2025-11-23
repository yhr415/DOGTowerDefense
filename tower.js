class Tower {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.range = towerRange;
      this.cooldown = 0;
      this.fireRate = 30; // 공격 속도 (낮을수록 빠름)
    }
  
    show() {
      fill(50, 100, 255); // 파란색
      rectMode(CENTER);
      rect(this.x, this.y, 40, 40);
      
      // 사거리 표시 (마우스 올렸을 때만 보이게 하려면 조건 추가 가능)
      noFill();
      stroke(255, 50);
      strokeWeight(1);
      ellipse(this.x, this.y, this.range * 2);
    }
  
    shoot(enemies) {
      if (this.cooldown > 0) {
        this.cooldown--;
        return;
      }
  
      // 사거리 내의 가장 가까운 적 찾기
      let closestDist = Infinity;
      let target = null;
  
      for (let e of enemies) {
        let d = dist(this.x, this.y, e.x, e.y);
        if (d < this.range && d < closestDist) {
          closestDist = d;
          target = e;
        }
      }
  
      if (target) {
        bullets.push(new Bullet(this.x, this.y, target));
        this.cooldown = this.fireRate;
      }
    }
  }