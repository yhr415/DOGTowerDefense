let dog
let velocity = [1, 2, 3.5, 5]

// let dogImages = {};  // 객체로 정리

// function preload() {
//   dogImages = {
//     shiba: {
//       normal: loadImage("shiba_normal.png"),
//       sick: loadImage("shiba_sick.png"),
//       happy: loadImage("shiba_happy.png")
//     },
// //    poodle: {
// //      normal: loadImage("poodle_normal.png"),
// //      sick: loadImage("poodle_sick.png"),
// //      happy: loadImage("poodle_happy.png")
// //    }
//   };
// }


class Enemy {
  constructor(_r, _y, _velocity, _maxHealth, _species, _attribute) {
    this.r = _r;
    this.x = -_r;
    this.y = _y;
    this.maxHealth = _maxHealth;
    this.health = 0;  // 체력 0에서 시작  // 최대 체력 저장
    this.active = true;

    this.velocity = _velocity;
    this.species = _species;     // 예: "shiba"
    this.attribute = _attribute; // 기본 속성: "normal"
  }

    move() {
    if (!this.active) return;
    this.x += this.velocity;
  }

  show() {
    if (!this.active) return;

    this.updateAttribute();  // HP 상태에 따라 속성 변경
    let img = this.getImage();

    if (img) {
      imageMode(CENTER);
      image(img, this.x, this.y, this.r * 2, this.r * 2);
    } else {

    // 이미지가 없으면 fallback으로 빨간 원
    fill(255, 50, 50);
    noStroke();
    ellipse(this.x, this.y, this.r * 2);
    }
    
    // 체력바 (체력 증가형)
    noStroke()
    fill(255);  
    rect(this.x - 20, this.y - 25, 40, 5); // 흰색 배경

    fill(0, 255, 0);
    rect(this.x - 20, this.y - 25, 40 * (this.health / this.maxHealth), 5);
  }

  reachedEnd() {
    return this.x > width + this.r;
  }

  // 체력 증가 함수
  heal(amount) {
    if (!this.active) return;

    this.health += amount;
    this.health = min(this.health, this.maxHealth);  // 최대 체력 넘지 않게

    if (this.health === this.maxHealth) {
      this.disappear(); // 체력이 꽉 차면 사라짐
    }
  }

  disappear() {
    this.active = false;
  }

  isFull() {
    return this.health >= this.maxHealth;
  }
  // HP따라 외형 변화
  updateAttribute() {
    let ratio = this.health / this.maxHealth;

    if (ratio < 0.33) {
      this.attribute = "sick";
    } else if (ratio < 0.66) {
      this.attribute = "normal";
    } else {
      this.attribute = "happy";
    }
  }
    //이미지 선택 함수

    getImage() {
    // dogImages[종][속성]
    let set = dogImages[this.species];

    if (!set) return null;
    return set[this.attribute] || null;
  }
}