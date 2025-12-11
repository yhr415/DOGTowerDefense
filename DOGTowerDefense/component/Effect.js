class Effect {
    // 💡 생성자에 'size' 파라미터 추가! (맨 뒤나 중간 편한 곳에)
    constructor(x, y, spriteSheet, totalFrames, cols, rows, w,h, speed = 3) {
      this.x = x;
      this.y = y;
      this.spriteSheet = spriteSheet;
      
      this.totalFrames = totalFrames;
      this.cols = cols;
      this.rows = rows;
      
      // 전달받은 크기 : 지름 크기
      this.w=w||64;
      this.h=h||64; // 전달 값이 없으면 64를 기본값으로
  
      this.speed = speed;
      this.currentFrame = 0;
      this.finished = false;
      this.timer = 0;
    }
  
    update() {
      this.timer++;
      if (this.timer % this.speed === 0) {
        this.currentFrame++;
      }
      if (this.currentFrame >= this.totalFrames) {
        this.finished = true;
      }
    }
  
    show() {
      // drawSprite에 this.size로 입력받음
      // explosive tower의 경우 this size를 배열에서 받아와서 넣으면 됨
      drawSprite(
        this.spriteSheet, 
        this.currentFrame, 
        this.x, this.y, 
        this.w, this.h, // 너비, 높이를 받아온 사이즈로!
        this.cols,this.rows
      );
    }
  }