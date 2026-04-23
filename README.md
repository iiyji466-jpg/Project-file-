# Project-file-
# 🤖 BotForge - مساعد الذكاء الاصطناعي

مجموعة بوتات ذكية مدعومة بـ Gemini AI مبنية بـ Next.js

## 🚀 تشغيل المشروع

### 1. تثبيت المكتبات
```bash
npm install
```

### 2. إعداد مفتاح API
أنشئ ملف `.env.local` وضع فيه:
```
GEMINI_API_KEY=AIzaSy...مفتاحك_هنا
```

احصل على مفتاح مجاني من: https://aistudio.google.com

### 3. تشغيل المشروع
```bash
npm run dev
```

افتح المتصفح على: http://localhost:3000

## 📁 هيكل الملفات
```
├── lib/
│   └── bots.ts          # تعريف البوتات
├── pages/
│   ├── api/
│   │   ├── chat.ts      # API الدردشة مع Gemini
│   │   └── download.ts  # API تحميل الفيديو
│   ├── bot/
│   │   └── [id].tsx     # صفحة كل بوت
│   ├── _app.tsx
│   ├── _document.tsx
│   └── index.tsx        # الصفحة الرئيسية
└── styles/
    └── globals.css
```

## 🌐 النشر على Vercel
1. ارفع المشروع على GitHub
2. اربطه بـ Vercel
3. أضف `GEMINI_API_KEY` في Settings → Environment Variables
4. انشر المشروع

## 🤖 البوتات المتاحة
- 🌐 مترجم وموسوعة
- 📁 تحويل الملفات والإنتاجية  
- 🛡️ إدارة المجموعات
- 📥 صياد المقاطع الذكي
