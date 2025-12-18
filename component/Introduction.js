function drawIntroduction() {
    push();
    background(20, 20, 30,50);

    // 1. 게임 제목
    textAlign(CENTER, CENTER);
    textFont(title_text);
    textStyle(BOLD);
    stroke(pink2);
    strokeWeight(2);
    fill(pink1); // 골드색
    textSize(80);
    text("유기견 타워 디펜스", width / 2, height / 2 - 50);

    // 2. 깜빡이는 "게임 시작하기" 
    // frameCount를 30으로 나눈 나머지가 15보다 작을 때만 보여줌 (0.5초 간격)
    if (frameCount % 60 < 30) {
        fill(255);
        textSize(30);
        noStroke();
        textFont(body_text);
        textStyle(NORMAL);
        text("유기견 구하러 가기", width / 2, height / 2 + 150);
    }

    pop();
}

function drawGameBackground(manual) {
    push();
    rectMode(CENTER);
    fill(navy2_80);
    stroke(pink2);
    strokeWeight(2);
    rect(width / 2, height / 2, 800, 500, 20);

    noStroke();
    textAlign(CENTER, TOP);
    fill(pink1);
    textFont(title_text);
    textSize(50);
    text("유기견 타워 디펜스", width / 2, height / 2 - 200);

    textAlign(LEFT, TOP);
    fill(230);
    textSize(20);
    textFont(body_text);
    text(manual, width / 2, height / 2+120, 700, 400);

    // 4. 하단 안내
    textAlign(CENTER, CENTER);
    fill(pink2);
    text("클릭해서 다음으로...", width / 2, height / 2 + 200);

    pop();
}