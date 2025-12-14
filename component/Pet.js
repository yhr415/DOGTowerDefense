class Pet {
  // stage manager에서 이름 등의 속성을 받아옴 //
  constructor(path, initialHp, speed, name = 'pome') { 
    this.path = path;
    this.current = 0;
    this.x = path[0].x;
    this.y = path[0].y;
    this.maxHp = initialHp; 
    this.hp = 0;          
    
    // 💡 [핵심] 원래 속도 기억 (나중에 돌아오기 위함)
    this.baseSpeed = speed; 
    this.speed = speed;
    
    this.name = name;
    this.w = 32;
    this.h = 32;
    
    // 상태 관리 플래그
    this.slowed = false;
    this.speedBoosted = false;
    this.playing = false;
    
    // 💡 효과 지속 타이머 (0이 되면 상태 복구)
    this.effectTimer = 0;
    this.currentEffect = 'walk'; // 모션 상태
    
    this.playStartTime = 0;
    this.randomOffset = floor(random(100)); // 애니메이션 엇박자
  }

  // dog update method //
  update() {
    // 💡 [상태 회복 로직] 타이머가 돌고 있으면 줄여주고, 0이 되면 원상복구
    if (this.effectTimer > 0) {
      this.effectTimer--;
      if (this.effectTimer === 0) {
          this.speed = this.baseSpeed;
          this.slowed = false;
          this.speedBoosted = false;
          this.playing = false
          this.currentEffect = 'walk';
      }
    }

    if (this.playing) return;

    if (this.current >= this.path.length-1) return;
    let target = this.path[this.current+1];
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const distToTarget = sqrt(dx*dx + dy*dy); 
    
    // 목표 지점에 거의 도달했을 때
    if (distToTarget < this.speed) {
      this.x = target.x;
      this.y = target.y;
      this.current++;
    } else {
      // 목표를 향해 이동
      this.x += dx / distToTarget * this.speed;
      this.y += dy / distToTarget * this.speed;
    }
  }

  show() {
    // 🎨 [애니메이션] 스프라이트 시트가 있으면 그걸 쓰고, 없으면 기존 이미지 사용
    // (나중에 펫 전용 스프라이트 시트 만들면 자동으로 적용됨)
    let prefix = this.name;
    let currentSheet; 
    let totalFrames = 4; 
    let cols = 4;

    // 1. 상태에 따른 스프라이트 시트 찾기 시도
    if (this.currentEffect === 'heal') {
        currentSheet = window[prefix + 'HealSpriteSheet']; 
        totalFrames = 20; cols = 5;
    } else if (this.currentEffect === 'love') {
        currentSheet = window[prefix + 'LoveSpriteSheet'];
        totalFrames = 6; cols = 3;
    } else {
        currentSheet = window[prefix + 'WalkSpriteSheet'];
    }

    // 2. 스프라이트가 있으면 애니메이션 그리기
    if (currentSheet) {
        let myFrameIndex = floor((frameCount + this.randomOffset) / 5) % totalFrames;
        drawSprite(currentSheet, myFrameIndex, this.x, this.y, 40, 40, cols);
    } 
    // 3. 없으면 형이 설정한 정지 이미지 그리기 (백업)
    else {
        let currentImage;
        if(this.name === 'jindo') currentImage = window.petPome; // 전역변수 참조
        else if(this.name === 'shiba') currentImage = window.petPome;
        else if(this.name === 'pome') currentImage = window.petPome || window.PomeImg; // 변수명 안전장치
        else if(this.name === 'beagle') currentImage = window.petPome;
        else if(this.name === 'doberman') currentImage = window.petPome;
        
        if (currentImage) {
            image(currentImage, this.x, this.y, 70, 70); // 펫이니까 조금 작게 (100은 너무 큼)
        } else {
            fill(255, 0, 0); 
            rect(this.x, this.y, 60, 60);
        }
    }

    // HP바 design (Dog랑 깔맞춤)
    noStroke();
    fill("#EE2C73"); 
    rect(this.x - 16, this.y - 50, 32, 4); 
    fill("#72ECEA"); 
    let hpWidth = map(this.hp, 0, this.maxHp, 0, 32);
    hpWidth = constrain(hpWidth, 0, 32); // 범위 넘지 않게
    rect(this.x - 16, this.y - 50, hpWidth, 4);

    if (this.playing){
      strokeWeight(3);
      stroke(0)
      fill(255, 0, 0)
      textAlign(CENTER, TOP);
      textSize(18);
      text("playing!", this.x, this.y - 70)
    }
    else if (this.slowed){
      textAlign(CENTER, TOP);
      textSize(18);
      text("❄️", this.x, this.y - 60) // 이모지로 교체
    }
    else if (this.speedBoosted) {
      textAlign(CENTER, TOP);
      textSize(18);
      text("⚡", this.x, this.y - 60)
    }
  }
  
  reachedEnd() { return this.current >= this.path.length-1; }
  isDead() { return this.hp >= this.maxHp; } 
  
  // 🔥 [핵심 Fix] applyEffect 함수 추가!
  // 이게 없어서 에러가 났던 거야. Dog랑 똑같이 맞춰줬어.
  applyEffect(type, value, abilityFactor) {
      this.hp += value;
      if (this.hp > this.maxHp) this.hp = this.maxHp;

      // 상태별 모션 (스프라이트 있으면 작동)
      if (type === 'heal' || type === 'love') {
          this.currentEffect = type;
          this.effectTimer = 30;
      }

      // 특수 효과
      if (type === 'snack' && !this.slowed && !this.playing) {
        this.getBoosted(abilityFactor)
      }
      else if (type === 'slow') {
        this.getSlowed(abilityFactor);
      }
      else if (type === "playground"){
        this.getPlayed(abilityFactor)
      }
  }

  getBoosted(factor){
    this.speedBoosted = true;
    this.speed = this.baseSpeed * factor;
    this.effectTimer = 50;
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