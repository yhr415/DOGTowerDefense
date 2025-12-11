class Dog {
  constructor(path, initialHp, speed, name = 'jindo') {
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
    if(this.playing) return;
    
    // 💡 상태 회복 로직 추가
    if (this.effectTimer > 0) {
      this.effectTimer--;
      // 타이머가 0이 되면 모든 상태와 속도를 원래대로 초기화
      if (this.effectTimer === 0) {
        this.speed = this.baseSpeed;
        this.slowed = false;
        this.speedBoosted = false;
      }
    }

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
    let currentImage;
    if (this.name === 'jindo') currentImage = jindoImg;
    else if (this.name === 'shiba') currentImage = shibaImg;
    else if (this.name === 'pome') currentImage = PomeImg;
    else if (this.name === 'beagle') currentImage = BeagleImg;
    else if (this.name === 'doberman') currentImage = DobermanImg;

    if (currentImage) image(currentImage, this.x, this.y, 170, 170); // 크기 살짝 조정함 (170은 너무 클듯?)
    else { fill(255, 0, 0); rect(this.x, this.y, 32, 32); }

    // HP바
    noStroke();
    fill("#EE2C73");
    let hpW = 25;
    rect(this.x - hpW, this.y - 40, 2 * hpW, 6);
    fill("#72ECEA");
    let hpWidth = map(this.hp, 0, this.maxHp, 0, 2 * hpW);
    // hpWidth가 음수나 초과되지 않게 안전장치
    hpWidth = constrain(hpWidth, 0, 2 * hpW); 
    rect(this.x - hpW, this.y - 40, hpWidth, 6);

    // 상태 텍스트 표시
    if (this.playing){
      text("playing!", this.x, this.y - 70);
    }
    else if (this.slowed){
      fill(100, 150, 255);
      textAlign(CENTER, TOP);
      textSize(12);
      text("❄️", this.x, this.y - 50); // 텍스트 대신 이모지로 깔끔하게
    }
    else if (this.speedBoosted) {
      fill(255, 100, 0);
      text("⚡", this.x, this.y - 50);
    }
  }

  reachedEnd() { return this.current >= this.path.length - 1; }
  isDead() { return this.hp >= this.maxHp; }

  // 💡 수정된 applyEffect
  applyEffect(type, value) {
    // 1. HP 채우기 (기본, 간식, 사랑, 힐)
    // 형 게임이 '만족도 채우기'라면 힐도 += 가 맞을 것 같아서 수정했어.
    // 만약 힐이 '방해' 목적이면 -= 로 다시 바꿔!
    this.hp += value; 
    
    // HP가 Max 넘지 않게 막기 (선택사항)
    if (this.hp > this.maxHp) this.hp = this.maxHp;

    // 2. 특수 효과 처리
    if (type === 'snack') {
        // 이미 부스트 상태가 아닐 때만 속도 증가 (무한 중첩 방지)
        if (!this.speedBoosted) {
            this.speedBoosted = true;
            this.speed = this.baseSpeed * 1.5; // 50% 빨라짐
            this.effectTimer = 60; // 60프레임(약 1초) 동안 유지
        }
    } 
    // Bullet.js에서 slow 타입일 때 호출됨
    else if (type === 'slow') {
        this.getSlowed(0.5); // 50% 느려짐
    }
  }

  takeDamage(d) {
    this.applyEffect('basic', d);
  }

  getSlowed(factor){
    // 이미 느려져 있으면 무시 (중첩 방지)
    if (this.slowed) return;
    
    this.slowed = true;
    this.speed = this.baseSpeed * factor;
    this.effectTimer = 120; // 120프레임(약 2초) 동안 슬로우 유지
  }
}