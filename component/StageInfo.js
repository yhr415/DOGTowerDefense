function drawStageInfo() { //Stage가 끝날 때 뜨는 화면

if (currentStage === 0) {
  fill(255, 200);
    rect(width / 4, height / 4, width / 2, height / 2, 10);
    fill(0);
    textAlign(CENTER, TOP);
    textSize(24);
    textFont(title_text);
    text("튜토리얼", width / 2, height / 4 + 16);
    textSize(16);

} else if (currentStage > 0) {
    fill(255, 200);
    rect(width / 4, height / 4, width / 2, height / 2, 10);
    fill(0);
    textAlign(CENTER, TOP);
    textSize(24);
    textFont(title_text);
    text(`STAGE ${currentStage}`, width / 2, height / 4 + 16);
  
    textSize(16);
}
    // stageDesign 사용
    // currentstage를 입력값으로 사용
    let design = stageDesign[currentStage];
    if (currentStage === 0) {
      text(`튜토리얼 스테이지입니다.`, width / 2, height / 4 + 60);
      return;
    }
    else if (design) {
      textFont(body_text);
      text(`강아지: ${design.type} x ${design.count}`, width / 2, height / 4 + 60);
      text(`보상: $${design.stageReward}`, width / 2, height / 4 + 90);
      text(`정보: ${design.fact}`, width / 2, height / 4 + 120);
    }
  
    textSize(14);
    text("클릭해서 시작", width / 2, height / 4 + 160);
  }
