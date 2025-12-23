class Bullet {
  // ... (constructor, update, show 등 기존 코드 그대로 유지) ...
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
    // 🌿 [치유 (Heal)] = 기존 로직 유지 + 이펙트 함수 사용
    if (this.type === "heal") {
      if (!this.exploding){
        let hitted = null
        for (let i = enemies.length - 1; i >= 0; i--){
          if (dist(this.x, this.y, enemies[i].x, enemies[i].y) < 10){
            hitted = enemies[i]
            break
          }
        }
        if (!hitted){
          if (this.target.isDead()){
            return true
          }
          return false
        }

        this.exploding = true;
        // 💥 이펙트 생성 (폭발은 크기가 가변적이라 여기서 직접 호출)
        let effectSize = this.maxRadius * 2;
        spawnHitEffect("heal", this.x, this.y, effectSize,effectSize);
        playHitSound();
        return false;
      }
      else {
        for (let e of enemies) {
          if (!this.hitList.includes(e) && dist(this.x, this.y, e.x, e.y) <= this.currentRadius) {
            e.applyEffect('heal', this.damage);
            this.hitList.push(e);
          }
        }
        if (this.currentRadius >= this.maxRadius) return true;
      }
      return false;
    }

    // 💖 [사랑 (Love)] = 관통할 때마다 이펙트 펑펑!
    else if (this.type === "love") {
      for (let e of enemies) {
        if (!this.hitList.includes(e) && dist(this.x, this.y, e.x, e.y) < 20) {
          this.hitList.push(e);
          e.applyEffect('love', this.damage);

          // 💥 사랑의 화살 맞은 적 위치에 이펙트 생성!
          spawnHitEffect("love", e.x, e.y, 70,70);
          playHitSound();        
        }
      }
      return false;
    }

    // 🍖 [간식/슬로우] = 단일 타겟 충돌 시 이펙트!
    else if (this.type === "snack" || this.type === "slow" || this.type === "antiTanker") {
      
      if (this.target.isDead()){
        // target이 다른 총알에 의해 죽었을 때(나 말고) 현재 위치 근처의 적을 새 target으로 설정하려면 아래 활성화
        /*
        for (let e of enemies){
          if (dist(this.x, this.y, e.x, e.y) < 100){
            this.target = e
            return false
          }
        }
        */
        return true
      }
      let hitted = null
      for (let i = enemies.length - 1; i >= 0; i--){
        if (dist(this.x, this.y, enemies[i].x, enemies[i].y) < 10){
          hitted = enemies[i]
          break
        }
      }
      if (!hitted){
        return false
      }

      if (this.type === "slow") {
        hitted.applyEffect('slow', this.damage, this.slowPower);
        // 💥 얼음 이펙트 (적 위치에)
        spawnHitEffect("slow", hitted.x, hitted.y, 40,40);
        playHitSound();
      }
      else if (this.type === "snack"){
        // 일반 간식
        hitted.applyEffect('snack', this.damage, 1.0);  //1.0배만큼 속도 빨라지도록
        // 💥 간식 이펙트 (적 위치에)
        spawnHitEffect("snack", hitted.x, hitted.y, 30,30);
        playHitSound();
      }
      else if (this.type === "antiTanker"){
        hitted.applyEffect("antiTanker", this.damage, null);
        spawnHitEffect("antiTanker", hitted.x, hitted.y, 30,30);
        playHitSound();
      }

      return true; // 총알 삭제
    }
  }

  isOffScreen() {
    return this.x < 0 || this.x > width || this.y < 0 || this.y > height;
  }
}

// ------------------------------------------------------------------
// 💥 [핵심 추가] 이펙트 생성 도우미 함수 (코드 중복 방지)
// ------------------------------------------------------------------
function spawnHitEffect(type, x, y, w,h) {
  let img, frames, cols, rows;

  // 1. 타입별 이미지 및 설정값 선택 (전역변수에 이미지가 있다고 가정!)
  if (type === "heal") {
    img = window.healGreen20; // 형이 쓴 변수명
    frames = 20; cols = 5; rows = 4;
  } 
  else if (type === "love") {
    img = heartEffect5; // 💖 사랑 이펙트 이미지 (preload 필요)
    frames = 5; cols = 5; rows = 1; // 예시 값
  } 
  else if (type === "slow") {
    img = window.slowHitImg; // ❄️ 얼음 이펙트 이미지 (preload 필요)
    frames = 5; cols = 5; rows = 1; // 예시 값
  } 
  else if (type === "snack") {
    img = window.snackHitImg; // 🍖 간식 이펙트 이미지 (preload 필요)
    frames = 4; cols = 2; rows = 2; // 예시 값
  }
  else if (type === "antiTanker") {
    //TODO
  }

  // 2. 이미지가 존재하면 이펙트 생성
  if (img) {
    effects.push(new Effect(
      x, y,
      img,
      frames,
      cols,
      rows,
      w,h
    ));
  }
}

// ... (drawBullet 함수는 그대로 유지) ...
function drawBullet(type, exploding, x, y, color) {
  if (type === "heal" && exploding) {
    return; 
  }
  if (typeof bulletimgs !== 'undefined' && bulletimgs[type]) {
    image(bulletimgs[type], x, y, 40, 40);
  }
  else {
    fill(color);
    noStroke();
    ellipse(x, y, 8);
  }
}

function playHitSound() {
  playSfx('hit', {interval: 480, maxStack: 1, decayMs: 500})
}