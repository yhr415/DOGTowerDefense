class Bullet {
  constructor(target, tower) {
    this.target = target;
    this.x = tower.x;
    this.y = tower.y;
    this.towerX = tower.x;
    this.towerY = tower.y;
    
    this.speed = 6;
    this.damage = tower.damage || 1; // 타워 데미지 받아오기
    this.type = tower.type || 'basic'; // 타입 없으면 기본
    this.color = tower.color || [255, 255, 0];
    this.hitList = []; // 맞은 적들 목록 (중복 피격 방지)

    // Splash (스플래시) 설정
    this.maxRadius = tower.maxRadius || 60;
    this.currentRadius = 0;
    this.expandSpeed = 3;
    this.exploding = false;

    // Penetrate (관통) 설정
    this.penetrateLimit = tower.penetrateLimit || 3; // 관통 한계
    this.penetrated = 0;
    
    // 관통탄은 발사되는 순간 방향을 정해야 삑사리가 안 남!
    if (this.type === "penetrate" && target) {
        const vx = target.x - this.x;
        const vy = target.y - this.y;
        const len = sqrt(vx*vx + vy*vy);
        this.dir = {x: vx/len, y: vy/len}; // 단위 벡터 (방향)
    } else {
        this.dir = null;
    }
  }

  update() {
    // 1. 스플래시 폭발 중일 때
    if (this.type === "splash" && this.exploding) {
      this.currentRadius += this.expandSpeed;
      return;
    }

    // 2. 타겟이 사라졌을 때 (관통탄은 예외)
    if (!this.target && this.type !== "penetrate") return;

    // 3. 관통탄 이동 (직선 운동)
    if (this.type === "penetrate" && this.dir) {
      this.x += this.dir.x * this.speed;
      this.y += this.dir.y * this.speed;
      return;
    }

    // 4. 일반/스플래시 유도탄 이동
    if (this.target) {
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

  // 충돌 판정 및 데미지 처리
  hasHit() {
    // 🔥 스플래시 타입
    if (this.type === "splash") {
      // 1. 목표에 도달했는지 확인 (폭발 시작 전)
      if (!this.exploding && this.target && dist(this.x, this.y, this.target.x, this.target.y) < 8) {
        this.exploding = true; // 폭발 시작!
        return false; // 아직 총알을 삭제하지 않음 (폭발 애니메이션 보여줘야 함)
      }

      // 2. 폭발 중일 때 범위 데미지
      if (this.exploding) {
        // 💡 dogs 대신 enemies 배열 전체를 검사!
        for (let e of enemies) {
          if (!this.hitList.includes(e) && dist(this.x, this.y, e.x, e.y) <= this.currentRadius) {
            e.takeDamage(this.damage / 2); // 스플래시 데미지
            this.hitList.push(e);
          }
        }

        // 최대 범위 도달하면 총알 삭제 (true 반환)
        if (this.currentRadius >= this.maxRadius) return true;
      }
      return false;
    }

    // 🔥 관통 타입
    if (this.type === "penetrate") {
      // 💡 dogs 대신 enemies 배열 전체를 검사!
      for (let e of enemies) {
        // 이미 맞은 놈은 패스
        if (!this.hitList.includes(e) && dist(this.x, this.y, e.x, e.y) < 15) {
          this.hitList.push(e);
          e.takeDamage(this.damage);
          this.penetrated++;

          // 관통 한계 도달하면 삭제
          if (this.penetrated >= this.penetrateLimit) return true;
        }
      }
      return false; // 화면 밖으로 나갈 때까지 삭제 안 함 (isOffScreen에서 처리)
    }

    // 🔥 일반 타입 (단일 타겟)
    if (this.target && dist(this.x, this.y, this.target.x, this.target.y) < 4) {
        this.target.takeDamage(this.damage);
        return true; // 명중했으니 삭제
    }
    
    return false;
  }

  isOffScreen() {
    return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
  }
}