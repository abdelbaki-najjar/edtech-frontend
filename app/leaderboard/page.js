// app/leaderboard/page.js
"use client";
import { useState, useEffect } from "react";
import { studentsAPI } from "../../lib/api";
import { PageShell } from "../../components/layout/PageShell";
import { Card, Spinner } from "../../components/ui";
import { MEDALS } from "../../lib/constants";

export default function LeaderboardPage() {
  const [students, setStudents] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    studentsAPI.getLeaderboard()
      .then(setStudents)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageShell showBack><div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center" }}><Spinner size={60} /></div></PageShell>;

  const top3 = students.slice(0, 3);
  const rest  = students.slice(3);

  return (
    <PageShell showBack backHref="/dashboard">
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <div style={{ fontSize: "44px", marginBottom: "6px" }}>🏆</div>
        <h1 style={{ fontWeight: 900, color: "white", fontSize: "24px", margin: 0 }}>لوحة الشرف</h1>
        <p style={{ color: "rgba(255,255,255,.5)", fontSize: "13px", marginTop: "4px" }}>أفضل اللاعبين هذا الأسبوع</p>
      </div>

      {/* Podium */}
      {top3.length > 0 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: "10px", marginBottom: "16px" }}>
          {[top3[1], top3[0], top3[2]].map((s, pi) => {
            if (!s) return <div key={pi} style={{ width: "100px" }} />;
            const hh = ["100px","130px","85px"][pi];
            const cc = ["#C0C0C0","#FFD700","#CD7F32"][pi];
            const medal = ["🥈","🥇","🥉"][pi];
            return (
              <div key={s.id} style={{ textAlign: "center", flex: 1, maxWidth: "130px" }}>
                <div style={{ fontSize: "32px", marginBottom: "3px" }}>{s.avatar}</div>
                <div style={{ fontWeight: 800, fontSize: "12px", color: "white", marginBottom: "3px" }}>
                  {s.name.split(" ")[0]}
                </div>
                <div style={{ fontWeight: 900, fontSize: "13px", color: "#FFE66D", marginBottom: "5px" }}>
                  {s.total_xp} XP
                </div>
                <div style={{
                  background: cc, borderRadius: "10px 10px 0 0", height: hh,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "26px", boxShadow: `0 -4px 20px ${cc}60`,
                }}>{medal}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full List */}
      <Card style={{ padding: "14px" }}>
        {students.map((s, i) => (
          <div key={s.id} style={{
            display: "flex", alignItems: "center", gap: "10px",
            padding: "11px 9px", borderRadius: "12px", marginBottom: "5px",
            background: i === 0 ? "#FFF9C4" : i === 1 ? "#F5F5F5" : i === 2 ? "#FFF0E0" : "#fafafa",
          }}>
            <span style={{
              width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
              background: i < 3 ? ["#FFD700","#C0C0C0","#CD7F32"][i] : "#e0e0e0",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 900, fontSize: "12px", color: i < 3 ? "white" : "#666",
            }}>{i + 1}</span>
            <span style={{ fontSize: "24px" }}>{s.avatar}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: "14px", color: "#333" }}>{s.name}</div>
              <div style={{ display: "flex", gap: "2px", marginTop: "1px" }}>
                {(s.badges || []).map((b, j) => <span key={j} style={{ fontSize: "11px" }}>{b}</span>)}
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 900, fontSize: "15px", color: "#667eea" }}>{s.total_xp}</div>
              <div style={{ fontSize: "9px", color: "#aaa" }}>XP</div>
            </div>
            <div style={{ textAlign: "center", minWidth: "40px" }}>
              <div style={{ fontWeight: 700, fontSize: "13px", color: "#2ecc71" }}>{s.avg_score}%</div>
              <div style={{ fontSize: "9px", color: "#aaa" }}>معدل</div>
            </div>
          </div>
        ))}

        {students.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px", color: "#aaa", fontSize: "14px" }}>
            لا توجد بيانات بعد 🎯
          </div>
        )}
      </Card>
    </PageShell>
  );
}
