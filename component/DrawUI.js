/////drawUI
//drawUI : 게임 중 지속되는 UI그리는 함수
//drawInfo (12/15 update) : 게임 중 팝업으로 띄워주는 게임 관련 설명들 그리는 함수
//drawHowtoTower() : 타워 설치 0개일때! 띄워주는 함수

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
        { type: 'text', content: `Stage : ${min(currentStage, stageDesign.length)}` }
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
                text("❤️", startX + 50 + (h * heartPadding), currentY + 2);
            }
        } else {
            // 일반 텍스트 그리기
            text(item.content, startX, currentY);
        }
    }
}

function drawInfo(information) {
    let outMarginX=width*0.05;
    let txtMarginX=width*0.03;
    let txtMarginY=height*0.03;
    let outMarginY=height*0.7;
    let headerH=height*0.04;

    rectMode(CORNER);
    fill(orangefill);
    stroke(orangeline); //주황색 라인
    strokeWeight(3);
    rect(outMarginX, outMarginY, width-2*outMarginX, height * (0.2), 8); //주황색 제목 영역
    fill(y1);
    rect(outMarginX, outMarginY+headerH, width -2*outMarginX, height * (0.15), 0, 0, 8, 8); //노란색 영역
    textAlign(LEFT,TOP);
    textSize(16);
    noStroke();
    textFont(body_text);
    fill(navy2);
    text(information,outMarginX+txtMarginX,outMarginY+headerH+txtMarginY,width-2*(outMarginX+txtMarginX),height*0.13);
}

function drawHowtoTower(){
    //arrow를 그리는 부분
    //글씨를 그리는... 부분 : 타워를 설치해 배고픈 유기견들에게 밥을 주세요!
    text("타워를 설치해 배고픈 유기견들에게 밥을 주세요!");
    text("타워는 강아지가 지나가는 경로 밖에 설치할 수 있습니다.")
}
