function drawUI() { //게임 기본 UI 그리기
    noStroke();
    fill(255);
    textAlign(LEFT, TOP);
    textSize(14);
    textFont(body_text);
    text(`🪙 ${money} g`, 10, 10);
    text(`Lives: ${lives}`, 10, 30);
    text(`Score: ${score}`, 10, 50);
    // stageDesign 사용
    text(`Stage: ${min(currentStage + 1, stageDesign.length)}`, 10, 70);
  
    textAlign(RIGHT, TOP);
    text(`Tower Cost: $${towerCost}`, width - 10, 10);
    
    // stageDesign 사용
    let nextDog = stageDesign[currentStage];
    if (nextDog) {
      textAlign(RIGHT, TOP);
      fill(255, 200, 50);
      // type 대신 name이 없으므로 type을 표시하거나 이름을 추가해야 함
      text(`NEXT: ${nextDog.type}`, width - 10, 30);
      fill(255);
    }
  }