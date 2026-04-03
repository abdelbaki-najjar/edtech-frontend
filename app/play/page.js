// app/play/page.js — نسخة محسّنة مع إدخال حر لعنوان الدرس
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useStore } from "../../lib/store";
import { aiAPI } from "../../lib/api";
import { UpgradeModal, UsageBar } from "../../components/ui/UpgradeModal";
import { LimitReachedError } from "../../lib/api";
import { PageShell } from "../../components/layout/PageShell";
import { Card, Btn, ErrorBox, Spinner } from "../../components/ui";
import { GameWrapper, ScoreScreen } from "../../components/games";
import { GRADES, SUBJECTS, GAME_TYPES, DIFF_COLORS } from "../../lib/constants";

// ── اقتراحات دروس سريعة حسب المادة ───────────────────────────
const LESSON_SUGGESTIONS = {
  math: [
    "جدول الضرب", "الكسور العشرية", "القسمة على عدد من رقمين",
    "المساحة والمحيط", "الأعداد الصحيحة", "العمليات على الكسور",
    "الهندسة — المثلث والمربع", "المسائل المركبة",
  ],
  arabic: [
    "الفاعل والمفعول به", "الجملة الفعلية", "همزة القطع والوصل",
    "المذكر والمؤنث", "المفرد والجمع", "الأفعال الثلاثية",
    "القسم ة والموصوف", "النص الوصفي",
  ],
  science: [
    "دورة حياة النبات", "التنفس عند الإنسان", "دورة الماء في الطبيعة",
    "سلسلة الغذاء", "الكهرباء والمغناطيس", "الضوء والظل",
    "أجهزة جسم الإنسان", "المواد وخصائصها",
  ],
  french: [
    "Les animaux", "La famille", "Les couleurs et les formes",
    "Le présent des verbes", "La négation", "Les articles",
    "La maison et les pièces", "Les vêtements",
  ],
  english: [
    "Colors and shapes", "My family", "Animals and habitats",
    "Days and months", "Present simple", "Can and can't",
    "Food and drinks", "My school",
  ],
};

function PlayContent() {
  const { user } = useStore();
  const router = useRouter();

  // ── State ──────────────────────────────────────────────────
  const [step,        setStep]        = useState("select");
  const [grade,       setGrade]       = useState(user?.grade || 3);
  const [subject,     setSubject]     = useState(null);
  const [lessonTitle, setLessonTitle] = useState("");  // ← حر
  const [gameType,    setGameType]    = useState(null);
  const [gameData,    setGameData]    = useState(null);
  const [result,      setResult]      = useState(null);
  const [error,       setError]       = useState("");
  const [loadingMsg,  setLoadingMsg]  = useState("");

  const [upgradeInfo, setUpgradeInfo] = useState(null); // للـ modal
  const [usage,       setUsage]       = useState(null); // للـ bar

  const difficulty = user?.difficulty || "medium";
  useEffect(() => {
  aiAPI.getUsage()
    .then(setUsage)
    .catch(() => {});
}, []);
  const diffStyle  = DIFF_COLORS[difficulty];
  

  // ── توليد اللعبة ───────────────────────────────────────────
  async function generate() {
    setStep("loading");
  setError("");

  const msgs = [
    `🎓 Lesson Agent: يحلل درس "${lessonTitle}"...`,
    `❓ Question Agent: يولّد الأسئلة...`,
    `🎮 Game Agent: يهيئ قالب اللعبة...`,
    `⚡ Difficulty Agent: يضبط المستوى...`,
  ];
  for (let i = 0; i < msgs.length; i++) {
    setLoadingMsg(msgs[i]);
    await new Promise(r => setTimeout(r, 700));
  }

  try {
    const res = await aiAPI.generateGame({
      grade, subject,
      lesson_title: lessonTitle,
      game_type: GAME_TYPES.find(g => g.id === gameType)?.label,
      difficulty,
      num_questions: 8,
    });

    // تحديث الاستخدام
    if (res.usage) setUsage(res.usage);

    setGameData(res.data);
    setStep("play");

  } catch (e) {
    // ── وصل للحد → أظهر Modal الاشتراك ───────────────────
    if (e instanceof LimitReachedError) {
      setUpgradeInfo(e.contact);
      setStep("gameType");
    } else {
      setError("⚠️ " + e.message);
      setStep("gameType");
    }
  }
}

  function handleFinish(res) {
    setResult(res);
    setStep("score");
  }

  // ══════════════════════════════════════════════════════════
  //  STEP 1 — اختيارالقسم  والمادة
  // ══════════════════════════════════════════════════════════
  if (step === "select") return (
    <Card style={{ padding: "22px 18px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => router.push("/dashboard")} style={backBtnStyle}>← رجوع</button>
        <div>
          <h2 style={{ margin: 0, fontWeight: 900, color: "#1a1a2e", fontSize: "18px" }}>
            🎓 اخترالقسم  والمادة
          </h2>
          <p style={{ margin: 0, fontSize: "11px", color: "#aaa", marginTop: "2px" }}>
            الخطوة 1 من 3
          </p>
        </div>
      </div>

      {/* Grade */}
      <div style={{ marginBottom: "18px" }}>
        <label style={labelStyle}>📚القسم  الدراسي</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "7px" }}>
          {GRADES.map((g, i) => (
            <button key={i} onClick={() => setGrade(i + 1)} style={{
              ...chipStyle,
              background: grade === i+1 ? "linear-gradient(135deg,#667eea,#764ba2)" : "#f0f0ff",
              color: grade === i+1 ? "white" : "#555",
              boxShadow: grade === i+1 ? "0 4px 15px rgba(102,126,234,.4)" : "none",
            }}>القسم  {g}</button>
          ))}
        </div>
      </div>

      {/* Subject */}
      <div style={{ marginBottom: "22px" }}>
        <label style={labelStyle}>🎯 المادة الدراسية</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {Object.entries(SUBJECTS).map(([k, v]) => (
            <button key={k} onClick={() => { setSubject(k); setLessonTitle(""); }} style={{
              padding: "14px 10px", borderRadius: "14px", border: "none",
              fontSize: "14px", fontWeight: 700, cursor: "pointer", transition: "all .2s",
              background: subject === k ? v.color : "#f0f0ff",
              color: subject === k ? "white" : "#555",
              boxShadow: subject === k ? `0 4px 15px ${v.color}50` : "none",
            }}>{v.emoji} {v.label}</button>
          ))}
        </div>
      </div>

      <Btn
        onClick={() => { if (grade && subject) setStep("lesson"); }}
        disabled={!grade || !subject}
        full color="linear-gradient(135deg,#4ECDC4,#45B7D1)"
        style={{ fontSize: "16px", padding: "15px" }}
      >
        التالي → اختر الدرس 📖
      </Btn>
    </Card>
  );

  // ══════════════════════════════════════════════════════════
  //  STEP 2 — إدخال عنوان الدرس (حر + اقتراحات)
  // ══════════════════════════════════════════════════════════
  if (step === "lesson") return (
    <Card style={{ padding: "22px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => setStep("select")} style={backBtnStyle}>←</button>
        <div>
          <h2 style={{ margin: 0, fontWeight: 900, color: "#1a1a2e", fontSize: "18px" }}>
            📖 عنوان الدرس
          </h2>
          <p style={{ margin: 0, fontSize: "11px", color: "#aaa", marginTop: "2px" }}>
           القسم  {GRADES[grade-1]} | {SUBJECTS[subject]?.emoji} {SUBJECTS[subject]?.label} | الخطوة 2 من 3
          </p>
        </div>
      </div>

      {/* Input حر */}
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>✏️ اكتب عنوان الدرس</label>
        <input
          type="text"
          value={lessonTitle}
          onChange={(e) => setLessonTitle(e.target.value)}
          placeholder={`مثال: ${LESSON_SUGGESTIONS[subject]?.[0] || "عنوان الدرس"}`}
          style={{
            width: "100%", padding: "14px 16px", borderRadius: "14px",
            border: "2px solid",
            borderColor: lessonTitle ? "#667eea" : "#e8e8ff",
            fontSize: "16px", fontWeight: 600,
            background: "#fafaff", color: "#333",
            transition: "border .2s", outline: "none",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#667eea")}
          onBlur={(e) => { if (!lessonTitle) e.target.style.borderColor = "#e8e8ff"; }}
          onKeyDown={(e) => { if (e.key === "Enter" && lessonTitle.trim()) setStep("gameType"); }}
        />
        <p style={{ fontSize: "11px", color: "#aaa", marginTop: "6px" }}>
          💡 اكتب العنوان كما هو في كتابك المدرسي للحصول على أفضل نتيجة
        </p>
      </div>

      {/* اقتراحات سريعة */}
      {subject && LESSON_SUGGESTIONS[subject] && (
        <div style={{ marginBottom: "20px" }}>
          <label style={{ ...labelStyle, marginBottom: "8px" }}>⚡ اقتراحات سريعة</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
            {LESSON_SUGGESTIONS[subject].map((s) => (
              <button
                key={s}
                onClick={() => setLessonTitle(s)}
                style={{
                  padding: "7px 13px", borderRadius: "50px", border: "none",
                  fontSize: "12px", fontWeight: 600, cursor: "pointer",
                  background: lessonTitle === s
                    ? "linear-gradient(135deg,#667eea,#764ba2)"
                    : "#f0f0ff",
                  color: lessonTitle === s ? "white" : "#555",
                  transition: "all .2s",
                }}
              >{s}</button>
            ))}
          </div>
        </div>
      )}

      <Btn
        onClick={() => { if (lessonTitle.trim()) setStep("gameType"); }}
        disabled={!lessonTitle.trim()}
        full color="linear-gradient(135deg,#FF6B6B,#f5576c)"
        style={{ fontSize: "16px", padding: "15px" }}
      >
        التالي → اختر نوع اللعبة 🎮
      </Btn>
    </Card>
  );

  // ══════════════════════════════════════════════════════════
  //  STEP 3 — اختيار نوع اللعبة
  // ══════════════════════════════════════════════════════════
  if (step === "gameType") return (
    <Card style={{ padding: "22px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
        <button onClick={() => setStep("lesson")} style={backBtnStyle}>←</button>
        <div>
          <h2 style={{ margin: 0, fontWeight: 900, color: "#1a1a2e", fontSize: "18px" }}>
            🕹️ نوع اللعبة
          </h2>
          <p style={{ margin: 0, fontSize: "11px", color: "#aaa", marginTop: "2px" }}>
            الخطوة 3 من 3
          </p>
        </div>
      </div>

      {/* ملخص الاختيارات */}
      <div style={{
        background: "linear-gradient(135deg,#667eea15,#764ba215)",
        border: "1.5px solid #667eea30",
        borderRadius: "14px", padding: "12px 14px", marginBottom: "16px",
      }}>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "#333", marginBottom: "4px" }}>
          📋 ملخص
        </div>
        <div style={{ fontSize: "12px", color: "#555", display: "flex", flexWrap: "wrap", gap: "8px" }}>
          <span>📚القسم  {GRADES[grade-1]}</span>
          <span>{SUBJECTS[subject]?.emoji} {SUBJECTS[subject]?.label}</span>
          <span>📖 {lessonTitle}</span>
          <span style={{
            padding: "2px 8px", borderRadius: "20px", fontSize: "11px",
            background: diffStyle.bg, color: diffStyle.text,
          }}>⚡ {diffStyle.label}</span>
        </div>
      </div>
      {usage && (
        <UsageBar
          used={usage.used}
          limit={usage.limit}
          plan={usage.plan}
        />
      )}
      <ErrorBox message={error} />

      {/* Game Types */}
      <div style={{ display: "flex", flexDirection: "column", gap: "9px", marginBottom: "16px" }}>
        {GAME_TYPES.map((g) => (
          <button key={g.id} onClick={() => setGameType(g.id)} style={{
            padding: "15px 16px", borderRadius: "16px", border: "none",
            display: "flex", alignItems: "center", gap: "14px", textAlign: "right",
            background: gameType === g.id
              ? "linear-gradient(135deg,#667eea,#764ba2)"
              : "#f5f5ff",
            color: gameType === g.id ? "white" : "#333",
            fontWeight: 700, fontSize: "15px", cursor: "pointer", transition: "all .2s",
            boxShadow: gameType === g.id ? "0 6px 20px rgba(102,126,234,.4)" : "none",
          }}>
            <span style={{ fontSize: "28px" }}>{g.emoji}</span>
            <div>
              <div style={{ fontWeight: 800 }}>{g.label}</div>
              <div style={{ fontSize: "11px", opacity: .8, fontWeight: 400 }}>{g.desc}</div>
            </div>
            {gameType === g.id && (
              <span style={{ marginRight: "auto", fontSize: "18px" }}>✓</span>
            )}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: "9px" }}>
        <Btn
          onClick={async () => {
            setStep("loading");
            setLoadingMsg("📄 يولّد ورقة العمل...");
            try {
              const res = await aiAPI.generateWorksheet({
                grade, subject,
                lesson_title: lessonTitle,
                difficulty,
              });
              setGameData({ _worksheet: true, ...res.data });
              setStep("wsView");
            } catch(e) {
              setError(e.message);
              setStep("gameType");
            }
          }}
          color="linear-gradient(135deg,#FF6B6B,#f5576c)"
          style={{ flex: 1, fontSize: "13px", padding: "13px 8px" }}
        >
          📄 ورقة عمل
        </Btn>
        <Btn
          onClick={generate}
          disabled={!gameType}
          color="linear-gradient(135deg,#667eea,#764ba2)"
          style={{ flex: 2, fontSize: "15px", padding: "13px 8px" }}
        >
          🤖 ولّد اللعبة!
        </Btn>
      </div>
    </Card>
  );

  // ══════════════════════════════════════════════════════════
  //  LOADING — مع رسائل متتالية
  // ══════════════════════════════════════════════════════════
  if (step === "loading") return (
    <Card style={{ padding: "50px 24px", textAlign: "center" }}>
      <div style={{ fontSize: "56px", marginBottom: "14px", animation: "floatUp 2s infinite" }}>🤖</div>
      <h3 style={{ fontSize: "19px", fontWeight: 900, color: "#333", margin: "0 0 20px" }}>
        الذكاء الاصطناعي يعمل...
      </h3>

      {/* رسالة متحركة */}
      <div style={{
        background: "#f0f0ff", borderRadius: "12px", padding: "14px 18px",
        marginBottom: "24px", fontSize: "13px", fontWeight: 600, color: "#667eea",
        minHeight: "48px", display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all .3s",
      }}>
        {loadingMsg || "🔄 جاري التوليد..."}
      </div>

      {/* درس الانتظار */}
      <div style={{
        background: "linear-gradient(135deg,#667eea15,#764ba215)",
        borderRadius: "12px", padding: "10px 16px",
        fontSize: "12px", color: "#555", marginBottom: "20px",
      }}>
        📖 درس: <strong>{lessonTitle}</strong> |
        📚القسم  {GRADES[grade-1]} |
        {SUBJECTS[subject]?.emoji} {SUBJECTS[subject]?.label}
      </div>

      <Spinner />
    </Card>
  );

  // ══════════════════════════════════════════════════════════
  //  PLAY
  // ══════════════════════════════════════════════════════════
  if (step === "play" && gameData) return (
    <Card style={{ overflow: "visible" }}>
      <div style={{
        padding: "14px 16px 10px", textAlign: "center",
        background: "linear-gradient(135deg,#1a1a2e,#0f3460)", color: "white",
        borderRadius: "24px 24px 0 0", position: "relative",
      }}>
        <div style={{ fontWeight: 800, fontSize: "16px" }}>{gameData.title}</div>
        <div style={{ fontSize: "11px", opacity: .6, marginTop: "2px" }}>
          {GRADES[grade-1]} | {SUBJECTS[subject]?.emoji} {lessonTitle} | {GAME_TYPES.find(g=>g.id===gameType)?.emoji}
        </div>
        {/* الأهداف التعليمية */}
        {gameData.learning_objectives?.length > 0 && (
          <div style={{
            marginTop: "8px", fontSize: "11px", opacity: .7,
            display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap",
          }}>
            {gameData.learning_objectives.map((obj, i) => (
              <span key={i} style={{
                background: "rgba(255,255,255,.15)", padding: "2px 8px", borderRadius: "20px",
              }}>🎯 {obj}</span>
            ))}
          </div>
        )}
        <button onClick={() => router.push("/dashboard")} style={{
          position: "absolute", top: "10px", left: "10px",
          background: "none", border: "none", cursor: "pointer",
          fontSize: "18px", color: "rgba(255,255,255,.5)",
        }}>✕</button>
      </div>
      <GameWrapper
        gameData={gameData} gameType={gameType}
        subject={subject} lesson={lessonTitle} difficulty={difficulty}
        onFinish={handleFinish}
      />
    </Card>
  );

  // ══════════════════════════════════════════════════════════
  //  WORKSHEET VIEW
  // ══════════════════════════════════════════════════════════
  if (step === "wsView" && gameData) return (
    <WorksheetView
      data={gameData}
      grade={grade} subject={subject} lesson={lessonTitle}
      student={user}
      onBack={() => setStep("gameType")}
    />
  );

  // ══════════════════════════════════════════════════════════
  //  SCORE
  // ══════════════════════════════════════════════════════════
  if (step === "score" && result) return (
    <Card>
      <ScoreScreen
        score={result.score} total={result.total}
        xp={result.xp} difficulty={difficulty} nextDiff={result.nextDiff}
        lessonTitle={lessonTitle}
        onHome={() => router.push("/dashboard")}
        onRetry={() => { setStep("loading"); setTimeout(generate, 100); }}
        onNewLesson={() => setStep("select")}
      />
    </Card>
  );
  return (
    <>
      {upgradeInfo && (
        <UpgradeModal
          contact={upgradeInfo}
          onClose={() => setUpgradeInfo(null)}
        />
      )}
    </>
  );

  return null;
}

// ── Worksheet Component ─────────────────────────────────────
function WorksheetView({ data, grade, subject, lesson, student, onBack }) {
  const c = SUBJECTS[subject]?.color || "#667eea";
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "14px" }}>
        <Btn onClick={onBack} color="#f0f0ff" style={{ color: "#667eea", fontSize: "13px", padding: "8px 16px" }}>← رجوع</Btn>
        <Btn onClick={() => window.print()} color={`linear-gradient(135deg,${c},#764ba2)`} style={{ fontSize: "13px", padding: "8px 16px" }}>🖨️ طباعة</Btn>
      </div>
      <div id="ws-print" style={{ background: "white", borderRadius: "18px", padding: "24px 20px", boxShadow: "0 4px 20px rgba(0,0,0,.08)" }}>
        <div style={{ background: `${c}15`, border: `2px solid ${c}40`, borderRadius: "14px", padding: "16px", marginBottom: "20px", textAlign: "center" }}>
          <div style={{ fontWeight: 900, fontSize: "18px", color: c, marginBottom: "8px" }}>{SUBJECTS[subject]?.emoji} {data.title}</div>
          <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "8px", fontSize: "12px", color: "#555" }}>
            <span>📚القسم : {GRADES[grade - 1]} ابتدائي</span>
            <span>👤 {student?.name || ".........."}</span>
            <span>📅 {new Date().toLocaleDateString("ar-TN")}</span>
          </div>
        </div>
        {data.objectives?.length > 0 && (
          <div style={{ marginBottom: "18px", padding: "12px", background: "#f8f8ff", borderRadius: "10px", borderRight: `3px solid ${c}` }}>
            <div style={{ fontWeight: 800, color: c, marginBottom: "6px", fontSize: "13px" }}>🎯 الكفايات المستهدفة:</div>
            {data.objectives.map((o, i) => <div key={i} style={{ fontSize: "12px", color: "#444", marginBottom: "3px" }}>• {o}</div>)}
          </div>
        )}
        {data.sections?.map((sec, si) => (
          <div key={si} style={{ marginBottom: "20px" }}>
            <div style={{ fontWeight: 800, fontSize: "14px", color: c, marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px", borderBottom: `2px solid ${c}30`, paddingBottom: "5px" }}>
              <span style={{ background: c, color: "white", width: "24px", height: "24px", borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 900, flexShrink: 0 }}>{si + 1}</span>
              {sec.title}
            </div>
            {sec.type === "fill" && sec.items?.map((item, i) => (
              <div key={i} style={{ background: "#fafafa", borderRadius: "10px", padding: "11px 13px", marginBottom: "7px", fontSize: "13px", border: "1px solid #eee", lineHeight: 2 }}>{i + 1}. {item}</div>
            ))}
            {sec.type === "mcq" && sec.items?.map((item, i) => (
              <div key={i} style={{ background: "#fafafa", borderRadius: "10px", padding: "13px", marginBottom: "7px", border: "1px solid #eee" }}>
                <div style={{ fontWeight: 700, fontSize: "13px", marginBottom: "7px" }}>{i + 1}. {item.q}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px" }}>
                  {item.opts?.map((opt, j) => (
                    <div key={j} style={{ padding: "5px 9px", borderRadius: "8px", border: "1.5px solid #ddd", fontSize: "12px", display: "flex", alignItems: "center", gap: "5px" }}>
                      <span style={{ width: "18px", height: "18px", borderRadius: "50%", border: "1.5px solid #999", display: "inline-block", flexShrink: 0 }} />
                      {["أ", "ب", "ج", "د"][j]}— {opt}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {sec.type === "solve" && sec.items?.map((item, i) => (
              <div key={i} style={{ padding: "13px", marginBottom: "7px", borderRadius: "10px", border: "1px dashed #ccc", background: "#fafafa" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "10px" }}>{i + 1}. {item}</div>
                <div style={{ height: "36px", borderBottom: "1.5px solid #ccc", marginBottom: "5px" }} />
                <div style={{ height: "36px", borderBottom: "1.5px solid #ccc" }} />
              </div>
            ))}
            {sec.type === "free" && sec.items?.map((item, i) => (
              <div key={i} style={{ padding: "13px", marginBottom: "7px", borderRadius: "10px", border: "1px solid #eee", background: "#fafafa" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, marginBottom: "8px" }}>{item}</div>
                {[0, 1, 2].map(l => <div key={l} style={{ height: "34px", borderBottom: "1px solid #ddd", marginBottom: "4px" }} />)}
              </div>
            ))}
          </div>
        ))}
        <div style={{ textAlign: "center", padding: "12px", borderTop: "1px dashed #ddd", fontSize: "10px", color: "#bbb" }}>
          مُولَّدة بالذكاء الاصطناعي | منصة تعلّم ولعب 🎮 | التعليم الابتدائي التونسي 🇹🇳
        </div>
      </div>
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────
const backBtnStyle = {
  padding: "7px 14px", borderRadius: "20px", border: "none",
  background: "#f0f0ff", color: "#667eea", fontWeight: 700,
  cursor: "pointer", fontSize: "13px", flexShrink: 0,
};
const labelStyle = {
  fontWeight: 700, color: "#555", fontSize: "12px",
  display: "block", marginBottom: "8px",
};
const chipStyle = {
  padding: "10px 6px", borderRadius: "12px", border: "none",
  fontWeight: 700, fontSize: "12px", cursor: "pointer", transition: "all .2s",
};

export default function PlayPage() {
  return (
    <PageShell showBack backHref="/dashboard">
      <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", padding: "40px" }}><Spinner /></div>}>
        <PlayContent />
      </Suspense>
    </PageShell>
  );
}
