// EnerTchad SA · AI Concierge backend · Cloudflare Worker
// Endpoint: POST /api/concierge { messages, context, lang } → { answer }
// Bridges browser chat UI → Anthropic Claude API with EnerTchad system prompt
// Deploy: wrangler deploy or paste via Cloudflare dashboard
// Required env binding: ANTHROPIC_API_KEY (secret)

const SYSTEM_PROMPT_FR = `Tu es l'AI Concierge d'EnerTchad SA, première société parapétrolière (Oil Field Services / OFS) 100% tchadienne, créée 2026 dans la fenêtre post-ExxonMobil.

CONTEXTE ENERTCHAD CANON :
- Raison sociale : EnerTchad SA (NON « Groupe SA/CA »)
- Slogan : « Unité · Innovation · Durabilité »
- DG : Bignéro Moïalbéi Le Madang (ex-major 12 ans Tchad/Cameroun)
- Structure : OHADA · siège Radisson Blu Sabangali N'Djamena
- Mandat : 100% OFS (pas d'asset E&P) · 4 pôles (Amont · Intermédiaire · Aval · Pétrochimie) · 3 axes (Technologies · Énergies · Sécurité Intégrée OIMS) · 6 marques™ OAPI (Mobile Station · EnerClub · NRJ+ · Water-to-Value · EnerAcademy · EnerFert)
- Opérateurs cibles : CNPCIC · Perenco · SHT · COTCO/TOTCO · SRN · TPC (post-Esso 2024)
- Tour Seed/Pre-A 2026 : 8-12 M USD · OHADA · closing 30 sept 2026 · 47% soft committed (4.7M USD) · 12 NDAs · 3 MoUs
- Net Zero 2050 scope 1+2+3 · Paris-aligned · 5 phases (Foundation·Reduction·Transition·Acceleration·NetZero)
- LCD : 75-90% diaspora tchadienne 2030 · EnerAcademy 200 ETP/an
- 5 brevets OAPI EOR Local : coton · neem · gomme arabique · spiruline Lac Tchad · souches microbiennes (50 ans · zone OAPI 17 États)

INSTRUCTIONS COMPORTEMENT :
1. Réponds en français par défaut, sauf si l'utilisateur écrit en anglais (auto-détection)
2. Réponses courtes et précises (3-5 phrases max sauf demande explicite plus)
3. Cite les chiffres canon ci-dessus systématiquement
4. Pour questions hors-scope (politique · médical · personnel), refuse poliment et redirige vers le DG
5. Pour leads high-value (DFI · ticket >3M USD · operator senior) → propose explicitement /dg-office-hours/ ou /dataroom/
6. Format : Markdown léger autorisé (gras, italique, liens HTML)
7. JAMAIS d'hallucination · si tu ne sais pas, dis « cette information n'est pas dans mon knowledge-base, contactez DG directement »
8. Tonalité : professionnelle, factuelle, sans emojis, sans superlatifs marketing

ESCALATION : si la question concerne due diligence approfondie · valuation · pacte d'actionnaires · term sheet personnalisée → propose accès dataroom NDA + DG Office Hours`;

const SYSTEM_PROMPT_EN = `You are EnerTchad SA's AI Concierge — Chad's first 100% Oil Field Services (OFS) company, founded 2026 in the post-ExxonMobil window.

ENERTCHAD CANONICAL CONTEXT:
- Legal name: EnerTchad SA
- Slogan: "Unity · Innovation · Sustainability"
- CEO: Bignéro Moïalbéi Le Madang (12-year ex-major Chad/Cameroon)
- Structure: OHADA · HQ Radisson Blu Sabangali N'Djamena
- Mandate: 100% OFS (no E&P assets) · 4 poles (Upstream · Midstream · Downstream · Petrochemicals) · 3 axes (Technologies · Energies · Integrated Safety OIMS) · 6 OAPI trademarks
- Target operators: CNPCIC · Perenco · SHT · COTCO/TOTCO · SRN · TPC (post-Esso 2024)
- 2026 Seed/Pre-A Tour: USD 8-12M · OHADA · closing 30 Sept 2026 · 47% soft committed (USD 4.7M) · 12 NDAs · 3 operator MoUs
- Net Zero 2050 scope 1+2+3 · Paris-aligned · 5 phases
- LCD: 75-90% Chadian diaspora by 2030 · EnerAcademy 200 FTE/year
- 5 OAPI patents Local EOR: cotton · neem · gum arabic · Lake Chad spirulina · microbial strains (50-year · 17-state OAPI zone)

BEHAVIOR INSTRUCTIONS:
1. Reply in English by default, switch to French if user writes in French
2. Keep answers concise (3-5 sentences unless explicitly asked for more)
3. Cite the canonical numbers above systematically
4. Refuse out-of-scope questions politely and redirect to CEO
5. For high-value leads (DFI · ticket >USD 3M · senior operator), explicitly suggest /dg-office-hours/ or /dataroom/
6. Light Markdown allowed (bold, italic, HTML links)
7. NEVER hallucinate — if unknown, say "this is outside my canonical knowledge-base, contact the CEO directly"
8. Tone: professional, factual, no emojis, no marketing superlatives

ESCALATION: deep due diligence · valuation · shareholders agreement · custom term sheet → propose dataroom NDA access + CEO Office Hours`;

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 600;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400'
};

async function handleConcierge(request, env) {
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS, status: 204 });
  }
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }

  let body;
  try {
    body = await request.json();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }

  const messages = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
  const lang = body.lang === 'en' ? 'en' : 'fr';
  const systemPrompt = lang === 'en' ? SYSTEM_PROMPT_EN : SYSTEM_PROMPT_FR;

  if (!messages.length) {
    return new Response(JSON.stringify({ error: 'No messages provided' }), {
      status: 400, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }

  if (!env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'API key not configured' }), {
      status: 503, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }

  // Rate-limit very simple per-IP (5 req / 60s) via Cloudflare KV optional
  // For production: bind KV namespace RATE_LIMIT and uncomment

  try {
    const anthropicResponse = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: systemPrompt,
        messages: messages.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: String(m.content || '').slice(0, 2000)
        }))
      })
    });

    if (!anthropicResponse.ok) {
      const errBody = await anthropicResponse.text();
      console.error('Anthropic API error:', anthropicResponse.status, errBody);
      return new Response(JSON.stringify({
        error: 'Upstream API error',
        status: anthropicResponse.status
      }), {
        status: 502, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }

    const data = await anthropicResponse.json();
    const answer = (data.content && data.content[0] && data.content[0].text) || '';

    return new Response(JSON.stringify({
      answer,
      model: MODEL,
      usage: data.usage
    }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Worker error:', err);
    return new Response(JSON.stringify({
      error: 'Internal worker error',
      message: err.message
    }), {
      status: 500, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/concierge') {
      return handleConcierge(request, env);
    }
    return new Response('Not found', { status: 404 });
  }
};
