//1. 스테이지 → 외형 태그
const STAGE_APPEARANCE_TAGS = {
    0: ["백색"],
    1: ["백색", "흑색"],
    2: ["백색"],
    3: ["황색", "황백색"],
    4: ["흑황백색", "믹스", "흑색"],
    5: ["황색", "흑황백색", "믹스"]
  };
  
  //2. 필터링 로직 
  function filterApiItemsByStage(items, stageIndex) {
    const allowed = STAGE_APPEARANCE_TAGS[stageIndex];
    if (!allowed || !Array.isArray(items)) return [];
  
    return items.filter(item => {
      if (!item.hairColor) return false;
      return allowed.some(tag => item.hairColor.includes(tag));
    });
  }
  
  // 3. API 화면 진입
  function enterApiInfoStage(stageIndex) {
    stageIndex = Number(stageIndex); // 타입 방어
  
    if (!Array.isArray(rescueData?.items)) {
      console.warn("apiItems not loaded yet");
      return;
    }
  
    const filtered = filterApiItemsByStage(rescueData.items, stageIndex);
  
    console.log(
      "STAGE", stageIndex,
      "FILTERED:", filtered.map(i => i.hairColor)
    );
  
    if (filtered.length === 0) {
      console.warn("No API item for stage", stageIndex);
      return;
    }
  
    // 파싱 순서 유지
    const selectedItem = filtered[0];
  
    currentApiItem = null; // 이전 stage 잔존 방지
    startApiInfoScreen(selectedItem);
  
    gameState = "API";
  }
  