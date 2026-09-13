// Serverless API route for AI Chatbot (Vercel Serverless Function)
// Keeps GEMINI_API_KEY and system prompt completely hidden from the client browser.

const BASE_BOT_CONTEXT = `
You are an AI assistant for Bilal Mayor Abdillah's portfolio website. Your goal is to answer questions about Bilal Mayor Abdillah in a friendly, professional, and helpful manner. You should represent Bilal's personality: enthusiastic about technology, creative, and eager to learn.

Background:
- Name: Bilal Mayor Abdillah
- Education: Student at SMK Telkom Malang (Software Engineering / Rekayasa Perangkat Lunak).
- Roles: Frontend Developer, Web Developer, Software QA Enthusiast.
- Location: Malang, Indonesia.
- Focus: Developing modern, clean, and responsive web applications using React, Tailwind CSS, JavaScript, and cloud technologies.

Tech Stack & Skills:
- Frontend Development: HTML5, CSS3, JavaScript, TypeScript, React.js, Next.js, Vue.js, Tailwind CSS.
- Development & Tools: Git, GitHub, REST API, Vercel, Vite.
- Quality & Supporting Skills: Software Testing, Manual Testing, Bug Reporting, UI/UX Design, Responsive Design, Problem Solving.
- Backend & Cloud: Firebase (Firestore, Authentication, Storage), RESTful APIs.

Instructions:
- Keep your answers concise, engaging, and professional.
- Tone: Professional, enthusiastic, and helpful.
- Language: Use Indonesian (Bahasa Indonesia) as the primary language. Respond in English only if the user specifically asks in English or language is set to English.
- Personalization: Use emojis occasionally (e.g., 🚀, ✨, 👨‍💻) to feel more personal.
- Off-topic redirection: Jika pengguna bertanya di luar topik portofolio, pekerjaan, atau keahlian Bilal, arahkan kembali dengan sopan ke informasi yang relevan tentang portofolio Bilal.
`;

// In-memory cache for dynamic GitHub context (10 minutes TTL)
let cachedGithubContext = null;
let lastGithubFetchTime = 0;
const GITHUB_CACHE_TTL_MS = 10 * 60 * 1000;

// Simple in-memory rate limiting (max 20 requests per minute per IP)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;

const checkRateLimit = (ip) => {
  const now = Date.now();
  const userRate = rateLimitMap.get(ip) || { count: 0, firstRequest: now };

  if (now - userRate.firstRequest > RATE_LIMIT_WINDOW_MS) {
    userRate.count = 1;
    userRate.firstRequest = now;
  } else {
    userRate.count += 1;
  }

  rateLimitMap.set(ip, userRate);
  return userRate.count <= MAX_REQUESTS_PER_WINDOW;
};

// Periodically clean up rate limit map
// Clean up expired rate limits lazily

const getDynamicSystemPrompt = async (language = 'id') => {
  const langInstruction =
    language === 'en'
      ? '\n\nIMPORTANT: The user is browsing in English. Respond in English unless asked otherwise.'
      : '\n\nIMPORTANT: Respond in Indonesian (Bahasa Indonesia).';

  let prompt = BASE_BOT_CONTEXT + langInstruction;
  return prompt;
};

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Basic rate limiting
  const clientIp =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    '127.0.0.1';

  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a moment before trying again.' });
  }

  // Parse Body
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: 'Invalid JSON payload' });
    }
  }

  const { message, history = [], language = 'id' } = body || {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'Message is required' });
  }

  if (message.length > 1000) {
    return res.status(400).json({ error: 'Message is too long (maximum 1000 characters)' });
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[ChatBot Server] GEMINI_API_KEY is not configured on server.');
    return res.status(500).json({ error: 'AI service configuration error. Please contact administrator.' });
  }

  try {
    const systemPrompt = await getDynamicSystemPrompt(language);

    // Format history for Gemini API: [{ role: 'user'|'model', parts: [{ text: '...' }] }]
    const formattedContents = [];

    if (Array.isArray(history)) {
      const sanitizedHistory = history.slice(-15); // Limit history to last 15 messages
      for (const item of sanitizedHistory) {
        if (!item || !item.content || typeof item.content !== 'string') continue;
        const role = item.role === 'assistant' || item.role === 'model' ? 'model' : 'user';
        formattedContents.push({
          role,
          parts: [{ text: item.content.slice(0, 1500) }],
        });
      }
    }

    // Append the latest user message
    formattedContents.push({
      role: 'user',
      parts: [{ text: message.trim() }],
    });

    // Make request to Gemini API securely
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const geminiPayload = {
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: formattedContents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1000,
      },
    };

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(geminiPayload),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`[ChatBot Server] Gemini API error HTTP ${response.status}:`, errText);
      return res.status(response.status).json({
        error: 'Failed to generate response from AI model',
        details: response.status === 429 ? 'Rate limit reached from AI provider' : undefined,
      });
    }

    const data = await response.json();
    const replyText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      '';

    if (!replyText) {
      return res.status(500).json({ error: 'No content received from AI model' });
    }

    return res.status(200).json({ reply: replyText });
  } catch (error) {
    console.error('[ChatBot Server] Unexpected error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
