// app/layout.js
import { StoreProvider } from "../lib/store";
import "./globals.css";

export const metadata = {
  title: "تعلّم ولعب 🎮 | EdTech Tunisia",
  description: "منصة الألعاب التعليمية للتعليم الابتدائي التونسي",
  lang: "ar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
