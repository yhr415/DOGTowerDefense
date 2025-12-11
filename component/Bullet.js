class Bullet {
  constructor(target, tower) {
    this.target = target;
    this.x = tower.x;
    this.y = tower.y;
    this.towerX = tower.x;
    this.towerY = tower.y;

    this.speed = 6;
    this.damage = tower.damage || 1;

    // 💡 타입 매핑
    this.type = tower.type || 'snack';

    // 🎨 색상 가져오기 (안전장치: towerStats가 없거나 색이 없으면 기본색)
    if (typeof towerStats !== 'undefined' && towerStats[this.type]) {
      this.color = towerStats[this.type]["bulletColor"];
    } else {
      this.color = [0, 0, 0]; // 기본 검정
    }

    // --- [타입별 초기화] ---
    this.hitList = []; // 광역/관통용 피격 리스트

    if (this.type === "heal") {
      this.maxRadius = tower.maxRadius || 60;
      this.currentRadius = 0;
      this.expandSpeed = 3;
      this.exploding = false;
    }
    else if (this.type === "love") {
      this.penetrateLimit = tower.penetrateLimit || 3;
      this.penetrated = 0;

      // 🚨 안전장치: 타겟이 존재할 때만 방향 계산
      if (this.target) {
        const vx = target.x - this.x;
        const vy = target.y - this.y;
        const len = sqrt(vx * vx + vy * vy);
        this.dir = { x: vx / len, y: vy / len };
      } else {
        // 타겟이 없으면 그냥 오른쪽으로 날아가게 (에러 방지)
        this.dir = { x: 1, y: 0 };
      }
    }
    else if (this.type === "slow") {
      this.slowPower = tower.slowPower || 0.5; // 기본 슬로우 값
    }
  }

  update() {
    // 1. 치유(Heal) 폭발 중
    if (this.type === "heal" && this.exploding) {
      this.currentRadius += this.expandSpeed;
      return;
    }

    // 2. 사랑(Love) 이동 (직진 - 타겟 없어도 감)
    if (this.type === "love") {
      if (this.dir) {
        this.x += this.dir.x * this.speed;
        this.y += this.dir.y * this.speed;
      }
      return;
    }

    // 3. 유도탄 (Snack, Slow)
    // 🚨 안전장치: 타겟이 죽어서 사라졌으면 총알도 삭제 (또는 그냥 직진)
    // 여기서는 간단하게 타겟이 없으면 멈추게(삭제되게) 처리
    if (!this.target) return;

    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const distToTarget = sqrt(dx * dx + dy * dy);

    if (distToTarget < this.speed) {
      this.x = this.target.x;
      this.y = this.target.y;
    } else {
      this.x += dx / distToTarget * this.speed;
      this.y += dy / distToTarget * this.speed;
    }
  }

  show() {
    // 폭발 중이면? 나는 투명해진다! (그림은 Effect 객체 담당)
    drawBullet(this.type, this.exploding, this.x, this.y, this.color);
  }

  hasHit() {
    // heal 관련 bullet 과 effect
    if (this.type === "heal") {
      // 목표 도달 시 폭발 시작 -> effect시작
      if (!this.exploding && this.target && dist(this.x, this.y, this.target.x, this.target.y) < 10) {
        this.exploding = true;
        let effectSize = this.maxRadius * 2; //폭발 effect size를 폭발 radius에 종속
        effects.push(new Effect(
          this.x, this.y,
          healGreen20, // 이미지
          20, // 총 프레임
          5, 4,  // 가로 세로 줄 수
          effectSize, effectSize
        ));
        return false;
      }

      // 2. 폭발 중 범위 체크
      if (this.exploding) {
        for (let e of enemies) {
          if (!this.hitList.includes(e) && dist(this.x, this.y, e.x, e.y) <= this.currentRadius) {
            // Dog의 applyEffect 호출 (데미지 + 모션 변경)
            // 힐링이니까 데미지는 음수? 아니면 로직에 따라 양수(배부름)
            e.applyEffect('heal', this.damage);
            this.hitList.push(e);
          }
        }
        if (this.currentRadius >= this.maxRadius) return true; // 폭발 끝, 총알 삭제
      }
      return false;
    }

    // ------------------💖 [사랑 (Love)] = 관통
    else if (this.type === "love") {
      for (let e of enemies) {
        if (!this.hitList.includes(e) && dist(this.x, this.y, e.x, e.y) < 20) {
          this.hitList.push(e);
          e.applyEffect('love', this.damage);
          this.penetrated++;

          if (this.penetrated >= this.penetrateLimit) return true;
        }
      }
      return false;
    }

    // 🍖 [간식/슬로우] = 단일 타겟
    else if (this.type === "snack" || this.type === "slow") {
      if (this.target && dist(this.x, this.y, this.target.x, this.target.y) < 5) {

        if (this.type === "slow") {
          // 슬로우 효과 적용 (Dog에 getSlowed가 있다면)
          if (this.target.getSlowed) this.target.getSlowed(this.slowPower);
          // 모션 변경용
          this.target.applyEffect('slow', this.damage);
        } else {
          // 일반 간식
          this.target.applyEffect('snack', this.damage);
        }

        return true; // 명중, 총알 삭제
      }
      return false;
    }
  }

  isOffScreen() {
    return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
  }
}

function drawBullet(type, exploding, x, y, color) {
  if (type === "heal" && exploding) {
    return; // 아무것도 안 그리고 함수 종료! 
  }

  if (bulletimgs[type]) {
    image(bulletimgs[type], x, y,40,40);
  }
  // basic bullet
  else {
    fill(color);
    noStroke();
    ellipse(x, y, 8);
  }
}