// lib/constants.js
// ── ثوابت التطبيق ──────────────────────────────────────────────

export const GRADES = [
  "الأول","الثاني","الثالث","الرابع","الخامس","السادس"
];

export const SUBJECTS = {
  math:    { label:"رياضيات", emoji:"🔢", color:"#FF6B6B", light:"#fff0f0" },
  arabic:  { label:"عربية",   emoji:"✍️", color:"#4ECDC4", light:"#f0fffe" },
  science: { label:"علوم",    emoji:"🔬", color:"#45B7D1", light:"#f0f8ff" },
  french:  { label:"فرنسية",   emoji:"🇫🇷", color:"#764ba2", light:"#f5f0ff" },
  english: { label:"إنجليزية",emoji:"🌍", color:"#96CEB4", light:"#f0fff4" },
};

export const LESSONS = {
  math:    ["الجمع","الطرح","الضرب","القسمة","الكسور","الهندسة"],
  arabic:  ["القراءة","الإملاء","النحو","المفردات","التعبير"],
  science: ["الحيوانات","النباتات","الجسم البشري","الفضاء","الطاقة"],
  french:  ["La famille","Les animaux","Les couleurs","Le présent","La maison","Les vêtements","La négation","Les articles"],
  english: ["الألوان","الأرقام","الحروف","الحيوانات","الأسرة"],
};

export const GAME_TYPES = [
  { id:"bubbles", label:"فقاعات", emoji:"🫧", desc:"افقع الإجابة الصحيحة!" },
  { id:"quiz",    label:"اختيار", emoji:"🎯", desc:"اختر من 4 إجابات"        },
  { id:"match",   label:"مطابقة", emoji:"🃏", desc:"طابق السؤال بجوابه"      },
  { id:"memory",  label:"ذاكرة",  emoji:"🧠", desc:"اقلب وطابق البطاقات"    },
];

export const DIFF_COLORS = {
  easy:   { bg:"#e4f4ff", text:"#3498db", label:"سهل 💙"   },
  medium: { bg:"#fff3e4", text:"#f39c12", label:"متوسط ⚡"  },
  hard:   { bg:"#ffe4e4", text:"#e74c3c", label:"صعب 🔥"   },
};

export const AVATARS = ["👦","👧","🧒","👩","👨","🦸","🧑‍🎓","👩‍🎓"];

export const MEDALS = ["🥇","🥈","🥉","🏅","🏅"];
