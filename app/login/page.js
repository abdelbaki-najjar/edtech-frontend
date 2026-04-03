// app/login/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "../../lib/api";
import { useStore } from "../../lib/store";
import { PageShell } from "../../components/layout/PageShell";
import { Card, Btn, Input, ErrorBox } from "../../components/ui";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const { login } = useStore();
  const router = useRouter();

  async function handleLogin() {
    if (!email || !password) { setError("يرجى ملء كل الحقول"); return; }
    setLoading(true); setError("");
    try {
      const res = await authAPI.login({ email, password });
      login(res.token, res.student);
      router.push("/dashboard");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell hideNav>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "56px", marginBottom: "10px", animation: "pulse 2s infinite" }}>🎮</div>
          <h1 style={{
            fontSize: "clamp(26px,6vw,36px)", fontWeight: 900, margin: 0,
            background: "linear-gradient(135deg,#FFE66D,#FF6B6B,#4ECDC4)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>تعلّم ولعب!</h1>
          <p style={{ color: "rgba(255,255,255,.6)", fontSize: "13px", marginTop: "6px" }}>
            سجّل دخولك وابدأ المغامرة 🚀
          </p>
        </div>

        <Card style={{ padding: "28px 24px" }}>
          <h2 style={{ fontWeight: 900, color: "#1a1a2e", marginBottom: "20px", fontSize: "20px" }}>🔐 تسجيل الدخول</h2>
          <ErrorBox message={error} />
          <Input label="البريد الإلكتروني" type="email" value={email} onChange={setEmail}
            placeholder="example@email.com" icon="📧" />
          <Input label="كلمة المرور" type="password" value={password} onChange={setPassword}
            placeholder="••••••••" icon="🔑" />

          <Btn onClick={handleLogin} disabled={loading} full color="linear-gradient(135deg,#667eea,#764ba2)"
            style={{ marginTop: "8px", fontSize: "17px", padding: "16px" }}>
            {loading ? "جاري الدخول..." : "دخول →"}
          </Btn>

          <p style={{ textAlign: "center", marginTop: "16px", fontSize: "13px", color: "#888" }}>
            ليس لديك حساب؟{" "}
            <span onClick={() => router.push("/register")} style={{ color: "#667eea", fontWeight: 700, cursor: "pointer" }}>
              سجّل الآن
            </span>
          </p>
        </Card>
      </div>
    </PageShell>
  );
}
