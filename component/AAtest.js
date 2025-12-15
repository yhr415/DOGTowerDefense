//1216 Update : 엔딩 화면 테스트를 위한 코드입니다
//개발 완료 시 지울 예정입니다. 켜져있으면 main에서 주석처리해주세용 -해리
function drawtestButton1(){
    let x=width*(0.38);
    let y=height*(0.1);
    let w=width*(0.1);
    let h=height*(0.1);
    fill(orangefill);
    rect(x,y,w,h);
    fill(navy2);
    text("clear",x,y,w,h);
}
function drawtestButton2(){
    let x=width*0.52;
    let y=height*(0.1);
    let w=width*(0.1);
    let h=height*(0.1);
    fill(orangefill);
    rect(x,y,w,h);
    fill(navy2);
    text("over",x,y,w,h);
}


function clicktestButton(){
    if(mouseX>(width*0.38) && mouseX<(width*0.48)){
        if(mouseY>(height*0.1)&&mouseY<(height*0.2)){
            triggerGameClear();
        }
    }

    if(mouseX>(width*0.52) && mouseX<(width*0.62)){
        if(mouseY>(height*0.1)&&mouseY<(height*0.2)){
            triggerGameOver();
        }
    }
}