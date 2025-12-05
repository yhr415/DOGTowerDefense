class Dog {
  // stage manager에서 이름 등의 속성을 받아옴 //
  constructor(path, initialHp, speed, name = 'jindo') {
    this.path = path;
    this.current = 0;
    this.x = path[0].x;
    this.y = path[0].y;
    this.maxHp = initialHp; // 최대 HP (목표치)
    this.hp = 0;          // HP를 0에서 시작하도록 초기화
    this.speed = speed;
    this.name = name;
    this.w = 32;
    this.h = 32;
  }

  // dog update method //
  update() {
    if (this.current >= this.path.length - 1) return;
    let target = this.path[this.current + 1];
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const distToTarget = sqrt(dx * dx + dy * dy);

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
    let currentImage;
    if (this.name === 'jindo') {
      currentImage = jindoImg;
    } else if (this.name === 'shiba') {
      currentImage = shibaImg;
    } else if (this.name === 'pome') {
      currentImage = PomeImg;
    } else if (this.name === 'beagle') {
      currentImage = BeagleImg;
    } else if (this.name === 'doberman') {
      currentImage = DobermanImg;
    }

    if (currentImage) {
      image(currentImage, this.x, this.y, 170, 170);
    } else {
      fill(255, 0, 0);
      image(jindoImg, this.x, this.y, 100, 100);
    }

    // HP바 design//
    // HP가 0에서 maxHp까지 '채워지도록' 그려집니다.
    noStroke();
    fill("#EE2C73");
    let hpW = 25;
    rect(this.x - hpW, this.y - 80, 2 * hpW, 6);
    fill("#72ECEA");
    let hpWidth = map(this.hp, 0, this.maxHp, 0, 2 * hpW);
    rect(this.x - hpW, this.y - 80, hpWidth, 6);
  }

  reachedEnd() { return this.current >= this.path.length - 1; }

  // 강아지의 HP가 최대치(maxHp)에 도달하면 제거됨
  isDead() { return this.hp >= this.maxHp; }

  // 타워에 맞으면 강아지 hp 증가하는 logic. 
  applyEffect(type, value) {
    if (type === 'basic' || type === 'snack' || type === 'love') {
      // 기본, 간식(Snack), 사랑(Love)은 HP를 증가시키는 효과
      // 간식과 사랑은 관통/유도 기능을 가질 뿐, 강아지 입장에서는 '맞으면 HP가 차는' 행위임.
      this.hp += value;

      // 간식(Snack)의 추가 효과 (예시: 속도 일시 증가)
      if (type === 'snack') {
        this.speed *= 1.05; // 간식 먹고 잠깐 빨라짐
        // 속도 초기화 로직은 update()에 추가하거나 별도의 타이머로 관리해야 함.
      }

    } else if (type === 'heal') {
      // 치유(Heal) 타워는 HP를 감소(목표치에서 멀어지게) 시킴
      this.hp -= value;
      this.hp = max(0, this.hp); // HP가 0 아래로 내려가지 않게 보호
    }
  }

  // ⚠️ 기존의 takeDamage 함수는 Bullet 클래스에서 호출될 수 있으므로,
  // 임시로 applyEffect로 연결해주는 게 안전함.
  takeDamage(d) {
    // Bullet.hasHit()의 기본 간식/사랑 로직에서 호출되도록 연결
    this.applyEffect('basic', d);
  }
}