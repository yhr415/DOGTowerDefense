class Dog {
  // stage manager에서 이름 등의 속성을 받아옴 //
  constructor(path, initialHp = 5, name = 'jindo') { 
    this.path = path;
    this.current = 0;
    this.x = path[0].x;
    this.y = path[0].y;
    this.maxHp = initialHp; // 최대 HP (HP바를 위해)
    this.hp = initialHp;
    this.speed = 1.5;
    this.name = name;
    this.w = 32;
    this.h = 32;
  }

  // dog update method //
  update() {
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
    let currentImage;
    if(this.name === 'jindo') {
      currentImage = jindoImg;
    } else if(this.name === 'shiba') {
      currentImage = shibaImg;
    } else if(this.name === 'pome') {
      currentImage = PomeImg;
    } else if(this.name === 'beagle') {
      currentImage = BeagleImg;
    } else if(this.name === 'doberman') {
      currentImage = DobermanImg;
    }
    
    if (currentImage) {
        image(currentImage, this.x, this.y, 70, 70); 
    } else {
        fill(255, 0, 0); 
        image(jindoImg,this.x, this.y, 32, 32);
    }

    // HP바 design//
    noStroke();
    fill(255, 0, 0, 150); 
    rect(this.x - 16, this.y - 25, 32, 4); 
    fill(0, 255, 0); 
    let hpWidth = map(this.hp, 0, this.maxHp, 0, 32);
    rect(this.x - 16, this.y - 25, hpWidth, 4);
  }
  
  reachedEnd() { return this.current >= this.path.length-1; }
  isDead() { return this.hp <= 0; }
  takeDamage(d) { this.hp -= d; }
}