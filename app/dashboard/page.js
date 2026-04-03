// app/dashboard/page.js
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../../lib/store";
import { PageShell } from "../../components/layout/PageShell";
import { Card, Btn, Spinner } from "../../components/ui";
import { DIFF_COLORS, GAME_TYPES } from "../../lib/constants";

export default function Dashboard() {
  const { user, isLoading } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading]);

  if (isLoading) return (
    <PageShell>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
        <Spinner size={60} />
      </div>
    </PageShell>
  );

  if (!user) return null;

  const diff = user.difficulty || "medium";
  const diffStyle = DIFF_COLORS[diff];
  const pct = Math.min((user.total_xp % 100), 100); // XP progress to next level
  const level = Math.floor(user.total_xp / 100) + 1;

  return (
    <PageShell>
      {/* Header */}
      <div style={{ textAlign: "center", padding: "10px 0 18px" }}>
        <div style={{ fontSize: "50px", marginBottom: "6px", animation: "pulse 2s infinite" }}>🎮</div>
        <h1 style={{
          fontSize: "clamp(22px,5vw,32px)", fontWeight: 900, margin: 0,
          background: "linear-gradient(135deg,#FFE66D,#FF6B6B,#4ECDC4)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>تعلّم ولعب!</h1>
      </div>

      {/* User Card */}
      <Card style={{ padding: "20px", marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
          <span style={{ fontSize: "48px" }}>{user.avatar}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 900, fontSize: "17px", color: "#1a1a2e" }}>{user.name}</div>
            <div style={{ fontSize: "12px", color: "#888", margin: "3px 0" }}>
              المستوى {level} | {user.total_sessions || 0} جلسة
            </div>
            <div style={{ fontSize: "14px" }}>{(user.badges || []).join(" ")}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{
              fontWeight: 900, fontSize: "22px", color: "#667eea",
              background: "#f0f0ff", padding: "10px 14px", borderRadius: "14px",
            }}>{user.total_xp}</div>
            <div style={{ fontSize: "10px", color: "#aaa", marginTop: "3px" }}>XP</div>
          </div>
        </div>

        {/* XP Progress */}
        <div style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#aaa", marginBottom: "5px" }}>
            <span>تقدم نحو المستوى {level + 1}</span>
            <span>{pct}%</span>
          </div>
          <div style={{ height: "8px", borderRadius: "10px", background: "#e8e8ff", overflow: "hidden" }}>
            <div style={{
              width: `${pct}%`, height: "100%", borderRadius: "10px",
              background: "linear-gradient(90deg,#667eea,#f5576c)",
              transition: "width 1s ease",
            }} />
          </div>
        </div>

        {/* Difficulty Badge */}
        <div style={{
          display: "inline-block", padding: "5px 14px", borderRadius: "20px",
          fontSize: "12px", fontWeight: 700,
          background: diffStyle.bg, color: diffStyle.text,
        }}>
          ⚡ مستوى AI التكيّفي: {diffStyle.label}
        </div>
      </Card>

      {/* Start Button */}
      <Btn
        onClick={() => router.push("/play")}
        full color="linear-gradient(135deg,#667eea,#764ba2)"
        style={{ fontSize: "18px", padding: "18px", marginBottom: "14px" }}
      >
        🚀 ابدأ اللعب الآن!
      </Btn>

      {/* Games Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "14px" }}>
        {GAME_TYPES.map((g) => (
          <div key={g.id} onClick={() => router.push(`/play?game=${g.id}`)} style={{
            background: "rgba(255,255,255,.1)", backdropFilter: "blur(10px)",
            borderRadius: "16px", padding: "16px 12px",
            border: "1px solid rgba(255,255,255,.15)",
            cursor: "pointer", transition: "all .2s", textAlign: "center",
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,.18)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,.1)")}
          >
            <div style={{ fontSize: "28px", marginBottom: "6px" }}>{g.emoji}</div>
            <div style={{ fontWeight: 700, color: "white", fontSize: "13px" }}>{g.label}</div>
            <div style={{ color: "rgba(255,255,255,.5)", fontSize: "11px", marginTop: "3px" }}>{g.desc}</div>
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
        {[
          { icon: "⭐", label: "XP",      val: user.total_xp },
          { icon: "📈", label: "معدل",   val: (user.avg_score || 0) + "%" },
          { icon: "🎮", label: "جلسات", val: user.total_sessions || 0 },
        ].map((s, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,.08)", borderRadius: "14px",
            padding: "14px 8px", textAlign: "center",
            border: "1px solid rgba(255,255,255,.1)",
          }}>
            <div style={{ fontSize: "22px", marginBottom: "4px" }}>{s.icon}</div>
            <div style={{ fontWeight: 900, fontSize: "18px", color: "white" }}>{s.val}</div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,.5)" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
