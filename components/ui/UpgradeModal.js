// components/ui/UpgradeModal.js
// ── نافذة الاشتراك تظهر عند الوصول للحد ──────────────────────
"use client";

export function UpgradeModal({ contact, onClose }) {
  if (!contact) return null;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 2000,
      background: "rgba(0,0,0,.7)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "16px",
    }}>
      <div style={{
        background: "white", borderRadius: "24px", padding: "28px 24px",
        maxWidth: "420px", width: "100%", textAlign: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,.3)",
        animation: "slideIn .4s ease",
      }}>
        {/* Icon */}
        <div style={{ fontSize: "56px", marginBottom: "12px" }}>🔒</div>

        {/* Title */}
        <h2 style={{
          fontWeight: 900, fontSize: "22px", color: "#1a1a2e", marginBottom: "8px",
        }}>وصلت للحد المجاني!</h2>

        <p style={{ color: "#666", fontSize: "14px", lineHeight: 1.7, marginBottom: "20px" }}>
          لقد استخدمت نسختك التجريبية المجانية 🎉<br/>
          للاستمرار في اللعب وفتح جميع الميزات، تواصل معنا للاشتراك.
        </p>

        {/* Plans */}
        <div style={{
          background: "linear-gradient(135deg,#667eea15,#764ba215)",
          border: "1.5px solid #667eea30",
          borderRadius: "16px", padding: "16px", marginBottom: "20px", textAlign: "right",
        }}>
          <div style={{ fontWeight: 800, color: "#333", marginBottom: "12px", fontSize: "14px" }}>
            📋 خطط الاشتراك
          </div>
          {[
            { name: "تلميذ",  price: "9 د/شهر",   desc: "10 ألعاب يومياً + كل المواد",     color: "#4ECDC4" },
            { name: "مدرسة",  price: "199 د/شهر",  desc: "50 نشاط يومي + لوحة معلم",        color: "#FF6B6B" },
          ].map((p, i) => (
            <div key={i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 12px", borderRadius: "12px", marginBottom: "8px",
              background: "white", border: `1.5px solid ${p.color}30`,
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "14px", color: "#333" }}>{p.name}</div>
                <div style={{ fontSize: "11px", color: "#888" }}>{p.desc}</div>
              </div>
              <div style={{
                fontWeight: 900, fontSize: "15px", color: p.color,
                background: `${p.color}15`, padding: "4px 10px", borderRadius: "20px",
              }}>{p.price}</div>
            </div>
          ))}
        </div>

        {/* Contact Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>

          {/* WhatsApp */}
          <a href={`https://wa.me/${contact.whatsapp?.replace(/[^0-9]/g, "")}`}
            target="_blank" rel="noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              padding: "13px", borderRadius: "14px", textDecoration: "none",
              background: "linear-gradient(135deg,#25D366,#128C7E)",
              color: "white", fontWeight: 700, fontSize: "15px",
            }}>
            <span style={{ fontSize: "22px" }}>📱</span>
            تواصل عبر واتساب
          </a>

          {/* Facebook */}
          <a href={contact.facebook} target="_blank" rel="noreferrer"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              padding: "13px", borderRadius: "14px", textDecoration: "none",
              background: "linear-gradient(135deg,#1877F2,#0d5dbf)",
              color: "white", fontWeight: 700, fontSize: "15px",
            }}>
            <span style={{ fontSize: "22px" }}>👤</span>
            تواصل عبر فيسبوك
          </a>

          {/* Email */}
          <a href={`mailto:${contact.email}?subject=طلب اشتراك - EdTech Tunisia`}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
              padding: "13px", borderRadius: "14px", textDecoration: "none",
              background: "linear-gradient(135deg,#667eea,#764ba2)",
              color: "white", fontWeight: 700, fontSize: "15px",
            }}>
            <span style={{ fontSize: "22px" }}>📧</span>
            راسلنا عبر الإيميل
          </a>
        </div>

        {/* Close */}
        <button onClick={onClose} style={{
          background: "none", border: "none", color: "#aaa",
          fontSize: "13px", cursor: "pointer", textDecoration: "underline",
        }}>
          إغلاق — أكمل التجربة المجانية لاحقاً
        </button>
      </div>
    </div>
  );
}


// ── Usage Bar — يظهر في أعلى صفحة اللعب ──────────────────────
export function UsageBar({ used, limit, plan }) {
  const pct     = Math.round((used / limit) * 100);
  const color   = pct >= 100 ? "#e74c3c" : pct >= 66 ? "#f39c12" : "#2ecc71";
  const isPaid  = plan !== "free";

  return (
    <div style={{
      background: "rgba(255,255,255,.1)", borderRadius: "12px",
      padding: "8px 14px", marginBottom: "12px",
      display: "flex", alignItems: "center", gap: "10px",
    }}>
      {/* Bar */}
      <div style={{ flex: 1 }}>
        <div style={{
          display: "flex", justifyContent: "space-between",
          fontSize: "11px", color: "rgba(255,255,255,.7)", marginBottom: "4px",
        }}>
          <span>الاستخدام اليومي</span>
          <span style={{ color: pct >= 100 ? "#FF6B6B" : "rgba(255,255,255,.7)" }}>
            {used}/{limit} {isPaid ? "⭐" : "🆓"}
          </span>
        </div>
        <div style={{ height: "5px", borderRadius: "10px", background: "rgba(255,255,255,.2)" }}>
          <div style={{
            width: `${Math.min(pct, 100)}%`, height: "100%",
            borderRadius: "10px", background: color,
            transition: "width .5s",
          }} />
        </div>
      </div>

      {/* Plan Badge */}
      <div style={{
        padding: "3px 8px", borderRadius: "20px", fontSize: "10px", fontWeight: 700,
        background: isPaid ? "#FFE66D20" : "rgba(255,255,255,.1)",
        color: isPaid ? "#FFE66D" : "rgba(255,255,255,.6)",
        border: `1px solid ${isPaid ? "#FFE66D40" : "rgba(255,255,255,.2)"}`,
        flexShrink: 0,
      }}>
        {isPaid ? "⭐ مميز" : "🆓 مجاني"}
      </div>
    </div>
  );
}
