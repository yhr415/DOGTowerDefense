function loadeverything(){

dogPics['jindo'] = dogPics['jindo'] || {};
dogPics['jindo']['white'] = dogPics['jindo']['white'] || {};
dogPics['jindo']['white']['sad'] = loadImage('data/dog/WhiteJindoSad.png');
dogPics['jindo']['white']['neutral'] = loadImage('data/dog/WhiteJindoNeutral.png');
dogPics['jindo']['white']['happy'] = loadImage('data/dog/WhiteJindoHappy.png');

// --- 포메 (화이트 & 브라운) ---
dogPics['pome'] = dogPics['pome'] || {};
dogPics['pome']['white'] = dogPics['pome']['white'] || {}; // 화이트 객체 생성
dogPics['pome']['brown'] = dogPics['pome']['brown'] || {}; // 🔥 [중요] 브라운 객체도 생성!
dogPics['pome']['white']['sad'] = loadImage('data/dog/white_pome.png');
dogPics['pome']['white']['neutral'] = loadImage('data/dog/white_pome.png');
dogPics['pome']['white']['happy'] = loadImage('data/dog/white_pome.png');
dogPics['pome']['brown']['sad'] = loadImage('data/dog/brown_pome.png');
dogPics['pome']['brown']['neutral'] = loadImage('data/dog/brown_pome.png');
dogPics['pome']['brown']['happy'] = loadImage('data/dog/brown_pome.png');

// --- 리트리버 ---
dogPics['retriever'] = dogPics['retriever'] || {};
dogPics['retriever']['gold'] = dogPics['retriever']['gold'] || {};
dogPics['retriever']['gold']['sad'] = loadImage('data/dog/golden_Retriever.png');
dogPics['retriever']['gold']['neutral'] = loadImage('data/dog/golden_Retriever.png');
dogPics['retriever']['gold']['happy'] = loadImage('data/dog/golden_Retriever.png');

// --- 블랙 리트리버 ---
dogPics['blackretriever'] = dogPics['blackretriever'] || {};
dogPics['blackretriever']['black'] = dogPics['blackretriever']['black'] || {};
dogPics['blackretriever']['black']['sad'] = loadImage('data/dog/black_Retriever.png');
dogPics['blackretriever']['black']['neutral'] = loadImage('data/dog/black_Retriever.png');
dogPics['blackretriever']['black']['happy'] = loadImage('data/dog/black_Retriever.png');

// --- 보더콜리 & 푸들 (같은 방식으로 쭉!) ---
dogPics['bordercollie'] = dogPics['bordercollie'] || {};
dogPics['bordercollie']['blackandwhite'] = dogPics['bordercollie']['blackandwhite'] || {};
dogPics['bordercollie']['blackandwhite']['sad'] = loadImage('data/dog/border.png');
dogPics['bordercollie']['blackandwhite']['neutral'] = loadImage('data/dog/border.png');
dogPics['bordercollie']['blackandwhite']['happy'] = loadImage('data/dog/border.png');

dogPics['poodle'] = dogPics['poodle'] || {};
dogPics['poodle']['brown'] = dogPics['poodle']['brown'] || {};
dogPics['poodle']['brown']['sad'] = loadImage('data/dog/brown_poodle.png');
dogPics['poodle']['brown']['neutral'] = loadImage('data/dog/brown_poodle.png');
dogPics['poodle']['brown']['happy'] = loadImage('data/dog/brown_poodle.png');


shibaImg = loadImage('data/jindo.png');
PomeImg = loadImage('data/jindo.png');
BeagleImg = loadImage('data/jindo.png');
DobermanImg = loadImage('data/jindo.png');
petPome = loadImage('data/pome.png');
//배경 이미지 로딩
backgrnd = loadImage('data/dtdBackgrnd.png');
backgrndGameover = loadImage('data/gameOver.png');
//icon loading
iconCoin = loadImage('data/coin_icon.png');
//effect loading
healGreen20 = loadImage('data/effect/healGreen20.png');
healYellow5 = loadImage('data/effect/healYellow5.png');
heartEffect5 = loadImage('data/effect/heartEffect.png');
//bullet loading
bulletimgs['love'] = loadImage('data/bullet/heartbullet.png');
bulletimgs['snack'] = loadImage('data/bullet/snackbullet.png');
//tower loading
towerSpriteSheets["heal"] = loadImage('data/tower/heal.png');
towerSpriteSheets["snack"] = loadImage('data/tower/snack.png');
towerSpriteSheets["love"] = loadImage('data/tower/love.png');
towerSpriteSheets["block"] = loadImage('data/tower/block.png');
towerSpriteSheets["factory"] = loadImage('data/tower/gold.png');
towerSpriteSheets["support"] = loadImage('data/tower/support.png');
towerSpriteSheets["slow"] = loadImage('data/tower/bath.png');
towerSpriteSheets["antiTanker"]=loadImage('data/tower/anti.png');
towerSpriteSheets["playground"]=loadImage('data/tower/playground.png');

frame=loadImage('data/frame.png');

rescueData = loadJSON('data/daejeon_dog.json');

//음악
//bgm
bgm = loadSound('data/sound/hyperpop.wav');
bgmFail = loadSound('data/sound/rescue_failed.wav');
bgmClear = loadSound('data/sound/gameEndBGM.wav');
fxsounds["click"] = loadSound('data/sound/click.wav');
fxsounds["hit"] = loadSound('data/sound/뿅뿅.wav');
fxsounds["money"] = loadSound('data/sound/돈소리.wav');
fxsounds["eat"] = loadSound('data/sound/eat.wav');

// 효과음이 겹칠 때마다 새로운 AudioBufferSource를 무한 생성하는 것을 방지
// (p5.sound play() 기본동작이 중첩 재생이라 노드 폭증 -> 끊김/멈춤 발생)
["click", "hit", "money", "eat"].forEach((key) => {
  if (fxsounds[key]?.playMode) {
    fxsounds[key].playMode("restart"); // 동일 소스 재사용
  }
});
}