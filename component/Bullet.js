class Bullet {
  constructor(target, tower) {
    this.target = target;
    this.x = tower.x;
    this.y = tower.y;
    this.towerX = tower.x;
    this.towerY = tower.y;
    
    this.speed = 6;
    this.damage = tower.damage || 1; 
    
    // 💡 타입 매핑: tower.type이 'snack', 'heal', 'love' 중 하나로 들어옴
    this.type = tower.type || 'snack'; 

    // 🎨 타입별 색상 자동 지정 (타워 색상 안 따라가고 탄환 고유색 지정)
    this.color = towerStats[this.type]["bulletColor"]

    //특수 효과 값 가져오기
    if (this.type === "heal"){
      // --- [치유 (구 스플래시) 설정] ---
      this.hitList = []; 
      this.maxRadius = tower.maxRadius || 60;
      this.currentRadius = 0;
      this.expandSpeed = 3;
      this.exploding = false;
    }
    else if (this.type === "love"){
      // --- [사랑 (구 관통) 설정] ---
      this.hitList = []; 
      this.penetrateLimit = tower.penetrateLimit || 3; 
      this.penetrated = 0;
      // 사랑(관통)은 방향 고정
      const vx = target.x - this.x;
      const vy = target.y - this.y;
      const len = sqrt(vx*vx + vy*vy);
      this.dir = {x: vx/len, y: vy/len}; 
    }
    else if (this.type === "slow"){
      //슬로우
      this.slowPower = tower.slowPower
    }
    
  }

  update() {
    // 1. 치유(Heal) 폭발 중 (향기가 퍼지는 중!)
    if (this.type === "heal" && this.exploding) {
      this.currentRadius += this.expandSpeed;
      return;
    }

    // 2. 사랑(Love) 이동 (직진!)
    if (this.type === "love") {
      this.x += this.dir.x * this.speed;
      this.y += this.dir.y * this.speed;
      return;
    }

    // 3. 기본 총알 이동 (유도탄)
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
    // 치유(Heal) 이펙트: 퍼지는 링
    if (this.type === "heal") {
      if (this.exploding){
        noFill();
        stroke(this.color);
        strokeWeight(3);
        ellipse(this.x, this.y, this.currentRadius * 2);
      }
      else {
        text('💣', this.x, this.y);
      }
    }
    // 사랑(Love) 이펙트: 핑크색 원 (하트로 바꾸고 싶으면 text('❤️', this.x, this.y) 쓰면 됨!)
    else if (this.type === "love") {
      text('❤️', this.x, this.y);
    }
    // 얼음
    else if (this.type === "slow") {
      text('🧊', this.x, this.y);
    }
    // 간식(Snack) 이펙트: 작은 알갱이
    else if (this.type === "snack"){
      fill(this.color);
      noStroke();
      ellipse(this.x, this.y, 6);
    }
  }

  hasHit() {
    // 🌿 [치유 (Heal)] = 광역 힐링(배부름)
    if (this.type === "heal") {
      if (!this.exploding && dist(this.x, this.y, this.target.x, this.target.y) < 8) {
        this.exploding = true; 
        return false; 
      }

      if (this.exploding) {
        for (let e of enemies) {
          if (!this.hitList.includes(e) && dist(this.x, this.y, e.x, e.y) <= this.currentRadius) {
            e.takeDamage(this.damage / 2); 
            this.hitList.push(e);
          }
        }
        if (this.currentRadius >= this.maxRadius) return true;
      }
      return false;
    }
    // 💖 [사랑 (Love)] = 관통하는 사랑
    else if (this.type === "love") {
      for (let e of enemies) {
        if (!this.hitList.includes(e) && dist(this.x, this.y, e.x, e.y) < 15) {
          this.hitList.push(e);
          e.takeDamage(this.damage);
          this.penetrated++;

          if (this.penetrated >= this.penetrateLimit) return true;
        }
      }
      return false; 
    }
    else if (this.type === "snack" || this.type === "slow") {
      // 🍖 [간식 (Snack)] = 단일 타겟
      if (dist(this.x, this.y, this.target.x, this.target.y) < 4) {
        this.target.takeDamage(this.damage);
        if (this.type === "slow"){
          this.target.getSlowed(this.slowPower)
        }
        return true; 
      }
      return false;
    }

  }

  isOffScreen() {
    return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
  }
}