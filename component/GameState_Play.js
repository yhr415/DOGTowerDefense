function runInGameLogic() {
    if(isStageActive){
        money += 0.0333
    }
    // 1. 맵과 기본 UI
    hexGrid.draw();
    drawUI();

    // 2. 선택된 타워 사거리 표시
    if (selectedTower && selectedTile) {
        drawSelectedTowerRange();
    }

    // 3. 타워 관리 (업데이트 및 발사)
    for (let row = 0; row < hexGrid.rows; row++) {
        for (let col = 0; col < hexGrid.cols; col++) {
            const tile = hexGrid.tiles[row][col];
            const t = tile.tower;
            if (t) {
                t.update();
                t.show();
                if (towerStats[t.type].canShoot) {
                    t.shoot(enemies);
                } else {
                    // 특수 타워 로직 (block, playground 등)
                    if (t.type === "block") t.block();
                    else if (t.type === "playground") t.play();
                    else if (t.type === "support") t.enhance(tile);
                    else if (t.type === "factory") t.earn();
                }
            }
        }
    }

    // 4. 적 관리 (이동 및 사망 처리)
    for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        e.update();
        e.show();

        if (e.reachedEnd()) {
            enemies.splice(i, 1);
            if (e instanceof Dog) {
                triggerGameOver();
                drawGameOver();
                gameState="GAMEOVER";
                return;
            } else {
                lives--;
                if (lives <= 0) {
                triggerGameOver();
                drawGameOver();
                gameState="GAMEOVER";
                return;
                }
            }
        } else if (e.isDead()) {
            money += 5; score += 10;
            enemies.splice(i, 1);
        }
    }

    // 5. 총알 및 이펙트 업데이트
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.update();
        b.show();
        if (b.hasHit() || b.isOffScreen()) bullets.splice(i, 1);
    }

    for (let i = effects.length - 1; i >= 0; i--) {
        let ef = effects[i];
        ef.update();
        ef.show();
        if (ef.finished) effects.splice(i, 1);
    }

    // 6. 스테이지 완료 체크 로직
    if (gameState !== "GAMEOVER"&&isStageActive && stageManager.isStageOver() && enemies.length === 0) {
        if (rescueData && rescueData.items && rescueData.items.length > 0) {
            const rndIndex = floor(random(rescueData.items.length));
            startApiInfoScreen(rescueData.items[rndIndex]);
        } else {
            showApiInfoScreen = false;
        }
        if (currentStage >= stageDesign.length) {
            gameOver = true;
        }

        // 💡 여기서 handleStageClear를 먼저 불러서 상태를 바꿔줘
        handleStageClear(); 
    }

    // 8. 매니저 업데이트
    if (stageManager.bossPopupText) drawInfo(stageManager.bossPopupText);
    if (isStageActive) stageManager.update();
    else drawStageInfo();

    // 🔥 [해결 포인트] 상점 업데이트와 그리기는 여기서 딱 "한 번만"!
    // currentStage 변수 하나로 통일해서 상점에게 알려주자.
    if (shop) {
        shop.updateAvailableItems(currentStage); 
        shop.draw();
    }

    // 9. 선택된 타워 UI
    if (selectedTower && selectedTile) {
        drawTowerSelectionUI();
    }
    if (draggingItem) {
        drawDraggingItem(); 
    }
}

function handleInGameClick() {
    // 1. 타워 업그레이드/제거 UI 클릭 처리 (우선순위 높음)
    if (handleTowerSelectionUI()) {
        return; // UI 클릭이 처리되었다면 아래 로직 실행 안 함
    }

    // 2. 상점 아이템 클릭 처리
    let shopItem = shop.getItemAt(mouseX, mouseY);
    if (shopItem) {
        if (money >= shopItem.cost) {
            draggingItem = shopItem; // 드래그 시작
            selectedTower = null;
            selectedTile = null;
        } else {
            console.log("돈이 부족합니다!");
        }
        return;
    }

    // 3. 스테이지 시작 버튼 (비활성 상태일 때 클릭하면 시작)
    if (!isStageActive) {
        startNewStage(); // 아까 분리한 스테이지 시작 함수 호출
        return;
    }

    // 4. 필드 위의 타워 선택 처리
    const tile = hexGrid.getTileAt(mouseX, mouseY);
    if (!tile) {
        selectedTower = null;
        selectedTile = null;
        return;
    }

    const tower = tile.tower;
    if (tower) {
        selectedTower = tower;
        selectedTile = tile;
    } else {
        selectedTower = null;
        selectedTile = null;
    }
}

function drawDraggingItem() {
    if (!draggingItem) return;

    push();
    // 1. 마우스 위치로 좌표 이동
    translate(mouseX, mouseY);

    // 2. 사거리 미리보기 (반투명 원)
    // level1Range에 해당 타워의 사거리가 정의되어 있어야 해!
    let range = (typeof level1Range !== 'undefined' && level1Range[draggingItem.type])
        ? level1Range[draggingItem.type] : 150;

    noFill();
    stroke(255, 255, 255, 150); // 반투명 흰색 테두리
    strokeWeight(2);
    ellipse(0, 0, range * 2);   // 사거리 원 그리기

    // 3. 타워 모습 미리보기 (스프라이트 시트 활용)
    const sheet = towerSpriteSheets[draggingItem.type];
    if (sheet) {
        // 1레벨(첫 번째 칸) 이미지를 마우스 위치에 그림
        drawSprite(
            sheet,
            0,          // 1레벨 인덱스
            0, 0,       // 현재 translate된 0,0 위치
            70, 70,     // 크기
            5, 1        // 시트 가로 5칸, 세로 1칸 기준 (형 설정에 맞춰)
        );
    } else {
        // 이미지가 없을 때의 백업 (동그라미)
        fill(draggingItem.color || 'yellow');
        ellipse(0, 0, 40);
    }
    pop();
}