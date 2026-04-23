import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { BOTS, Bot } from '../../lib/bots'
import toast, { Toaster } from 'react-hot-toast'

interface Message {
  role: 'user' | 'assistant'
  content: string
  isDownload?: boolean
  downloadData?: {
    success: boolean
    downloadUrl?: string
    platform?: string
    alternatives?: { name: string; link: string }[]
  }
}

function BotMessage({ content }: { content: string }) {
  const lines = content.split('\n')
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        const boldLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        const withLinks = boldLine.replace(
          /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g,
          '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline hover:text-blue-300">$1</a>'
        )
        return (
          <p key={i} className={line.trim() === '' ? 'h-2' : ''} dangerouslySetInnerHTML={{ __html: withLinks }} />
        )
      })}
    </div>
  )
}

function DownloadResult({ data }: { data: Message['downloadData'] }) {
  if (!data) return null
  if (data.success && data.downloadUrl) {
    return (
      <div className="space-y-3">
        <p className="text-green-400 font-semibold">✅ تم استخراج رابط {data.platform}!</p>
        <a
          href={data.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center py-3 px-4 rounded-xl font-semibold text-white transition-all hover:scale-105"
          style={{ background: 'linear-gradient(135deg, #00ff87, #00b4d8)' }}
        >
          ⬇️ اضغط للتحميل المباشر
        </a>
      </div>
    )
  }
  return (
    <div className="space-y-3">
      <p className="text-yellow-400 font-semibold">⚠️ لم نتمكن من التحميل المباشر لـ {data.platform}</p>
      <p className="text-white/60 text-xs">جرب هذه المواقع البديلة:</p>
      <div className="flex flex-wrap gap-2">
        {data.alternatives?.map((alt, i) => (
          <a key={i} href={alt.link} target="_blank" rel="noopener noreferrer"
            className="px-3 py-1.5 text-xs rounded-lg border border-white/20 text-white/80 hover:bg-white/10 transition-all">
            🔗 {alt.name}
          </a>
        ))}
      </div>
    </div>
  )
}

export default function BotPage({ bot }: { bot: Bot }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 128) + 'px'
    }
  }, [input])

  const sendMessage = async (text?: string) => {
    const content = (text || input).trim()
    if (!content || loading) return

    const userMessage: Message = { role: 'user', content }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      if (bot.id === 'downloader') {
        const response = await fetch('/api/download', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: content }),
        })

        const ct = response.headers.get('content-type') || ''
        if (!ct.includes('application/json')) {
          throw new Error('خطأ في الخادم - أضف GEMINI_API_KEY في Vercel وأعد النشر')
        }

        const data = await response.json()
        if (data.error) {
          setMessages([...newMessages, { role: 'assistant', content: `❌ ${data.error}` }])
        } else {
          setMessages([...newMessages, { role: 'assistant', content: '', isDownload: true, downloadData: data }])
        }
      } else {
        const chatMessages = newMessages.map(m => ({ role: m.role, content: m.content }))
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: chatMessages, systemPrompt: bot.systemPrompt }),
        })

        const ct = response.headers.get('content-type') || ''
        if (!ct.includes('application/json')) {
          throw new Error('مفتاح GEMINI_API_KEY غير موجود - أضفه في Vercel من Settings ثم أعد النشر')
        }

        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'خطأ في الاستجابة')
        const replyText = data.choices?.[0]?.message?.content || 'عذراً، لم أتلقَّ رداً.'
        setMessages([...newMessages, { role: 'assistant', content: replyText }])
      }
    } catch (err: any) {
      toast.error(err.message || 'حدث خطأ غير متوقع', { duration: 5000 })
      setMessages(newMessages.slice(0, -1))
      setInput(content)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      <Head>
        <title>{bot.nameAr}</title>
      </Head>
      <Toaster position="top-center" toastOptions={{
        style: { background: '#1e1e2f', color: '#fff', borderRadius: '16px', padding: '12px 16px', fontSize: '14px' },
        success: { iconTheme: { primary: '#00ff87', secondary: '#1e1e2f' } },
        error: { iconTheme: { primary: '#ff4b2b', secondary: '#1e1e2f' } }
      }} />

      <div className="min-h-screen flex flex-col text-white" dir="rtl"
        style={{ background: 'radial-gradient(circle at 20% 30%, #1a1a2e, #0f0f1a)' }}>

        <header className="sticky top-0 z-10 backdrop-blur-md bg-black/30 border-b border-white/5 px-4 py-3">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            <Link href="/" className="flex items-center gap-1 text-white/40 hover:text-white/80 transition-colors text-sm">
              <span className="text-lg">←</span> رجوع
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-xl">{bot.icon}</span>
              <h1 className="text-base font-semibold">{bot.nameAr}</h1>
            </div>
            {messages.length > 0 ? (
              <button onClick={() => { setMessages([]); toast.success('تم مسح المحادثة') }}
                className="text-white/30 hover:text-white/60 text-xs transition-colors px-2 py-1 rounded-lg hover:bg-white/5">
                مسح
              </button>
            ) : <div className="w-10" />}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4 max-w-3xl mx-auto w-full">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-10 text-center">
              <div className="text-5xl mb-4 p-5 rounded-3xl"
                style={{ background: `linear-gradient(135deg, ${bot.color}25, ${bot.color}08)`, border: `1px solid ${bot.color}30` }}>
                {bot.icon}
              </div>
              <h2 className="text-lg font-semibold text-white/90">{bot.nameAr}</h2>
              <p className="text-white/40 text-sm mt-1 max-w-xs leading-relaxed">{bot.descriptionAr}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {bot.examples.map((ex, i) => (
                  <button key={i} onClick={() => sendMessage(ex)}
                    className="px-4 py-2 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/70 hover:text-white transition-all">
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'assistant' && (
                <div className="shrink-0 ml-2 mt-1 w-8 h-8 rounded-full flex items-center justify-center text-sm"
                  style={{ background: `${bot.color}20`, border: `1px solid ${bot.color}40` }}>
                  {bot.icon}
                </div>
              )}
              <div
                className={`relative max-w-[80%] px-4 py-3 text-sm leading-relaxed shadow-lg ${msg.role === 'user' ? 'rounded-2xl rounded-tr-sm' : 'rounded-2xl rounded-tl-sm text-white/90'}`}
                style={{
                  background: msg.role === 'user' ? 'linear-gradient(145deg, #3b82f6, #2563eb)' : 'rgba(255,255,255,0.06)',
                  border: msg.role === 'assistant' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                  backdropFilter: msg.role === 'assistant' ? 'blur(10px)' : 'none'
                }}
              >
                {msg.isDownload ? <DownloadResult data={msg.downloadData} /> : <BotMessage content={msg.content} />}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0"
                style={{ background: `${bot.color}20`, border: `1px solid ${bot.color}40` }}>
                {bot.icon}
              </div>
              <div className="bg-white/6 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/8">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                  <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <footer className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-sm">
          <div className="flex gap-3 items-end max-w-3xl mx-auto">
            <div className="flex-1 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 focus-within:border-blue-500/40 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
              <textarea
                ref={textareaRef}
                className="w-full bg-transparent outline-none text-sm p-4 resize-none text-white placeholder-white/30"
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={bot.placeholder || 'اكتب رسالتك...'}
                disabled={loading}
                style={{ minHeight: '52px', maxHeight: '128px' }}
              />
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="shrink-0 p-4 rounded-2xl text-white disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all duration-200"
              style={{
                background: input.trim() && !loading ? 'linear-gradient(135deg, #3b82f6, #2563eb)' : 'rgba(59,130,246,0.3)',
                boxShadow: input.trim() && !loading ? '0 8px 20px rgba(59,130,246,0.3)' : 'none'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
          <p className="text-center text-white/15 text-[10px] mt-2">Enter للإرسال • Shift+Enter لسطر جديد</p>
        </footer>
      </div>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: BOTS.map((bot) => ({ params: { id: bot.id } })), fallback: false }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const bot = BOTS.find((b) => b.id === params?.id)
  if (!bot) return { notFound: true }
  return { props: { bot } }
}