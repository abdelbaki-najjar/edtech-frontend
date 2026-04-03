// app/register/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "../../lib/api";
import { useStore } from "../../lib/store";
import { PageShell } from "../../components/layout/PageShell";
import { Card, Btn, Input, ErrorBox } from "../../components/ui";
import { GRADES, AVATARS } from "../../lib/constants";

export default function RegisterPage() {
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [grade, setGrade]       = useState(3);
  const [avatar, setAvatar]     = useState("👦");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const { login } = useStore();
  const router = useRouter();

  async function handleRegister() {
    if (!name || !email || !password) { setError("يرجى ملء كل الحقول"); return; }
    setLoading(true); setError("");
    try {
      const res = await authAPI.register({ name, email, password, grade, avatar });
      login(res.token, { id: res.student_id, name: res.name, avatar, total_xp: 0 });
      router.push("/dashboard");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell hideNav>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, paddingTop: "20px" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ fontSize: "44px", marginBottom: "8px" }}>📝</div>
          <h1 style={{
            fontSize: "28px", fontWeight: 900, margin: 0,
            background: "linear-gradient(135deg,#FFE66D,#FF6B6B)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>إنشاء حساب جديد</h1>
        </div>

        <Card style={{ padding: "24px 20px" }}>
          <ErrorBox message={error} />

          {/* Avatar Picker */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontWeight: 700, color: "#555", fontSize: "13px", display: "block", marginBottom: "8px" }}>
              اختر صورتك
            </label>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {AVATARS.map((a) => (
                <button key={a} onClick={() => setAvatar(a)} style={{
                  fontSize: "28px", width: "48px", height: "48px", borderRadius: "12px",
                  border: avatar === a ? "3px solid #667eea" : "2px solid #eee",
                  background: avatar === a ? "#f0f0ff" : "white",
                  cursor: "pointer", transition: "all .2s",
                }}>{a}</button>
              ))}
            </div>
          </div>

          <Input label="الاسم الكامل"       value={name}     onChange={setName}     placeholder="مثال: أمين بن علي" icon="👤" />
          <Input label="البريد الإلكتروني"  type="email" value={email}    onChange={setEmail}    placeholder="example@email.com" icon="📧" />
          <Input label="كلمة المرور"        type="password" value={password} onChange={setPassword} placeholder="8 أحرف على الأقل" icon="🔑" />

          {/* Grade Selector */}
          <div style={{ marginBottom: "18px" }}>
            <label style={{ fontWeight: 700, color: "#555", fontSize: "13px", display: "block", marginBottom: "8px" }}>
             القسم  الدراسي
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "7px" }}>
              {GRADES.map((g, i) => (
                <button key={i} onClick={() => setGrade(i + 1)} style={{
                  padding: "9px 5px", borderRadius: "11px", border: "none",
                  background: grade === i + 1 ? "linear-gradient(135deg,#667eea,#764ba2)" : "#f0f0ff",
                  color: grade === i + 1 ? "white" : "#555",
                  fontWeight: 700, fontSize: "11px", cursor: "pointer",
                }}>القسم  {g}</button>
              ))}
            </div>
          </div>

          <Btn onClick={handleRegister} disabled={loading} full
            color="linear-gradient(135deg,#FF6B6B,#f5576c)"
            style={{ fontSize: "16px", padding: "15px" }}>
            {loading ? "جاري التسجيل..." : "✅ إنشاء الحساب"}
          </Btn>

          <p style={{ textAlign: "center", marginTop: "14px", fontSize: "13px", color: "#888" }}>
            لديك حساب؟{" "}
            <span onClick={() => router.push("/login")} style={{ color: "#667eea", fontWeight: 700, cursor: "pointer" }}>
              سجّل دخولك
            </span>
          </p>
        </Card>
      </div>
    </PageShell>
  );
}
