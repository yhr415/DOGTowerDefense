/////drawUI와 drawIndicator 함수
//drawUI는 실제 게임 내 UI를 전부 그리는 함수
//drawIndicator는 tower 아래 레벨 표시하는 동그라미 그리는 함수

function drawUI() { 
    noStroke();
    fill(255);
    textAlign(LEFT, TOP);
    textSize(14);
    if (typeof body_text !== 'undefined') textFont(body_text);

    // 왼쪽에 표시할 데이터들
    const uiList = [
        { type: 'heart', count: lives },            // 하트는 타입으로 구분
        { type: 'text', content: `Score : ${score}` },
        { type: 'text', content: `Stage : ${min(currentStage + 1, stageDesign.length)}` }
    ];

    // 배치 설정 변수
    const startX = 10;
    const startY = 10;
    const paddingY = 18; // 줄 간격

    // draw 반복문
    for (let i = 0; i < uiList.length; i++) {
        let item = uiList[i];
        let currentY = startY + (i * paddingY); // Y 좌표 자동 계산

        if (item.type === 'heart') {
            text(`Live : ${lives}`, startX, currentY)
            // 하트 그리기 (가로 반복)
            let heartPadding = 15;
            for (let h = 0; h < item.count; h++) {
                text("❤️", startX +50+ (h * heartPadding), currentY+2);
            }
        } else {
            // 일반 텍스트 그리기
            text(item.content, startX, currentY);
        }
    }
}

function drawIndicator(level,x,y) {
    let indicatorSize = 6;  // 동그라미 크기
    let spacing = 8;        // 동그라미 간격
    let totalWidth = (level * indicatorSize) + ((level - 1) * (spacing - indicatorSize)); 
    // 그냥 간편하게: (개수 * 간격)에서 중앙 정렬 보정
    
    // 중앙 정렬을 위한 시작 X 좌표 계산
    // (level이 1이면 0, 2면 -4, 3이면 -8... 이런 식으로 좌우로 벌림)
    let startX = x - ((level - 1) * spacing) / 2;
    let startY = y + 35; 

    noStroke();
    for (let i = 0; i < level; i++) {
      // 5레벨(만렙)이면 금색(황금별), 아니면 은색/흰색
      if (level === 5) fill(255, 215, 0); // Gold
      else fill(200, 230, 255); // Silver/White
      
      // 약간의 테두리를 주면 더 잘 보임
      stroke(0, 100); 
      strokeWeight(1);
      
      ellipse(startX + (i * spacing), startY, indicatorSize);
    }
}