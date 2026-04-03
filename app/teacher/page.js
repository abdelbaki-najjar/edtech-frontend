// app/teacher/page.js
"use client";
import { useState, useEffect } from "react";
import { analyticsAPI } from "../../lib/api";
import { PageShell } from "../../components/layout/PageShell";
import { Card, Spinner } from "../../components/ui";
import { SUBJECTS } from "../../lib/constants";

export default function TeacherPage() {
  const [data,  setData]  = useState(null);
  const [recs,  setRecs]  = useState([]);
  const [tab,   setTab]   = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([analyticsAPI.getOverview(), analyticsAPI.getRecommendations()])
      .then(([overview, recommendations]) => {
        setData(overview);
        setRecs(recommendations.recommendations || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <PageShell showBack>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spinner size={60} />
      </div>
    </PageShell>
  );

  const tabs = [
    { id: "overview", label: "نظرة عامة" },
    { id: "subjects", label: "المواد"    },
    { id: "recs",     label: "توصيات AI" },
  ];

  return (
    <PageShell showBack backHref="/dashboard">
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <div style={{ fontSize: "40px", marginBottom: "6px" }}>📊</div>
        <h1 style={{ fontWeight: 900, color: "white", fontSize: "22px", margin: 0 }}>لوحة المعلم</h1>
      </div>

      {/* Stat Cards */}
      {data && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "9px", marginBottom: "14px" }}>
          {[
            { icon: "🎮", label: "الجلسات", val: data.total_sessions,       color: "#FF6B6B" },
            { icon: "📈", label: "المعدل",  val: data.avg_score + "%",      color: "#4ECDC4" },
            { icon: "🏫", label: "المواد",  val: Object.keys(data.subject_stats || {}).length, color: "#45B7D1" },
          ].map((c, i) => (
            <div key={i} style={{
              background: `${c.color}20`, border: `1.5px solid ${c.color}40`,
              borderRadius: "16px", padding: "14px 8px", textAlign: "center",
            }}>
              <div style={{ fontSize: "22px", marginBottom: "3px" }}>{c.icon}</div>
              <div style={{ fontWeight: 900, fontSize: "20px", color: c.color }}>{c.val}</div>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,.5)", fontWeight: 600 }}>{c.label}</div>
            </div>
          ))}
        </div>
      )}

      <Card style={{ padding: "18px" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: "7px", marginBottom: "18px", borderBottom: "2px solid #f0f0f0", paddingBottom: "12px" }}>
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "7px 14px", borderRadius: "20px", border: "none",
              fontWeight: 700, fontSize: "12px", cursor: "pointer",
              background: tab === t.id ? "linear-gradient(135deg,#667eea,#764ba2)" : "#f0f0ff",
              color: tab === t.id ? "white" : "#667eea",
            }}>{t.label}</button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && data && (
          <div>
            <div style={{ fontWeight: 700, color: "#333", marginBottom: "10px", fontSize: "14px" }}>🔥 أفضل الطلاب</div>
            {(data.top_students || []).map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "9px", borderRadius: "12px", background: "#fafafa", marginBottom: "5px" }}>
                <span style={{ fontSize: "20px" }}>{"🥇🥈🥉🏅🏅"[i]}</span>
                <span style={{ fontSize: "20px" }}>{s.avatar}</span>
                <div style={{ flex: 1, fontWeight: 700, fontSize: "13px" }}>{s.name}</div>
                <div style={{ fontWeight: 800, color: "#667eea", fontSize: "14px" }}>{s.xp} XP</div>
                <div style={{ fontWeight: 700, color: "#2ecc71", fontSize: "13px" }}>{s.avg}%</div>
              </div>
            ))}

            <div style={{ fontWeight: 700, color: "#333", marginTop: "16px", marginBottom: "10px", fontSize: "14px" }}>📅 آخر الجلسات</div>
            {(data.recent_sessions || []).map((s, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center", padding: "8px", borderRadius: "10px", background: "#fafafa", marginBottom: "5px", fontSize: "12px" }}>
                <span>{SUBJECTS[s.subject]?.emoji}</span>
                <span style={{ flex: 1, fontWeight: 600 }}>{SUBJECTS[s.subject]?.label} — {s.lesson}</span>
                <span style={{ color: s.score / s.total >= 0.8 ? "#2ecc71" : "#e74c3c", fontWeight: 700 }}>
                  {s.score}/{s.total}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Subjects */}
        {tab === "subjects" && data && (
          <div>
            {Object.entries(data.subject_stats || {}).map(([sub, stats]) => (
              <div key={sub} style={{ marginBottom: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <span style={{ fontWeight: 700, fontSize: "13px" }}>
                    {SUBJECTS[sub]?.emoji} {SUBJECTS[sub]?.label}
                  </span>
                  <span style={{ fontWeight: 800, color: SUBJECTS[sub]?.color, fontSize: "13px" }}>
                    {stats.avg}% ({stats.count} جلسة)
                  </span>
                </div>
                <div style={{ height: "9px", borderRadius: "10px", background: "#eee", overflow: "hidden" }}>
                  <div style={{
                    width: `${stats.avg}%`, height: "100%", borderRadius: "10px",
                    background: `linear-gradient(90deg,${SUBJECTS[sub]?.color},${SUBJECTS[sub]?.color}bb)`,
                    transition: "width 1s",
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Recommendations */}
        {tab === "recs" && (
          <div>
            <div style={{ fontWeight: 700, color: "#333", marginBottom: "12px", fontSize: "14px" }}>
              💡 توصيات الذكاء الاصطناعي
            </div>
            {recs.length === 0 ? (
              <div style={{ textAlign: "center", color: "#aaa", padding: "24px", fontSize: "13px" }}>
                لا توجد توصيات بعد — أضف المزيد من الجلسات
              </div>
            ) : (
              recs.map((r, i) => (
                <div key={i} style={{
                  padding: "12px 14px", borderRadius: "12px", marginBottom: "8px",
                  background: r.type === "warning" ? "#fff3cd" : "#d4edda",
                  border: `1px solid ${r.type === "warning" ? "#ffc107" : "#28a745"}`,
                  fontSize: "13px",
                }}>
                  <div style={{ fontWeight: 700, marginBottom: "4px" }}>{r.message}</div>
                  <div style={{ color: "#555", fontSize: "12px" }}>👉 {r.action}</div>
                </div>
              ))
            )}
          </div>
        )}
      </Card>
    </PageShell>
  );
}
