// components/ui/index.js
// ── مكونات واجهة مشتركة ────────────────────────────────────────
"use client";

// ── Button ─────────────────────────────────────────────────────
export function Btn({ onClick, disabled, color, children, style = {}, full }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "13px 22px",
        borderRadius: "16px",
        border: "none",
        fontWeight: 800,
        fontSize: "15px",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "all .2s",
        background: disabled ? "#ddd" : (color || "linear-gradient(135deg,#667eea,#764ba2)"),
        color: "white",
        boxShadow: disabled ? "none" : "0 6px 20px rgba(0,0,0,.18)",
        width: full ? "100%" : "auto",
        ...style,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.transform = "scale(1.03)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      {children}
    </button>
  );
}

// ── Card ───────────────────────────────────────────────────────
export function Card({ children, style = {}, glass }) {
  return (
    <div
      style={{
        background: glass ? "rgba(255,255,255,.12)" : "rgba(255,255,255,.97)",
        borderRadius: "24px",
        boxShadow: glass ? "none" : "0 12px 40px rgba(0,0,0,.22)",
        backdropFilter: glass ? "blur(12px)" : "none",
        border: glass ? "1px solid rgba(255,255,255,.2)" : "none",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Input ──────────────────────────────────────────────────────
export function Input({ label, type = "text", value, onChange, placeholder, icon }) {
  return (
    <div style={{ marginBottom: "14px" }}>
      {label && (
        <label style={{ fontWeight: 700, color: "#555", fontSize: "13px", display: "block", marginBottom: "6px" }}>
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        {icon && (
          <span style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "18px" }}>
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: "100%",
            padding: icon ? "13px 42px 13px 14px" : "13px 14px",
            borderRadius: "14px",
            border: "2px solid #e8e8ff",
            fontSize: "15px",
            fontWeight: 600,
            background: "#fafaff",
            transition: "border .2s",
            color: "#333",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#667eea")}
          onBlur={(e)  => (e.target.style.borderColor = "#e8e8ff")}
        />
      </div>
    </div>
  );
}

// ── Spinner ────────────────────────────────────────────────────
export function Spinner({ size = 44 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      border: "4px solid #e0e0e0", borderTopColor: "#667eea",
      animation: "spin 1s linear infinite", margin: "0 auto",
    }} />
  );
}

// ── Progress Bar ───────────────────────────────────────────────
export function ProgressBar({ current, total, score }) {
  return (
    <div style={{ padding: "12px 16px 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "13px", color: "#888" }}>
        <span>سؤال {current + 1}/{total}</span>
        <span>⭐ {score}</span>
      </div>
      <div style={{ height: "7px", borderRadius: "10px", background: "#e8e8ff", overflow: "hidden", marginBottom: "12px" }}>
        <div style={{
          width: `${(current / total) * 100}%`, height: "100%",
          background: "linear-gradient(90deg,#667eea,#764ba2)",
          transition: "width .5s", borderRadius: "10px",
        }} />
      </div>
    </div>
  );
}

// ── Question Box ───────────────────────────────────────────────
export function QuestionBox({ text, gradient }) {
  return (
    <div style={{
      background: `linear-gradient(${gradient})`,
      borderRadius: "18px", padding: "22px", color: "white",
      fontWeight: 800, fontSize: "clamp(16px,4vw,24px)",
      textAlign: "center", margin: "0 16px 12px",
      boxShadow: "0 8px 28px rgba(0,0,0,.15)",
    }}>
      {text}
    </div>
  );
}

// ── Feedback Overlay ───────────────────────────────────────────
export function FeedbackOverlay({ text }) {
  return (
    <div style={{
      position: "fixed", top: "50%", left: "50%",
      transform: "translate(-50%,-50%)",
      background: "white", padding: "20px 36px",
      borderRadius: "18px", fontSize: "22px", fontWeight: 800,
      zIndex: 1000, boxShadow: "0 20px 60px rgba(0,0,0,.2)",
      animation: "popIn .3s cubic-bezier(.34,1.56,.64,1)",
    }}>
      {text}
    </div>
  );
}

// ── Error Box ──────────────────────────────────────────────────
export function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <div style={{
      background: "#ffd5d5", padding: "12px 16px", borderRadius: "12px",
      marginBottom: "14px", color: "#c0392b", fontSize: "13px", fontWeight: 600,
    }}>
      ⚠️ {message}
    </div>
  );
}

// ── Stars ──────────────────────────────────────────────────────
export function Stars({ count }) {
  return (
    <div style={{ fontSize: "52px", marginBottom: "12px", animation: "bounce .6s ease" }}>
      {"⭐".repeat(count)}{"☆".repeat(3 - count)}
    </div>
  );
}
