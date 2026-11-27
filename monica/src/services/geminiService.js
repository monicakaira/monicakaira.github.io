/**
 * GEMINI API SERVICE DENGAN GOOGLE SEARCH GROUNDING & FUNCTION CALLING
 * Menggunakan SDK resmi @google/genai dengan konfigurasi:
 * - Model: gemini-2.5-flash
 * - System Instruction: ASSISTANT_SYSTEM_PROMPT
 * - Tools: googleSearch (Search Grounding Real-Time) + Function Declarations Layanan Google
 */

import { ASSISTANT_SYSTEM_PROMPT } from '../prompts/assistantSystemPrompt.js';
import { googleFunctionDeclarations, googleToolHandlers } from './googleToolsRegistry.js';

let googleGenAIClass = null;

// Dinamis impor SDK @google/genai jika terpasang
try {
  const mod = await import('@google/genai');
  googleGenAIClass = mod.GoogleGenAI || mod.default?.GoogleGenAI;
} catch (e) {
  // SDK belum di-install via npm, service akan menggunakan REST endpoint fallback
}

/**
 * Memproses permintaan chat dengan Gemini API & Google Search Grounding
 * @param {Array<{role: string, content: string}>} messages
 * @param {string} customApiKey
 */
export async function generateChatResponse(messages, customApiKey = '') {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      status: 'unconfigured',
      reply: 'Kunci API Gemini (`GEMINI_API_KEY`) belum dikonfigurasi di file `.env`. Silakan tambahkan API key Anda untuk mengaktifkan penalaran penuh dan Google Search Grounding.',
      groundingMetadata: null
    };
  }

  // Format pesan ke struktur konten Gemini
  const contents = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }]
  }));

  // Jika SDK @google/genai tersedia, gunakan SDK resmi
  if (googleGenAIClass) {
    try {
      const ai = new googleGenAIClass({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction: ASSISTANT_SYSTEM_PROMPT,
          tools: [
            { googleSearch: {} },
            { functionDeclarations: googleFunctionDeclarations }
          ]
        }
      });

      // Periksa pemanggilan tool (Function Calling)
      const functionCalls = response.functionCalls || [];
      if (functionCalls.length > 0) {
        const call = functionCalls[0];
        const handler = googleToolHandlers[call.name];
        let toolResult = null;
        if (handler) {
          toolResult = await handler(call.args || {});
        } else {
          toolResult = { error: `Handler untuk ${call.name} tidak ditemukan.` };
        }

        // Generate respon lanjutan dengan hasil tool
        return {
          status: 'success',
          reply: response.text || (toolResult.message || JSON.stringify(toolResult)),
          functionCalled: call.name,
          toolResult,
          groundingMetadata: response.candidates?.[0]?.groundingMetadata || null
        };
      }

      return {
        status: 'success',
        reply: response.text || 'Tidak ada respon teks.',
        groundingMetadata: response.candidates?.[0]?.groundingMetadata || null
      };
    } catch (err) {
      console.error('Error dengan @google/genai SDK:', err);
      // Fallback ke REST API jika SDK mengalami kendala
    }
  }

  // Fallback REST API resmi v1beta Google Gen AI
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const payload = {
      systemInstruction: {
        parts: [{ text: ASSISTANT_SYSTEM_PROMPT }]
      },
      contents,
      tools: [
        { google_search: {} }
      ]
    };

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const errText = await resp.text();
      throw new Error(`Google Gen AI API Error (${resp.status}): ${errText}`);
    }

    const data = await resp.json();
    const candidate = data.candidates?.[0];
    const replyText = candidate?.content?.parts?.map(p => p.text).join('\n') || 'Tidak ada teks jawaban.';
    const groundingMetadata = candidate?.groundingMetadata || null;

    return {
      status: 'success',
      reply: replyText,
      groundingMetadata
    };
  } catch (err) {
    return {
      status: 'error',
      reply: `Terjadi kendala saat menghubungi Gemini API: ${err.message}`,
      groundingMetadata: null
    };
  }
}
