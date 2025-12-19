class Dog {
  constructor(path, initialHp, speed, name = 'jindo', color = 'white') {
    this.path = path;
    this.current = 0;
    this.x = path[0].x;
    this.y = path[0].y;
    this.maxHp = initialHp;
    this.hp = 0;

    // 💡 핵심: 원래 속도를 기억해야 나중에 돌아올 수 있음!
    this.baseSpeed = speed;
    this.speed = speed;

    this.name = name;
    this.color = color;
    this.w = 32;
    this.h = 32;

    // 상태 관리용 변수
    this.slowed = false;
    this.speedBoosted = false; // 스피드 업 상태 확인용
    this.playing = false;

    // 💡 효과 지속 시간 타이머 (프레임 단위)
    this.effectTimer = 0;
  }

  update() {
    if (this.effectTimer > 0) {
      this.effectTimer--;
      // 타이머가 0이 되면 모든 상태와 속도를 원래대로 초기화
      if (this.effectTimer === 0) {
        this.speed = this.baseSpeed;
        this.slowed = false;
        this.playing = false
        this.speedBoosted = false;
      }
    }

    if (this.playing) return;

    if (this.current >= this.path.length - 1) return;

    let target = this.path[this.current + 1];
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const distToTarget = sqrt(dx * dx + dy * dy);

    if (distToTarget < this.speed) {
      this.x = target.x;
      this.y = target.y;
      this.current++;
    } else {
      this.x += dx / distToTarget * this.speed;
      this.y += dy / distToTarget * this.speed;
    }
  }

  show() {
    drawDogImage(this.name, this.color,this.hp,this.maxHp,this.x,this.y)

    drawDogHPbar(this.x, this.y, this.hp, this.maxHp);
    // 상태 텍스트 표시
    if (this.playing) {
      strokeWeight(3);
      stroke(0)
      fill(255, 0, 0)
      textAlign(CENTER, TOP);
      textSize(18);
      text("playing!", this.x, this.y - 70)
    }
    else if (this.slowed) {
      fill(100, 150, 255);
      textAlign(CENTER, TOP);
      textSize(18);
      text("❄️", this.x, this.y - 50); // 텍스트 대신 이모지로 깔끔하게
    }
    else if (this.speedBoosted) {
      fill(255, 100, 0);
      textAlign(CENTER, TOP);
      textSize(18);
      text("⚡", this.x, this.y - 50);
    }
  }

  reachedEnd() { return this.current >= this.path.length - 1; }
  isDead() { return this.hp >= this.maxHp; }

  // 💡 수정된 applyEffect
  applyEffect(type, value, abilityFactor) {
    // 1. HP 채우기 (기본, 간식, 사랑, 힐)
    // 형 게임이 '만족도 채우기'라면 힐도 += 가 맞을 것 같아서 수정했어.
    // 만약 힐이 '방해' 목적이면 -= 로 다시 바꿔!
    this.hp += value;

    // HP가 Max 넘지 않게 막기 (선택사항)
    if (this.hp > this.maxHp) this.hp = this.maxHp;

    // 상태별 모션 (스프라이트 있으면 작동)
    if (type === 'heal' || type === 'love') {
      this.currentEffect = type;
      this.effectTimer = 30;
    }

    // 특수 효과
    if (type === 'snack' && !this.slowed && !this.playing) {
      this.speedBoosted = true;
      this.speed = this.baseSpeed * abilityFactor;
      this.effectTimer = 50;
    }
    else if (type === 'slow') {
      this.getSlowed(abilityFactor);
    }
    else if (type === "playground"){
      this.getPlayed(abilityFactor)
    }
  }

  getSlowed(factor){    
    this.slowed = true;
    this.speed = this.baseSpeed * factor;
    this.effectTimer = 120; // 120프레임(2초) 뒤에 풀림
  }

  getPlayed(factor){
    this.playing = true
    this.effectTimer = factor
  }
}

// [수정] color 파라미터 추가!
function drawDogImage(name, color, hp, maxHp, x, y) {
  let currentImage;
  let dogstatus;

  // 1. 체력 상태 체크 (기존 로직)
  if (hp <= maxHp / 3) {
    dogstatus = "sad";
  } else if (hp <= (maxHp / 3) * 2) {
    dogstatus = "neutral";
  } else {
    dogstatus = "happy";
  }

  // 2. 🔥 [핵심 변경] 하드코딩된 'white' 대신 변수 사용!
  // 방어 코드: 만약 dogPics[name] 안에 해당 color가 없으면 'white'로 강제 전환 (에러 방지)
  let useColor = color;
  if (!dogPics[name] || !dogPics[name][useColor]) {
    console.warn(`⚠️ 경고: ${name}의 ${useColor} 색상이 없습니다. white로 대체합니다.`);
    useColor = 'white';
  }

  // 3. 이미지 할당
  // dogPics 구조가: dogPics['shiba']['brown']['happy'] 이런 식이어야 함
  if (dogPics[name] && dogPics[name][useColor]) {
    currentImage = dogPics[name][useColor][dogstatus];
  }

  // 4. 이미지 그리기 (이미지가 있으면)
  if (currentImage) {
    image(currentImage, x, y, 150, 150); // 크기는 형 설정에 맞게!
  } else {
    // 이미지 로딩 실패 시 빨간 박스 (디버깅용)
    fill(255, 0, 0);
    rect(x, y, 50, 50);
  }
}


function drawDogHPbar(x, y, hp, maxHp) {
  // HP바
  noStroke();
  fill("#EE2C73");
  let hpW = 25;
  rect(x - hpW, y - 80, 2 * hpW, 6);
  fill("#72ECEA");
  let hpWidth = map(hp, 0, maxHp, 0, 2 * hpW);
  // hpWidth가 음수나 초과되지 않게 안전장치
  hpWidth = constrain(hpWidth, 0, 2 * hpW);
  rect(x - hpW, y - 80, hpWidth, 6);
}