function drawStageInfo() { //Stage가 끝날 때 뜨는 화면

  if (currentStage === 0) {
    fill(pink1);
    textAlign(CENTER, TOP);
    textSize(60);
    textFont(title_text);
    stroke(pink2);
    strokeWeight(5);
    text("튜토리얼", width / 2, height / 4 + 16);
    textSize(24);
    noStroke();

  } else if (currentStage > 0) {
    fill(pink1);
    textAlign(CENTER, TOP);
    textSize(60);
    textFont(title_text);
    stroke(pink2);
    strokeWeight(5);
    text(`STAGE ${currentStage}`, width / 2, height / 4 + 16);
    noStroke();
    textSize(24);
  }
  // stageDesign 사용
  // currentstage를 입력값으로 사용
  let design = stageDesign[currentStage];
  if (currentStage === 0) {
    fill(navy2);
    textFont(body_text);
    text(`유기견 타워 디펜스에 어서오세요! \n간단한 튜토리얼 스테이지부터 시작해볼까요?`, width / 2, height / 4 + 120);
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
