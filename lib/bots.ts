export interface Bot {
  id: string
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  icon: string
  color: string
  gradient: string
  category: string
  categoryAr: string
  systemPrompt: string
  placeholder: string
  examples: string[]
}

export const BOTS: Bot[] = [
  {
    id: 'translator',
    nameAr: '🌐 مترجم وموسوعة',
    name: 'Translator',
    description: 'Translate between 100+ languages',
    descriptionAr: 'ترجمة فورية بين 100+ لغة مع معلومات موسوعية',
    icon: '🌐',
    color: '#00ff87',
    gradient: 'from-green-400 to-emerald-600',
    category: 'Language',
    categoryAr: 'لغة وترجمة',
    systemPrompt: `أنت مساعد ترجمة وموسوعة ذكي. مهامك:
1. ترجم أي نص بين أي لغتين بدقة عالية.
2. أجب على الأسئلة الموسوعية بمعلومات مفصلة.
3. اشرح الكلمات والمصطلحات.
4. قدم معلومات ثقافية حول اللغات.
الرد بالعربية إلا إذا طُلب غير ذلك.`,
    placeholder: 'اكتب نصاً للترجمة أو سؤالاً موسوعياً...',
    examples: ['ترجم Hello World إلى العربية', 'ما معنى كلمة Renaissance؟', 'ترجم إلى الفرنسية: أحب البرمجة']
  },
  {
    id: 'files',
    nameAr: '📁 تحويل الملفات والإنتاجية',
    name: 'File Converter',
    description: 'File format guidance and productivity',
    descriptionAr: 'إرشادات تحويل الملفات ونصائح الإنتاجية',
    icon: '📁',
    color: '#60a5fa',
    gradient: 'from-blue-400 to-blue-600',
    category: 'Productivity',
    categoryAr: 'إنتاجية',
    systemPrompt: `أنت مساعد إنتاجية وتحويل ملفات خبير. مهامك:
1. إرشاد المستخدم لتحويل الملفات بين الصيغ المختلفة.
2. اقتراح أفضل الأدوات المجانية والمدفوعة.
3. تنسيق وكتابة الوثائق المهنية.
4. نصائح إنتاجية وتنظيم العمل.
الرد بالعربية.`,
    placeholder: 'كيف أحول ملف PDF إلى Word؟',
    examples: ['كيف أحول PDF إلى Word مجاناً؟', 'اكتب قالب سيرة ذاتية', 'نصائح للإنتاجية اليومية']
  },
  {
    id: 'admin',
    nameAr: '🛡️ إدارة المجموعات',
    name: 'Group Manager',
    description: 'Manage Telegram/WhatsApp groups',
    descriptionAr: 'إدارة مجموعات تيليجرام وواتساب وديسكورد',
    icon: '🛡️',
    color: '#f59e0b',
    gradient: 'from-yellow-400 to-orange-500',
    category: 'Management',
    categoryAr: 'إدارة',
    systemPrompt: `أنت خبير إدارة مجموعات التواصل الاجتماعي. مهامك:
1. كتابة قواعد وأنظمة المجموعات.
2. نصائح إدارة تيليجرام وواتساب وديسكورد.
3. حل النزاعات والتعامل مع الأعضاء.
4. إنشاء رسائل ترحيب وإشعارات.
5. استراتيجيات نمو المجموعات وتفاعلها.
الرد بالعربية.`,
    placeholder: 'كيف أنظم مجموعة تيليجرام بنجاح؟',
    examples: ['اكتب قوانين لمجموعة برمجة', 'كيف أمنع السبام في واتساب؟', 'رسالة ترحيب للأعضاء الجدد']
  },
  {
    id: 'downloader',
    nameAr: '📥 صياد المقاطع الذكي',
    name: 'Video Downloader',
    description: 'Download videos from any platform',
    descriptionAr: 'تحميل المقاطع من يوتيوب، تيك توك، وإنستقرام برابط مباشر',
    icon: '📥',
    color: '#ff4b2b',
    gradient: 'from-red-500 to-orange-600',
    category: 'Media',
    categoryAr: 'وسائط ومتعدد',
    systemPrompt: `أنت مساعد متخصص في تحميل الفيديوهات. مهامك:
1. استخراج روابط التحميل المباشرة من المنصات.
2. شرح كيفية التحميل بأعلى جودة.
الرد بالعربية.`,
    placeholder: 'ضع رابط الفيديو هنا للتحميل...',
    examples: ['حمل فيديو من يوتيوب', 'تيك توك بدون علامة مائية', 'تحميل ريلز إنستقرام']
  }
]
