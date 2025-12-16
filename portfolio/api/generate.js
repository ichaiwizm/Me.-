/**
 * API endpoint for AI-powered generation (prompts, suggestions, visual modes)
 * Uses Haiku model for fast, creative responses
 */

const PORTFOLIO_CONTEXT = `Tu es l'assistant IA du portfolio d'Ichai Wizman, un ingénieur full-stack passionné.

CAPACITÉS DU SITE:
- Navigation: accueil, projets, compétences, à-propos, contact
- Thèmes: lavande-zen, lumière, nuit, forêt-émeraude, océan-profond, crépuscule-doré, feu-dragon
- Modes visuels créatifs: neo-brutalism, retro-pixel, journal, matrix, glitch... et modes personnalisés générés par IA!
- Galerie photos: photos de famille, Paris, aquarium, toit de Jérusalem
- Fenêtres interactives: mini-apps HTML/CSS/JS
- Fonds personnalisés: couleurs solides, dégradés, images

PROFIL D'ICHAI:
- Ingénieur logiciel full-stack chez PhoneGS (Jérusalem)
- Passionné par l'IA et l'automatisation
- Stack: React, Node.js, PHP/Laravel, Electron, Playwright
- Projets: Mutuelles_v4, Shoot (photographes), AI Blog
- Personnalité: Builder, famille first, bon vivant, voyageur Paris-Jérusalem`;

const GENERATION_PROMPTS = {
  prompt: `${PORTFOLIO_CONTEXT}

TÂCHE: Génère UN prompt créatif et engageant pour explorer le portfolio.
Le prompt doit être:
- Court (10-20 mots max)
- Intrigant ou amusant
- Lié aux capacités du site (navigation, thèmes, modes visuels, photos, projets...)

RÉPONDS UNIQUEMENT AVEC LE PROMPT, sans guillemets ni explication.`,

  suggestions: `${PORTFOLIO_CONTEXT}

TÂCHE: Génère 6 suggestions de prompts variées pour explorer le portfolio.
Les suggestions doivent:
- Être courtes (5-15 mots)
- Couvrir différentes catégories (projets, photos, thèmes, modes visuels, compétences, personnel)
- Être engageantes et variées
- IMPORTANT: Chaque suggestion doit demander UNE SEULE action (pas de "et", "puis", "ensuite")

RÉPONDS EN JSON UNIQUEMENT, format:
["suggestion1", "suggestion2", "suggestion3", "suggestion4", "suggestion5", "suggestion6"]`,

  visualMode: `${PORTFOLIO_CONTEXT}

TÂCHE: Génère une demande ULTRA-CRÉATIVE et INATTENDUE pour un mode visuel.

RÈGLES:
- Sois BIZARRE, AUDACIEUX, SURPRENANT
- Mélange des concepts improbables
- 5-10 mots MAX
- PAS de trucs classiques (cyberpunk, synthwave, rétro, néon, space, nature, vintage)

EXEMPLES DU NIVEAU DE CRÉATIVITÉ ATTENDU:
- "Mode fever dream après minuit"
- "Esthétique frigo des années 70"
- "Style procès-verbal de police"
- "Ambiance karaoké coréen 3h du mat"
- "Mode écran cassé de téléphone"
- "Esthétique PowerPoint corporate 2003"
- "Style ticket de caisse froissé"
- "Mode aquarium abandonné"
- "Ambiance salle d'attente de dentiste"
- "Style manuel d'instructions IKEA"

Sois VRAIMENT original. Surprends-moi.

RÉPONDS UNIQUEMENT AVEC LA DEMANDE, en français, sans guillemets.`
};

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { type, language = "fr" } = req.body || {};

    if (!type || !GENERATION_PROMPTS[type]) {
      return res.status(400).json({
        error: "Invalid type",
        validTypes: Object.keys(GENERATION_PROMPTS)
      });
    }

    let systemPrompt = GENERATION_PROMPTS[type];

    // Adjust language if needed
    if (language === "en") {
      systemPrompt = systemPrompt.replace(
        "RÉPONDS UNIQUEMENT AVEC LE PROMPT",
        "RESPOND ONLY WITH THE PROMPT"
      ).replace(
        "RÉPONDS EN JSON UNIQUEMENT",
        "RESPOND IN JSON ONLY"
      ).replace(
        "RÉPONDS UNIQUEMENT AVEC LA DEMANDE",
        "RESPOND ONLY WITH THE REQUEST"
      ).replace(
        "en français",
        "in English"
      );
    } else if (language === "he") {
      systemPrompt = systemPrompt.replace(
        "RÉPONDS UNIQUEMENT AVEC LE PROMPT",
        "RESPOND ONLY WITH THE PROMPT IN HEBREW"
      ).replace(
        "RÉPONDS EN JSON UNIQUEMENT",
        "RESPOND IN JSON ONLY"
      ).replace(
        "RÉPONDS UNIQUEMENT AVEC LA DEMANDE",
        "RESPOND ONLY WITH THE REQUEST IN HEBREW"
      ).replace(
        "en français",
        "in Hebrew"
      );
    }

    const model = "anthropic/claude-haiku-4.5";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY || ""}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.APP_URL || "",
        "X-Title": process.env.APP_NAME || "Portfolio Generate",
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Génère maintenant (langue: ${language})` }
        ],
        max_tokens: 500,
        temperature: 0.9, // High creativity
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: "OpenRouter error", detail: err });
    }

    const data = await response.json();
    let content = data?.choices?.[0]?.message?.content || "";

    // Clean up the response
    content = content.trim();

    // For suggestions, try to parse as JSON
    if (type === "suggestions") {
      try {
        const suggestions = JSON.parse(content);
        return res.status(200).json({ suggestions });
      } catch {
        // If not valid JSON, try to extract array-like content
        const match = content.match(/\[[\s\S]*\]/);
        if (match) {
          try {
            const suggestions = JSON.parse(match[0]);
            return res.status(200).json({ suggestions });
          } catch {
            // Fallback: split by newlines or commas
            const fallback = content.split(/[\n,]/).map(s => s.trim().replace(/^["']|["']$/g, '')).filter(Boolean).slice(0, 6);
            return res.status(200).json({ suggestions: fallback });
          }
        }
      }
    }

    return res.status(200).json({ content });
  } catch (e) {
    const msg = (e && (e.stack || e.message)) || "Server error";
    return res.status(500).json({ error: "Server error", detail: msg });
  }
}
