// components/layout/PageShell.js
"use client";
import { useRouter } from "next/navigation";
import { useStore } from "../../lib/store";
import { DIFF_COLORS } from "../../lib/constants";

// ── Stars Background ───────────────────────────────────────────
export function Stars() {
  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute",
          width: Math.random() * 3 + 1 + "px",
          height: Math.random() * 3 + 1 + "px",
          borderRadius: "50%", background: "white",
          left: Math.random() * 100 + "%",
          top:  Math.random() * 100 + "%",
          opacity: Math.random() * 0.5 + 0.1,
          animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite`,
          animationDelay: Math.random() * 2 + "s",
        }} />
      ))}
    </div>
  );
}

// ── Top Navigation ─────────────────────────────────────────────
export function TopNav({ showBack, backHref }) {
  const { user, logout } = useStore();
  const router = useRouter();
  const diff = user?.difficulty || "medium";

  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      marginBottom: "16px", position: "relative", zIndex: 10,
    }}>
      {/* Right: back + nav */}
      <div style={{ display: "flex", gap: "8px" }}>
        {showBack && (
          <button onClick={() => router.push(backHref || "/dashboard")} style={navBtn}>
            ← رجوع
          </button>
        )}
        {!showBack && (
          <>
            <button onClick={() => router.push("/leaderboard")} style={navBtn}>🏆 الشرف</button>
            <button onClick={() => router.push("/teacher")}     style={navBtn}>📊 المعلم</button>
          </>
        )}
      </div>

      {/* Left: user info */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {user && (
          <div style={{
            padding: "5px 12px", borderRadius: "20px",
            background: DIFF_COLORS[diff].bg, color: DIFF_COLORS[diff].text,
            fontSize: "11px", fontWeight: 700,
          }}>
            {DIFF_COLORS[diff].label}
          </div>
        )}
        <div style={{ color: "rgba(255,255,255,.7)", fontSize: "13px", fontWeight: 600 }}>
          {user ? `${user.avatar} ${user.name.split(" ")[0]}` : "ضيف"}
        </div>
        {user && (
          <button onClick={() => { logout(); router.push("/login"); }} style={{ ...navBtn, fontSize: "11px" }}>
            خروج
          </button>
        )}
      </div>
    </div>
  );
}

const navBtn = {
  padding: "7px 13px", borderRadius: "20px", border: "none",
  background: "rgba(255,255,255,.12)", color: "white",
  fontSize: "12px", fontWeight: 700, cursor: "pointer",
};

// ── Page Container ─────────────────────────────────────────────
export function PageShell({ children, showBack, backHref, hideNav }) {
  return (
    <div style={{ minHeight: "100vh", position: "relative" }}>
      <Stars />
      <div style={{
        maxWidth: "540px", margin: "0 auto", padding: "16px",
        position: "relative", zIndex: 10, minHeight: "100vh",
        display: "flex", flexDirection: "column",
      }}>
        {!hideNav && <TopNav showBack={showBack} backHref={backHref} />}
        {children}
        <div style={{ textAlign: "center", padding: "12px", color: "rgba(255,255,255,.25)", fontSize: "10px", marginTop: "auto" }}>
          تعلّم ولعب 🎮 | التعليم الابتدائي التونسي 🇹🇳
        </div>
      </div>
    </div>
  );
}
