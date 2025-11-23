🚀 우리 팀을 위한 [Cursor + GitHub] 시작 가이드
다들 안녕! 우리 프로젝트 개발을 위해 **'Cursor(커서)'**라는 AI 에디터랑 **'GitHub(깃허브)'**를 사용할 거야. 처음엔 낯설 수 있는데, 이 가이드대로 딱 5분만 투자하면 바로 시작할 수 있어! 천천히 따라와 줘.

1️⃣ Cursor 설치
Cursor 설치 (필수)

https://cursor.com/ 여기 들어가서 Download 버튼 누르고 설치해 줘.

(VS Code랑 똑같은데 AI 기능이 내장된 엄청 좋은 툴이야!)
(VS Code가 깔려있고, 더 익숙하다면 VS Code 사용해도 됨)

Git 설치 (필수)

Cursor만 깔면 안 되고, 'Git'이라는 배달부도 깔아야 해.

윈도우: https://git-scm.com/download/win (그냥 계속 Next 눌러서 설치)

맥(Mac): 터미널 열고 git 이라고 치면 설치하라고 뜰 거야. (혹은 이미 깔려있음)

2️⃣ Cursor랑 깃허브 연결하기
Cursor한테 "나 깃허브 아이디 있어!"라고 알려주는 과정이야.

Cursor 실행

화면 오른쪽 상단에 있는 톱니바퀴 아이콘(⚙️ Settings) 클릭.

General 혹은 Account 탭에서 Sign in 버튼 클릭.

GitHub로 로그인하면 연결 끝!

3️⃣ 프로젝트 가져오기 (Clone)
이제 우리 팀의 코드를 내 컴퓨터로 다운로드 받자.

Cursor에서 키보드로 Ctrl + Shift + P (맥은 Cmd + Shift + P) 를 눌러.

(이게 '만능 검색창'이야, 꼭 기억해!)

검색창에 Git: Clone 이라고 치고 엔터!

입력창에 아래 주소를 복사해서 붙여넣고 엔터!

👉 주소: [https://github.com/yhr415/DOGTowerDefense.git]

저장할 폴더를 선택하면 다운로드가 시작돼.

다운 다 되면 오른쪽 아래에 뜨는 Open 버튼 클릭!

4️⃣ 나만의 작업 공간 만들기 (Branch) ★중요★
절대로 main에서 바로 작업하면 안 돼! 서로 코드가 꼬일 수 있어. 반드시 **'내 전용 연습실(브랜치)'**을 만들어서 작업해야 해.

Cursor 화면 왼쪽 맨 아래 구석을 봐봐. main (또는 master)이라고 적힌 작은 글씨 클릭.

메뉴 맨 위에 Create new branch... 클릭.

브랜치 이름을 적고 엔터.

규칙: feat/작업내용 (예: feat/dog-feature-fix, feat/tower-attack)

왼쪽 아래 글씨가 내가 만든 이름으로 바뀌었으면 성공!

5️⃣ 작업하고 저장하고 올리기 (Push)
코드를 수정하고 깃허브에 올리는 3단계 루틴이야.

1. 코드 수정 (Work)

열심히 코드를 짠다. Ctrl + S로 저장한다.

2. 커밋 (Commit) - 일기 쓰기

왼쪽 메뉴바에서 'Y'자 모양 아이콘 (Source Control) 클릭.

변경된 파일들이 보일 거야.

꿀팁: 메시지 적는 칸 옆에 반짝이 아이콘(✨) 누르면 AI가 알아서 영어로 멋지게 설명 써줌!

파란색 Commit 버튼 클릭.

3. 푸시 (Push) - 업로드

커밋을 하고 나면 버튼이 Publish Branch (또는 Sync Changes)로 바뀔 거야.

그거 누르면 깃허브에 업로드 완료!

💡 혹시 에러가 난다면?
"Permission denied (403)": 내가 아직 초대를 안 해줘서 그래. 깃허브 아이디 알려주면 바로 초대해줄게!

"User name/email 설정해라": 터미널 열고 아래 두 줄 입력해 줘.

git config --global user.name "내영어이름"

git config --global user.email "내이메일주소"

다들 파이팅하자! 모르는 거 있으면 언제든 물어봐! 🔥
