import Head from 'next/head'
import Link from 'next/link'
import { BOTS } from '../lib/bots'

export default function Home() {
  return (
    <>
      <Head>
        <title>مساعد الذكاء الاصطناعي</title>
        <meta name="description" content="مجموعة بوتات ذكية مدعومة بـ Gemini AI" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div
        className="min-h-screen text-white"
        dir="rtl"
        style={{ background: 'radial-gradient(circle at 20% 30%, #1a1a2e, #0f0f1a)' }}
      >
        <header className="px-6 pt-12 pb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs mb-6"
            style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-indigo-300">مدعوم بـ Gemini AI</span>
          </div>
          <h1 className="text-3xl font-bold mb-3 leading-tight">
            مساعدك الذكي<br />
            <span style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              في كل شيء
            </span>
          </h1>
          <p className="text-white/40 text-sm max-w-xs mx-auto">اختر البوت المناسب وابدأ المحادثة فوراً</p>
        </header>

        <main className="px-4 pb-12 max-w-lg mx-auto">
          <div className="grid grid-cols-1 gap-4">
            {BOTS.map((bot) => (
              <Link key={bot.id} href={`/bot/${bot.id}`}>
                <div
                  className="group relative p-5 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}
                >
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(135deg, ${bot.color}10, transparent)` }}
                  />
                  <div className="relative flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                      style={{ background: `linear-gradient(135deg, ${bot.color}25, ${bot.color}10)`, border: `1px solid ${bot.color}30` }}
                    >
                      {bot.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-semibold text-white/90 text-base mb-1">{bot.nameAr}</h2>
                      <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{bot.descriptionAr}</p>
                      <span
                        className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full"
                        style={{ background: `${bot.color}15`, color: bot.color, border: `1px solid ${bot.color}30` }}
                      >
                        {bot.categoryAr}
                      </span>
                    </div>
                    <div className="text-white/20 group-hover:text-white/50 transition-colors text-lg shrink-0">←</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>

        <footer className="text-center pb-8 text-white/20 text-xs">Powered by Gemini AI ✨</footer>
      </div>
    </>
  )
              }
