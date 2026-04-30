// All step + terminal data, kept separate so the React file stays small.
window.STEPS = [
  {
    id: "git",
    num: "01",
    title: "Git 설치",
    sub: "git-scm.com",
    desc: "Windows용 Git을 설치하면 Git Bash 터미널이 함께 깔립니다. 이 수업에선 Git Bash를 메인 터미널로 씁니다.",
    actions: [
      { kind: "link", label: "git-scm.com 다운로드 페이지 열기", href: "https://git-scm.com/download/win" }
    ],
    note: "설치 마법사의 모든 옵션은 그대로 두고 Next 만 눌러도 됩니다. 기본값이 학습용으로 충분합니다.",
    callout: { kind: "ok", text: "설치 후 시작 메뉴에서 “Git Bash” 를 검색해 실행하세요." },
    terminalTitle: "Git Bash",
    terminal: [
      { type: "mute", text: "# 시작 메뉴에서 Git Bash를 실행하면 이런 화면이 나옵니다" },
      { type: "spacer" },
      { type: "dim", text: "user@DESKTOP MINGW64 ~" },
      { type: "prompt", text: "git --version" },
      { type: "out", text: "git version 2.45.1.windows.1" },
      { type: "spacer" },
      { type: "ok", text: "✓ Git Bash가 정상적으로 열렸습니다." }
    ]
  },
  {
    id: "folder",
    num: "02",
    title: "작업 폴더 만들기",
    sub: "mkdir / cd",
    desc: "수업에서 사용할 폴더 구조를 만듭니다. 홈 디렉터리(~) 아래에 ai_class/streamlit_labs 두 단계로 만들 거예요.",
    commands: [
      "mkdir ai_class",
      "cd ai_class",
      "mkdir streamlit_labs",
      "cd streamlit_labs"
    ],
    note: "현재 위치가 헷갈릴 땐 pwd 를 입력해 확인할 수 있습니다.",
    terminalTitle: "~/ai_class/streamlit_labs",
    terminal: [
      { type: "prompt", text: "mkdir ai_class" },
      { type: "prompt", text: "cd ai_class" },
      { type: "prompt", text: "mkdir streamlit_labs" },
      { type: "prompt", text: "cd streamlit_labs" },
      { type: "prompt", text: "pwd" },
      { type: "out", text: "/c/Users/me/ai_class/streamlit_labs" },
      { type: "spacer" },
      { type: "ok", text: "✓ 작업 폴더로 이동 완료" }
    ]
  },
  {
    id: "uv",
    num: "03",
    title: "uv 설치",
    sub: "Astral uv",
    desc: "uv 는 빠른 파이썬 패키지/환경 매니저입니다. pip 보다 훨씬 빠르고, 가상환경과 파이썬 버전을 한꺼번에 관리해줍니다.",
    commands: [
      "curl -LsSf https://astral.sh/uv/install.sh | sh"
    ],
    callout: { kind: "warn", text: "설치가 끝나면 Git Bash 창을 한 번 껐다가 다시 켜야 합니다. (PATH 환경변수 적용)" },
    note: "재시작 후 아래 명령으로 설치를 확인하세요.",
    commandsAfter: [
      "uv --version"
    ],
    terminalTitle: "Git Bash — uv install",
    terminal: [
      { type: "prompt", text: "curl -LsSf https://astral.sh/uv/install.sh | sh" },
      { type: "out", text: "downloading uv 0.5.4 x86_64-pc-windows-msvc" },
      { type: "out", text: "installing to /c/Users/me/.local/bin" },
      { type: "out", text: "  uv" },
      { type: "out", text: "  uvx" },
      { type: "ok", text: "everything's installed!" },
      { type: "spacer" },
      { type: "warn", text: "⚠ Git Bash를 다시 시작해 주세요" },
      { type: "spacer" },
      { type: "dim", text: "# 재시작 후" },
      { type: "prompt", text: "uv --version" },
      { type: "out", text: "uv 0.5.4" },
      { type: "ok", text: "✓ 버전이 보이면 성공" }
    ]
  },
  {
    id: "init",
    num: "04",
    title: "프로젝트 초기화",
    sub: "uv init / venv",
    desc: "Python 3.11 기반으로 프로젝트를 초기화하고, 격리된 가상환경(.venv)을 만듭니다.",
    commands: [
      "uv init --python 3.11",
      "uv venv --python 3.11"
    ],
    note: "pyproject.toml 파일이 자동 생성됩니다. 직접 수정할 필요는 없어요.",
    terminalTitle: "uv init",
    terminal: [
      { type: "prompt", text: "uv init --python 3.11" },
      { type: "out", text: "Initialized project `streamlit_labs`" },
      { type: "out", text: "  + pyproject.toml" },
      { type: "out", text: "  + README.md" },
      { type: "out", text: "  + main.py" },
      { type: "spacer" },
      { type: "prompt", text: "uv venv --python 3.11" },
      { type: "out", text: "Using CPython 3.11.9" },
      { type: "out", text: "Creating virtual environment at: .venv" },
      { type: "ok", text: "Activate with: source .venv/Scripts/activate" }
    ]
  },
  {
    id: "activate",
    num: "05",
    title: "가상환경 활성화",
    sub: "source .venv/...",
    desc: "프로젝트별로 깨끗한 파이썬 환경을 켭니다. 매번 작업을 시작할 때 이 명령을 실행해야 합니다.",
    commands: [
      "source .venv/Scripts/activate"
    ],
    callout: { kind: "ok", text: "프롬프트 맨 앞에 (.venv) 가 붙으면 성공입니다." },
    note: "비활성화는 deactivate 명령으로 가능합니다.",
    terminalTitle: "venv activate",
    terminal: [
      { type: "prompt", text: "source .venv/Scripts/activate" },
      { type: "spacer" },
      { type: "dim", text: "# 프롬프트가 다음과 같이 바뀝니다" },
      { type: "prompt-venv", text: "" },
      { type: "ok", text: "✓ (.venv) 표시 확인" }
    ]
  },
  {
    id: "libs",
    num: "06",
    title: "라이브러리 설치",
    sub: "uv add",
    desc: "Streamlit 수업에서 자주 쓰는 패키지 묶음을 한 번에 설치합니다.",
    commands: [
      "uv add streamlit pandas numpy matplotlib seaborn"
    ],
    note: "처음 설치할 땐 1~2분 정도 걸릴 수 있습니다. uv 가 캐시를 만들어 두기 때문에 다음부턴 더 빨라요.",
    terminalTitle: "uv add — installing packages",
    terminal: [
      { type: "prompt-venv", text: "uv add streamlit pandas numpy matplotlib seaborn" },
      { type: "out", text: "Resolved 47 packages in 412ms" },
      { type: "out", text: "Prepared 47 packages in 3.2s" },
      { type: "out", text: "Installed 47 packages in 612ms" },
      { type: "out", text: " + streamlit==1.36.0" },
      { type: "out", text: " + pandas==2.2.2" },
      { type: "out", text: " + numpy==1.26.4" },
      { type: "out", text: " + matplotlib==3.9.1" },
      { type: "out", text: " + seaborn==0.13.2" },
      { type: "dim", text: "  ... (+42개 의존성)" },
      { type: "spacer" },
      { type: "ok", text: "✓ 모든 패키지 설치 완료" }
    ]
  },
  {
    id: "run",
    num: "07",
    title: "Streamlit 실행 확인",
    sub: "streamlit hello",
    desc: "Streamlit이 정상 동작하는지 확인합니다. 데모 앱이 브라우저에서 자동으로 열려요.",
    commands: [
      "streamlit hello"
    ],
    callout: { kind: "info", text: "이메일 입력 창이 나오면 그냥 Enter 를 누르면 됩니다." },
    note: "종료하려면 터미널에서 Ctrl + C 를 누르세요.",
    terminalTitle: "streamlit hello",
    terminal: [
      { type: "prompt-venv", text: "streamlit hello" },
      { type: "spacer" },
      { type: "dim", text: "  Welcome to Streamlit!" },
      { type: "dim", text: "  If you'd like to receive helpful onboarding emails," },
      { type: "dim", text: "  please enter your email address below. Otherwise," },
      { type: "dim", text: "  leave this field blank." },
      { type: "spacer" },
      { type: "out", text: "  Email:  " },
      { type: "dim", text: "  → 그냥 Enter ↵" },
      { type: "spacer" },
      { type: "out", text: "  You can now view your Streamlit app in your browser." },
      { type: "spacer" },
      { type: "out", text: "  Local URL:    http://localhost:8501" },
      { type: "out", text: "  Network URL:  http://192.168.0.12:8501" },
      { type: "spacer" },
      { type: "ok", text: "✓ 브라우저가 자동으로 열리면 성공!" }
    ]
  }
];

window.FAQ = [
  {
    code: "uv: command not found",
    answer: "Git Bash 창을 완전히 닫고 새로 여세요. uv 설치 직후엔 PATH가 새 창에서만 적용됩니다."
  },
  {
    code: "(.venv) 가 안 붙음",
    answer: "`source .venv/Scripts/activate` 를 다시 실행하세요. 다른 폴더에 있다면 먼저 `cd ~/ai_class/streamlit_labs` 로 이동."
  },
  {
    code: "streamlit: command not found",
    answer: "가상환경 활성화가 안 된 상태입니다. 프롬프트 맨 앞에 `(.venv)` 가 있는지 먼저 확인하세요."
  },
  {
    code: "Permission denied / SSL error",
    answer: "회사·학교 네트워크에서 종종 발생합니다. 다른 네트워크에서 다시 시도하거나, VPN을 잠시 꺼보세요."
  },
  {
    code: "포트 8501 사용 중",
    answer: "이미 다른 Streamlit이 떠 있는 경우입니다. `streamlit hello --server.port 8502` 로 포트를 바꿔 실행."
  },
  {
    code: "Python 3.11 설치 못 찾음",
    answer: "`uv python install 3.11` 을 한 번 실행하면 uv가 직접 Python 3.11을 받아옵니다."
  }
];
