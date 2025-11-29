let dog
let velocity = [1, 2, 3.5, 5]

let dogImages = {};  // 객체로 정리

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
  constructor(path) {
    this.path = path;
    this.current = 0;
    this.x = path[0].x;
    this.y = path[0].y;
    this.hp = 5;
    this.speed = 1.5;
  }

  update() {
    if (this.current >= this.path.length-1) return;
    let target = this.path[this.current+1];
    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const distToTarget = sqrt(dx*dx + dy*dy);
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
    fill(200, 0, 0);
    noStroke();
    ellipse(this.x, this.y, 16);
  }

  reachedEnd() { return this.current >= this.path.length-1; }
  isDead() { return this.hp <= 0; }
  takeDamage(d) { this.hp -= d; }
}
