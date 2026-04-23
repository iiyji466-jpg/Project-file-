import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'الطريقة غير مسموحة' })
  }

  const { messages, systemPrompt } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'الرسائل مطلوبة' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'مفتاح API غير موجود' })
  }

  try {
    const geminiMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }))

    const body: any = {
      contents: geminiMessages,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      }
    }

    if (systemPrompt) {
      body.system_instruction = {
        parts: [{ text: systemPrompt }]
      }
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      }
    )

    const data = await response.json()

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || 'خطأ في الاتصال بـ Gemini'
      })
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text

    if (!text) {
      return res.status(500).json({ error: 'لم يتم استلام رد من Gemini' })
    }

    return res.status(200).json({
      choices: [{ message: { role: 'assistant', content: text } }]
    })

  } catch (error: any) {
    return res.status(500).json({ error: 'خطأ في الخادم: ' + error.message })
  }
                                 }
