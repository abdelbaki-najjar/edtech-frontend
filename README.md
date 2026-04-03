# 🎮 EdTech Tunisia — Next.js Frontend

---
02/29  720
## 🗂️ هيكل المشروع

```
edtech-frontend/
│
├── app/                        ← صفحات Next.js (App Router)
│   ├── layout.js               ← Layout الرئيسي + Font
│   ├── page.js                 ← Redirect تلقائي
│   ├── globals.css             ← CSS + Animations
│   ├── login/page.js           ← 🔐 صفحة الدخول
│   ├── register/page.js        ← 📝 صفحة التسجيل
│   ├── dashboard/page.js       ← 🏠القسم حة الرئيسية
│   ├── play/page.js            ← 🎮 اختيار اللعبة + اللعب
│   ├── leaderboard/page.js     ← 🏆 لوحة الشرف
│   └── teacher/page.js         ← 📊 لوحة المعلم
│
├── components/
│   ├── ui/index.js             ← Btn, Card, Input, Spinner...
│   ├── layout/PageShell.js     ← Nav + Stars background
│   └── games/index.js          ← 4 ألعاب + ScoreScreen
│
├── lib/
│   ├── api.js                  ← كل طلبات FastAPI Backend
│   ├── store.js                ← Global State (React Context)
│   └── constants.js            ← GRADES, SUBJECTS, GAMES...
│
├── .env.local                  ← رابط الـ Backend
├── next.config.js
└── package.json
```

---

## ⚡ تشغيل المشروع

```bash
# 1. تثبيت المكتبات
npm install

# 2. إعداد الـ Backend URL
# في .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000

# 3. تشغيل
npm run dev

# افتح: http://localhost:3000
```

---

## 🔗القسم حات

| الرابط        |القسم حة              |
|--------------|---------------------|
| /            | توجيه تلقائي         |
| /login       | تسجيل الدخول         |
| /register    | إنشاء حساب          |
| /dashboard   |القسم حة الرئيسية     |
| /play        | اختيار لعبة والعب   |
| /leaderboard | لوحة الشرف          |
| /teacher     | لوحة المعلم         |

---

## 🚀 النشر على Vercel

```bash
# 1. ارفع على GitHub
git init && git add . && git commit -m "🚀 init"
git push origin main

# 2. vercel.com → Import → Deploy
# 3. أضف Environment Variable:
#    NEXT_PUBLIC_API_URL = https://your-api.railway.app
```
