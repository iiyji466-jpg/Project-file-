import type { NextApiRequest, NextApiResponse } from 'next'

const extractUrl = (text: string): string | null => {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  const result = text.match(urlRegex)
  return result ? result[0] : null
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'الطريقة غير مسموحة' })
  }

  const { url: rawInput } = req.body
  const url = extractUrl(rawInput)

  if (!url) {
    return res.status(400).json({ error: 'لم يتم العثور على رابط صحيح' })
  }

  const supportedPlatforms = ['youtube.com', 'youtu.be', 'tiktok.com', 'instagram.com', 'twitter.com', 'x.com', 'facebook.com']
  const isSupported = supportedPlatforms.some(p => url.includes(p))

  if (!isSupported) {
    return res.status(400).json({ error: 'المنصة غير مدعومة' })
  }

  try {
    // محاولة أولى: cobalt API
    const cobaltResponse = await fetch('https://api.cobalt.tools/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      },
      body: JSON.stringify({
        url: url,
        videoQuality: '720',
        filenameStyle: 'pretty',
        downloadMode: 'auto'
      })
    })

    if (cobaltResponse.ok) {
      const cobaltData = await cobaltResponse.json()
      if (cobaltData.status === 'stream' || cobaltData.status === 'redirect' || cobaltData.status === 'tunnel') {
        return res.status(200).json({
          success: true,
          downloadUrl: cobaltData.url,
          platform: detectPlatform(url)
        })
      }
      if (cobaltData.status === 'picker' && cobaltData.picker?.length > 0) {
        return res.status(200).json({
          success: true,
          downloadUrl: cobaltData.picker[0].url,
          platform: detectPlatform(url)
        })
      }
    }

    // إذا فشل أعط روابط بديلة
    return res.status(200).json({
      success: false,
      fallback: true,
      platform: detectPlatform(url),
      alternatives: getAlternatives(url)
    })

  } catch (error: any) {
    return res.status(200).json({
      success: false,
      fallback: true,
      platform: detectPlatform(url),
      alternatives: getAlternatives(url)
    })
  }
}

function detectPlatform(url: string): string {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'يوتيوب'
  if (url.includes('tiktok.com')) return 'تيك توك'
  if (url.includes('instagram.com')) return 'إنستقرام'
  if (url.includes('twitter.com') || url.includes('x.com')) return 'تويتر/X'
  if (url.includes('facebook.com')) return 'فيسبوك'
  return 'غير معروف'
}

function getAlternatives(url: string): { name: string; link: string }[] {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return [
      { name: 'Y2Mate', link: 'https://y2mate.com' },
      { name: 'SaveFrom', link: 'https://savefrom.net' },
      { name: 'SSYouTube', link: 'https://ssyoutube.com' }
    ]
  }
  if (url.includes('tiktok.com')) {
    return [
      { name: 'SnapTik', link: 'https://snaptik.app' },
      { name: 'TikMate', link: 'https://tikmate.online' }
    ]
  }
  if (url.includes('instagram.com')) {
    return [
      { name: 'InSave', link: 'https://insave.io' },
      { name: 'DownloadGram', link: 'https://downloadgram.org' }
    ]
  }
  return [{ name: 'Cobalt Tools', link: 'https://cobalt.tools' }]
}