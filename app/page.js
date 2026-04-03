// app/page.js
//القسم حة الرئيسية → تحويل تلقائي
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../lib/store";
import { Spinner } from "../components/ui";

export default function Home() {
  const { user, isLoading } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      router.replace(user ? "/dashboard" : "/login");
    }
  }, [user, isLoading]);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg,#1a1a2e,#16213e,#0f3460)",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "60px", marginBottom: "16px", animation: "pulse 2s infinite" }}>🎮</div>
        <Spinner size={40} />
      </div>
    </div>
  );
}
