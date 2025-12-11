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