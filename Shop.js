class Shop {
    constructor(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      
      // 판매할 타워 목록
      this.items = [
        { name: "치유 타워", type: "heal", cost: 50, color: [0, 200, 255] },
        // 추후 타워 종류가 늘어나면 여기에 추가
        // { name: "스나이퍼", type: "sniper", cost: 100, color: [255, 50, 50] } 
      ];
      
      this.itemSize = 50; // 상점 아이콘 크기
      this.padding = 20;
    }
  
    draw() {
      // 1. 상점 배경 (UI)
      fill(30, 30, 40, 200); // 반투명 검정 배경
      stroke(200);
      strokeWeight(2);
      rect(this.x, this.y, this.w, this.h, 10);
  
      // 2. 상점 타이틀
      noStroke();
      fill(255);
      textAlign(CENTER, TOP);
      textSize(16);
      text("SHOP", this.x + this.w / 2, this.y + 10);
  
      // 3. 판매 아이템 그리기
      textAlign(CENTER, CENTER);
      for (let i = 0; i < this.items.length; i++) {
        let item = this.items[i];
        let ix = this.x + this.padding + (i * (this.itemSize + this.padding));
        let iy = this.y + 40; // 타이틀 아래
  
        // 아이콘 배경
        fill(50);
        stroke(100);
        rect(ix, iy, this.itemSize, this.itemSize, 5);
  
        // 타워 미리보기 (이미지가 있으면 image() 함수 사용)
        noStroke();
        fill(item.color); 
        ellipse(ix + this.itemSize/2, iy + this.itemSize/2, 30);
  
        // 가격 표시
        fill(255);
        textSize(12);
        text(`$${item.cost}`, ix + this.itemSize/2, iy + this.itemSize + 15);
        
        // 아이템 좌표 저장 (클릭 감지용)
        item.x = ix;
        item.y = iy;
        item.w = this.itemSize;
        item.h = this.itemSize;
      }
    }
  
    // 마우스 클릭 시 어떤 아이템을 잡았는지 리턴
    getItemAt(mx, my) {
      for (let item of this.items) {
        if (mx > item.x && mx < item.x + item.w &&
            my > item.y && my < item.y + item.h) {
          return item;
        }
      }
      return null;
    }
  }