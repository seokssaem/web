const { useState, useEffect, useMemo, useRef } = React;

/* ---------- Icons ---------- */
const Icon = {
  check: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5l3.5 3.5L13 5"/></svg>
  ),
  copy: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="5" width="9" height="9" rx="1.5"/><path d="M3 11V3.5A1.5 1.5 0 0 1 4.5 2H11"/></svg>
  ),
  arrowR: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 8h9M9 4.5L12.5 8 9 11.5"/></svg>
  ),
  arrowL: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12.5 8h-9M7 4.5L3.5 8 7 11.5"/></svg>
  ),
  play: () => (
    <svg viewBox="0 0 12 12" fill="currentColor"><path d="M3 2l7 4-7 4z"/></svg>
  ),
  external: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h4v4M13 3l-6 6M11 9v3.5A1.5 1.5 0 0 1 9.5 14h-6A1.5 1.5 0 0 1 2 12.5v-6A1.5 1.5 0 0 1 3.5 5H7"/></svg>
  ),
  warn: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2.5L14 13H2L8 2.5z"/><path d="M8 7v3M8 11.5v.5" strokeLinecap="round"/></svg>
  ),
  info: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6"/><path d="M8 7.5V11M8 5v.5"/></svg>
  ),
  ok: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6"/><path d="M5.5 8.2l1.8 1.8L11 6.5"/></svg>
  ),
  refresh: () => (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.9M13.5 3v3h-3"/></svg>
  )
};

/* ---------- Copyable command row ---------- */
function CmdRow({ text, promptVenv = false }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta);
      ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <div className="cmd">
      <span className="cmd-prompt">{promptVenv ? "(.venv) $" : "$"}</span>
      <span className="cmd-text">{text}</span>
      <button className={"cmd-copy " + (copied ? "is-copied" : "")} onClick={copy} aria-label="복사">
        {copied ? <><Icon.check /> 복사됨</> : <><Icon.copy /> 복사</>}
      </button>
    </div>
  );
}

/* ---------- Callout ---------- */
function Callout({ kind, text }) {
  const map = { warn: <Icon.warn />, ok: <Icon.ok />, info: <Icon.info /> };
  return (
    <div className={"callout callout-" + kind}>
      {map[kind]}
      <span>{text}</span>
    </div>
  );
}

/* ---------- Terminal ---------- */
function Terminal({ title, lines, runState, onRun }) {
  const bodyRef = useRef(null);
  // Animated reveal of lines
  const [revealed, setRevealed] = useState(lines.length); // start fully revealed; reset on run

  useEffect(() => {
    setRevealed(lines.length);
  }, [lines]);

  useEffect(() => {
    if (runState === "running") {
      setRevealed(0);
      let i = 0;
      const tick = () => {
        i += 1;
        setRevealed(i);
        if (i < lines.length) {
          // pace varies for "out" vs "prompt"
          const ln = lines[i] || {};
          const delay = ln.type === "prompt" || ln.type === "prompt-venv" ? 280
                       : ln.type === "spacer" ? 80
                       : ln.type === "ok" || ln.type === "warn" ? 380
                       : 140;
          timer = setTimeout(tick, delay);
        }
      };
      let timer = setTimeout(tick, 200);
      return () => clearTimeout(timer);
    }
  }, [runState, lines]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [revealed]);

  const visible = lines.slice(0, revealed);
  const showCursor = runState === "running" && revealed < lines.length;

  return (
    <section className="terminal-pane">
      <header className="term-chrome">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div className="term-dots">
            <span className="term-dot" />
            <span className="term-dot" />
            <span className="term-dot" />
          </div>
          <span className="term-title">{title}</span>
        </div>
        <button className="term-run-btn" onClick={onRun} disabled={runState === "running"}>
          {runState === "running" ? <>실행중…</> : <><Icon.play /> 다시 실행</>}
        </button>
      </header>
      <div className="term-body" ref={bodyRef}>
        {visible.map((ln, i) => {
          if (ln.type === "spacer") return <span key={i} className="term-line is-spacer" />;
          const cls = {
            "prompt": "is-prompt",
            "prompt-venv": "is-prompt-venv",
            "ok": "is-ok",
            "warn": "is-warn",
            "err": "is-err",
            "mute": "is-mute",
            "dim": "is-dim",
            "out": ""
          }[ln.type] || "";
          return <span key={i} className={"term-line " + cls}>{ln.text}{i === visible.length - 1 && showCursor ? <span className="term-cursor" /> : null}</span>;
        })}
        {!showCursor && runState !== "running" && (
          <span className="term-line is-prompt"><span className="term-cursor" /></span>
        )}
      </div>
    </section>
  );
}

/* ---------- Step screen ---------- */
function StepScreen({ step, isDone, onToggleDone }) {
  const [runId, setRunId] = useState(0);
  const [runState, setRunState] = useState("idle"); // idle | running

  useEffect(() => {
    // Auto-play once when step changes
    setRunId(x => x + 1);
    setRunState("running");
    const total = step.terminal.length * 220 + 600;
    const t = setTimeout(() => setRunState("idle"), total);
    return () => clearTimeout(t);
  }, [step.id]);

  const replay = () => {
    setRunId(x => x + 1);
    setRunState("running");
    const total = step.terminal.length * 220 + 600;
    setTimeout(() => setRunState("idle"), total);
  };

  return (
    <div className="fade-in" key={step.id} style={{ display: "contents" }}>
      <div className="detail-header">
        <div>
          <p className="detail-eyebrow">Step {step.num} · {step.sub}</p>
          <h2 className="detail-title">{step.title}</h2>
          <p className="detail-desc">{step.desc}</p>
        </div>
        <button
          className={"complete-pill " + (isDone ? "is-done" : "")}
          onClick={onToggleDone}
        >
          {isDone ? <><Icon.check /> 완료됨</> : <>완료 표시</>}
        </button>
      </div>

      <div className="detail-body">
        <div className="instructions">
          {step.actions && step.actions.map((a, i) => (
            <a key={i} className="callout callout-info" href={a.href} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
              <Icon.external />
              <span>{a.label}</span>
            </a>
          ))}

          {step.commands && (
            <div className="cmd-block">
              <p className="section-label">실행할 명령</p>
              {step.commands.map((c, i) => (
                <CmdRow key={i} text={c} promptVenv={step.id === "libs" || step.id === "run"} />
              ))}
            </div>
          )}

          {step.callout && <Callout kind={step.callout.kind} text={step.callout.text} />}

          {step.note && <p className="note">{step.note}</p>}

          {step.commandsAfter && (
            <div className="cmd-block">
              <p className="section-label">확인 명령</p>
              {step.commandsAfter.map((c, i) => <CmdRow key={i} text={c} />)}
            </div>
          )}
        </div>

        <Terminal
          key={runId}
          title={step.terminalTitle}
          lines={step.terminal}
          runState={runState}
          onRun={replay}
        />
      </div>
    </div>
  );
}

/* ---------- Flow & FAQ screens ---------- */
function FlowScreen({ steps, doneSet }) {
  return (
    <div className="fade-in" style={{ display: "contents" }}>
      <div className="detail-header">
        <div>
          <p className="detail-eyebrow">Overview</p>
          <h2 className="detail-title">전체 흐름 요약</h2>
          <p className="detail-desc">7단계의 순서를 한눈에 확인하세요. 완료한 단계는 강조됩니다.</p>
        </div>
        <span className="complete-pill">{doneSet.size} / {steps.length}</span>
      </div>
      <div className="flow-screen">
        <div className="flow-chain">
          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <span className={"flow-chip " + (doneSet.has(s.id) ? "is-done" : "")}>
                <span className="flow-chip-num">{s.num}</span>
                {s.title}
              </span>
              {i < steps.length - 1 && <span className="flow-arrow">→</span>}
            </React.Fragment>
          ))}
        </div>

        <div>
          <p className="section-label" style={{ marginBottom: 10 }}>핵심 한 줄 요약</p>
          <div className="summary-grid">
            <div className="summary-card">
              <p className="summary-card-eyebrow">기반</p>
              <p className="summary-card-title">Git Bash</p>
              <p className="summary-card-body">Windows에서 가장 호환성 좋은 셸. 모든 명령은 여기서 실행합니다.</p>
            </div>
            <div className="summary-card">
              <p className="summary-card-eyebrow">매니저</p>
              <p className="summary-card-title">uv</p>
              <p className="summary-card-body">Python 버전 + 가상환경 + 패키지를 한 도구로 관리. 빠르고 단순합니다.</p>
            </div>
            <div className="summary-card">
              <p className="summary-card-eyebrow">목적지</p>
              <p className="summary-card-title">Streamlit</p>
              <p className="summary-card-body">파이썬 코드만으로 웹앱을 만드는 라이브러리. 수업 실습의 메인 도구.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqScreen({ faqs }) {
  return (
    <div className="fade-in" style={{ display: "contents" }}>
      <div className="detail-header">
        <div>
          <p className="detail-eyebrow">Troubleshooting</p>
          <h2 className="detail-title">자주 막히는 포인트</h2>
          <p className="detail-desc">실습 중 자주 발생하는 에러와 해결 방법입니다. 막히면 먼저 여기를 확인하세요.</p>
        </div>
      </div>
      <div className="flow-screen">
        <div className="faq-list">
          {faqs.map((f, i) => (
            <div className="faq-item" key={i}>
              <p className="faq-q"><span className="faq-q-icon">{f.code}</span></p>
              <p className="faq-a">{f.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- App ---------- */
function App() {
  const steps = window.STEPS;
  const faqs = window.FAQ;

  const STORAGE = "wcheat:v1";
  const initial = (() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return { activeId: steps[0].id, done: [] };
  })();

  const [activeId, setActiveId] = useState(initial.activeId);
  const [doneSet, setDoneSet] = useState(new Set(initial.done));

  useEffect(() => {
    localStorage.setItem(STORAGE, JSON.stringify({ activeId, done: [...doneSet] }));
  }, [activeId, doneSet]);

  const isFlow = activeId === "__flow";
  const isFaq = activeId === "__faq";
  const activeIdx = steps.findIndex(s => s.id === activeId);
  const activeStep = activeIdx >= 0 ? steps[activeIdx] : null;

  const toggleDone = (id) => {
    setDoneSet(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const goNext = () => {
    if (isFlow) { setActiveId(steps[0].id); return; }
    if (isFaq) { setActiveId("__flow"); return; }
    if (activeIdx < steps.length - 1) {
      // mark current done when moving forward
      setDoneSet(prev => new Set([...prev, activeId]));
      setActiveId(steps[activeIdx + 1].id);
    } else {
      setDoneSet(prev => new Set([...prev, activeId]));
      setActiveId("__flow");
    }
  };
  const goPrev = () => {
    if (isFlow) { setActiveId(steps[steps.length - 1].id); return; }
    if (isFaq) { setActiveId("__flow"); return; }
    if (activeIdx > 0) setActiveId(steps[activeIdx - 1].id);
  };

  const reset = () => {
    if (!confirm("모든 진행 상황을 초기화할까요?")) return;
    setDoneSet(new Set());
    setActiveId(steps[0].id);
  };

  const doneCount = steps.filter(s => doneSet.has(s.id)).length;
  const pct = Math.round((doneCount / steps.length) * 100);

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">$_</div>
          <div className="brand-meta">
            <span className="eyebrow">Windows · Git Bash · uv · Streamlit</span>
            <h1 className="title-h1">개발환경 구축 치트시트</h1>
          </div>
        </div>
        <div className="progress-summary">
          <span className="progress-text"><strong>{doneCount}</strong> / {steps.length} 완료 · {pct}%</span>
          <div className="progress-track"><div className="progress-fill" style={{ width: pct + "%" }} /></div>
          <button className="reset-btn" onClick={reset}><span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Icon.refresh /> 초기화</span></button>
        </div>
      </header>

      <div className="layout">
        <aside className="steps-panel">
          <div className="steps-list">
            {steps.map(s => {
              const isActive = s.id === activeId;
              const isDone = doneSet.has(s.id);
              return (
                <button
                  key={s.id}
                  className={"step-item " + (isActive ? "is-active " : "") + (isDone ? "is-done" : "")}
                  onClick={() => setActiveId(s.id)}
                >
                  <span className="step-num">
                    {isDone ? <Icon.check /> : s.num}
                  </span>
                  <span className="step-label">
                    <span className="step-label-title">{s.title}</span>
                    <span className="step-label-sub">{s.sub}</span>
                  </span>
                </button>
              );
            })}
          </div>
          <div className="steps-divider" />
          <button className={"flow-link " + (isFlow ? "is-active" : "")} onClick={() => setActiveId("__flow")}>
            <span className="flow-link-icon">∎</span> 전체 흐름
          </button>
          <button className={"flow-link " + (isFaq ? "is-active" : "")} onClick={() => setActiveId("__faq")}>
            <span className="flow-link-icon">!</span> 자주 막히는 포인트
          </button>
        </aside>

        <main className="detail" data-screen-label={isFlow ? "Flow" : isFaq ? "FAQ" : `${activeStep.num} ${activeStep.title}`}>
          {isFlow && <FlowScreen steps={steps} doneSet={doneSet} />}
          {isFaq && <FaqScreen faqs={faqs} />}
          {activeStep && <StepScreen
            step={activeStep}
            isDone={doneSet.has(activeStep.id)}
            onToggleDone={() => toggleDone(activeStep.id)}
          />}

          <footer className="detail-footer">
            <button className="nav-btn" onClick={goPrev} disabled={activeIdx === 0 && !isFlow && !isFaq}>
              <Icon.arrowL /> 이전
            </button>
            <span className="nav-step-indicator">
              {isFlow ? "OVERVIEW" : isFaq ? "TROUBLESHOOTING" : `${activeStep.num} / ${steps[steps.length-1].num}`}
            </span>
            <button className="nav-btn nav-btn-primary" onClick={goNext}>
              {isFlow ? "처음부터 다시" : isFaq ? "전체 흐름으로" : (activeIdx === steps.length - 1 ? "전체 흐름 보기" : "다음 단계")}
              <Icon.arrowR />
            </button>
          </footer>
        </main>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
