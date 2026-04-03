// components/games/index.js
// ── الألعاب الأربع ─────────────────────────────────────────────
"use client";

import { useState, useEffect, useRef } from "react";
import { ProgressBar, QuestionBox, FeedbackOverlay, Stars, Btn } from "../../components/ui";
import { sessionsAPI } from "../../lib/api";
import { useStore } from "../../lib/store";

// ── Score Screen ───────────────────────────────────────────────
export function ScoreScreen({ score, total, xp, difficulty, nextDiff, onHome, onRetry }) {
  const pct = Math.round((score / total) * 100);
  const stars = pct >= 80 ? 3 : pct >= 60 ? 2 : 1;
  const msg = pct >= 80 ? "ممتاز! أنت نجم! 🌟" : pct >= 60 ? "جيد جداً! استمر! 💪" : "حاول مرة أخرى! 🎯";

  return (
    <div style={{ textAlign: "center", padding: "32px 20px" }}>
      <Stars count={stars} />
      <div style={{ fontSize: "clamp(18px,4vw,24px)", fontWeight: 900, color: "#333", marginBottom: "8px" }}>{msg}</div>
      <div style={{
        fontSize: "clamp(48px,12vw,80px)", fontWeight: 900, margin: "10px 0",
        background: "linear-gradient(135deg,#667eea,#f5576c)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>{score}/{total}</div>

      <div style={{
        display: "inline-flex", alignItems: "center", gap: "8px",
        background: "linear-gradient(135deg,#FFE66D,#FF6B6B)",
        padding: "10px 24px", borderRadius: "50px",
        color: "white", fontWeight: 800, fontSize: "18px", marginBottom: "16px",
      }}>+{xp} XP 🚀</div>

      {difficulty !== nextDiff && (
        <div style={{
          background: nextDiff === "hard" ? "#fff3cd" : "#d1ecf1",
          border: `1px solid ${nextDiff === "hard" ? "#ffc107" : "#bee5eb"}`,
          borderRadius: "14px", padding: "12px", marginBottom: "16px",
          fontSize: "13px", fontWeight: 700, color: "#333",
        }}>
          {nextDiff === "hard" ? "🔥 أداؤك ممتاز! تم رفع الصعوبة تلقائياً" : "💙 تم تخفيض الصعوبة لمساعدتك"}
        </div>
      )}

      <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
        <Btn onClick={onRetry} color="linear-gradient(135deg,#4ECDC4,#45B7D1)">🔄 مرة أخرى</Btn>
        <Btn onClick={onHome}  color="linear-gradient(135deg,#667eea,#764ba2)">🏠 الرئيسية</Btn>
      </div>
    </div>
  );
}

// ── Game Wrapper: يحفظ النتيجة ─────────────────────────────────
export function GameWrapper({ gameData, gameType, subject, lesson, difficulty, onFinish }) {
  const { user, addXP } = useStore();

  async function handleFinish(score, total) {
    const xp = Math.round((score / total) * 100);
    const nextDiff = score/total >= 0.85 ? "hard" : score/total >= 0.6 ? "medium" : "easy";

    // حفظ في Backend
    try {
      await sessionsAPI.save({ subject, lesson, game_type: gameType, difficulty, score, total });
      addXP(xp);
    } catch (e) {
      console.warn("لم يتم حفظ الجلسة:", e.message);
    }

    onFinish({ score, total, xp, nextDiff });
  }

  const props = { questions: gameData.questions, onFinish: handleFinish };

  return (
    <>
      {gameType === "bubbles" && <BubbleGame {...props} />}
      {gameType === "quiz"    && <QuizGame   {...props} />}
      {gameType === "match"   && <MatchGame  {...props} />}
      {gameType === "memory"  && <MemoryGame {...props} />}
    </>
  );
}

// ── 1. Bubble Game ─────────────────────────────────────────────
export function BubbleGame({ questions, onFinish }) {
  const [idx,    setIdx]    = useState(0);
  const [score,  setScore]  = useState(0);
  const [fb,     setFb]     = useState(null);
  const [opts,   setOpts]   = useState([]); // ← useState بدل useRef

  const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FFE66D"];

  // ← عدّل useEffect هكذا
  useEffect(() => {
    if (questions && questions[idx]) {
      const shuffled = [...questions[idx].options].sort(() => Math.random() - 0.5);
      setOpts(shuffled); // ← setOpts بدل opts.current
    }
  }, [idx, questions]);

  // إذا لم تُحمَّل الأسئلة بعد
  if (!questions || questions.length === 0) {
    return <div style={{ padding: "40px", textAlign: "center" }}>⏳ جاري التحميل...</div>;
  }

  const q = questions[idx];

  function pick(o) {
    if (fb) return;
    const ok = o === q.correct;
    if (ok) setScore((s) => s + 1);
    setFb(ok ? "✅ ممتاز! 🎉" : `❌ الجواب: ${q.correct}`);
    setTimeout(() => {
      if (idx + 1 >= questions.length) {
        onFinish(score + (ok ? 1 : 0), questions.length);
      } else {
        setIdx((i) => i + 1);
        setFb(null);
      }
    }, 1100);
  }

  return (
    <div style={{ paddingBottom: "20px", textAlign: "center" }}>
      <ProgressBar current={idx} total={questions.length} score={score} />
      <QuestionBox text={q.q} gradient="135deg,#667eea,#764ba2" />
      {fb && <FeedbackOverlay text={fb} />}

      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "12px",
        padding: "20px 16px",
        maxWidth: "480px",
        margin: "0 auto",
      }}>
        {opts.map((o, i) => (  // ← opts مباشرة بدل opts.current
          <button key={i} onClick={() => pick(o)} style={{
            width: 100, height: 100, borderRadius: "50%", border: "none",
            background: colors[i % 4], color: "white",
            fontWeight: 800, fontSize: "14px", cursor: "pointer",
            boxShadow: `0 4px 20px ${colors[i % 4]}80`,
            animation: `floatUp ${1.5 + i * 0.3}s ease-in-out infinite`,
            flexShrink: 0, transition: "transform .2s",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >{o}</button>
        ))}
      </div>
    </div>
  );
}

// ── 2. Quiz Game ───────────────────────────────────────────────
export function QuizGame({ questions, onFinish }) {
  const [idx,   setIdx]   = useState(0);
  const [score, setScore] = useState(0);
  const [sel,   setSel]   = useState(null);

  const q    = questions[idx];
  const opts = [...q.options].sort(() => Math.random() - 0.5); // ← مباشرة

  function pick(o) {
    if (sel) return;
    setSel(o);
    const ok = o === q.correct;
    if (ok) setScore((s) => s + 1);
    setTimeout(() => {
      if (idx + 1 >= questions.length) {
        onFinish(score + (ok ? 1 : 0), questions.length);
      } else {
        setIdx((i) => i + 1);
        setSel(null);
      }
    }, 1100);
  }

  return (
    <div style={{ paddingBottom: "20px" }}>
      <ProgressBar current={idx} total={questions.length} score={score} />
      <QuestionBox text={q.q} gradient="135deg,#f093fb,#f5576c" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", padding: "0 16px" }}>
        {opts.map((o, i) => {
          let bg = "#f0f0ff", border = "2px solid #e0e0e0";
          if (sel) {
            if (o === q.correct)       { bg = "#c8f7c5"; border = "2px solid #2ecc71"; }
            else if (o === sel)        { bg = "#ffd5d5"; border = "2px solid #e74c3c"; }
          }
          return (
            <button key={i} onClick={() => pick(o)} style={{
              padding: "14px 10px", borderRadius: "14px", border, background: bg,
              fontWeight: 700, fontSize: "clamp(12px,3vw,15px)", cursor: "pointer",
            }}
              onMouseEnter={(e) => { if (!sel) e.currentTarget.style.transform = "scale(1.03)"; }}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >{["أ","ب","ج","د"][i]} — {o}</button>
          );
        })}
      </div>
    </div>
  );
}

// ── 3. Match Game ──────────────────────────────────────────────
export function MatchGame({ questions, onFinish }) {
  const pairs = questions.slice(0, 5).map((q) => ({ q: q.q, a: q.correct }));
  const rights = useRef([...pairs].sort(() => Math.random() - 0.5));
  const [lSel, setLSel] = useState(null);
  const [rSel, setRSel] = useState(null);
  const [matched, setMatched] = useState([]);
  const [shake, setShake] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (lSel !== null && rSel !== null) {
      if (pairs[lSel].a === rights.current[rSel].a) {
        const nm = [...matched, `${lSel}_${rSel}`];
        setMatched(nm); setScore((s) => s + 1);
        if (nm.length === pairs.length) setTimeout(() => onFinish(nm.length, pairs.length), 500);
      } else {
        setShake(`${lSel}_${rSel}`);
        setTimeout(() => setShake(null), 500);
      }
      setLSel(null); setRSel(null);
    }
  }, [lSel, rSel]);

  return (
    <div style={{ padding: "16px 16px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: "14px", fontWeight: 700, color: "#555", fontSize: "14px" }}>
        طابق السؤال مع الجواب ✨ {score}/{pairs.length}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <div>
          {pairs.map((p, i) => {
            const isM = matched.some((m) => m.startsWith(`${i}_`));
            return (
              <button key={i} onClick={() => !isM && setLSel(i)} style={{
                display: "block", width: "100%", margin: "5px 0", padding: "12px 8px",
                borderRadius: "12px", border: "none", fontSize: "12px", fontWeight: 700,
                cursor: isM ? "default" : "pointer",
                background: isM ? "#c8f7c5" : lSel === i ? "#667eea" : "#f0f0ff",
                color: lSel === i ? "white" : "#333", opacity: isM ? 0.6 : 1, transition: "all .2s",
              }}>{p.q}</button>
            );
          })}
        </div>
        <div>
          {rights.current.map((p, i) => {
            const isM = matched.some((m) => m.endsWith(`_${i}`));
            const isSh = shake?.endsWith(`_${i}`);
            return (
              <button key={i} onClick={() => !isM && setRSel(i)} style={{
                display: "block", width: "100%", margin: "5px 0", padding: "12px 8px",
                borderRadius: "12px", border: "none", fontSize: "12px", fontWeight: 800,
                cursor: isM ? "default" : "pointer",
                background: isM ? "#c8f7c5" : isSh ? "#ffd5d5" : rSel === i ? "#f5576c" : "#fff0f5",
                color: rSel === i ? "white" : "#333", opacity: isM ? 0.6 : 1, transition: "all .2s",
                animation: isSh ? "shake .4s" : "",
              }}>{p.a}</button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── 4. Memory Game ─────────────────────────────────────────────
export function MemoryGame({ questions, onFinish }) {
  const pairs = questions.slice(0, 4).flatMap((q) => [
    { id: `${q.q}_q`, text: q.q,      pair: q.q },
    { id: `${q.q}_a`, text: q.correct, pair: q.q },
  ]);
  const cards = useRef([...pairs].sort(() => Math.random() - 0.5));
  const [flipped, setFlipped] = useState([]);
  const [solved,  setSolved]  = useState([]);
  const [score,   setScore]   = useState(0);

  function flip(i) {
    if (flipped.length === 2 || flipped.includes(i) || solved.includes(cards.current[i].pair)) return;
    const next = [...flipped, i];
    setFlipped(next);
    if (next.length === 2) {
      const [a, b] = next.map((x) => cards.current[x]);
      if (a.pair === b.pair) {
        const ns = [...solved, a.pair];
        setSolved(ns); setScore((s) => s + 1); setFlipped([]);
        if (ns.length === 4) setTimeout(() => onFinish(ns.length, 4), 500);
      } else setTimeout(() => setFlipped([]), 900);
    }
  }

  return (
    <div style={{ padding: "16px 16px 20px" }}>
      <div style={{ textAlign: "center", marginBottom: "12px", fontWeight: 700, color: "#555" }}>
        🧠 اقلب وطابق! {score}/4
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "7px" }}>
        {cards.current.map((c, i) => {
          const isF = flipped.includes(i), isS = solved.includes(c.pair);
          return (
            <div key={c.id} onClick={() => flip(i)} style={{
              height: "82px", borderRadius: "12px", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: 700, padding: "5px", textAlign: "center",
              background: isS ? "#c8f7c5" : isF ? "#667eea" : "#e8e8ff",
              color: isS ? "#2d8a2d" : isF ? "white" : "#e8e8ff",
              transition: "all .3s", userSelect: "none",
            }}>{(isF || isS) ? c.text : "?"}</div>
          );
        })}
      </div>
    </div>
  );
}
