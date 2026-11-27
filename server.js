/**
 * SERVER BACKEND MONICA VENOM TECH HUB
 * Menyediakan API Chatbot cerdas dengan Gemini API, Google Search Grounding,
 * dan melayani static files website portofolio.
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateChatResponse } from './src/services/geminiService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Endpoint Pengecekan Status Server & Grounding
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Asisten Venom Backend',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    searchGrounding: 'active',
    googleTools: ['Google Maps', 'YouTube', 'Google Calendar', 'Gmail', 'Google Drive']
  });
});

// Endpoint Utama AI Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, apiKey } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Parameter "messages" wajib berupa array pesan.'
      });
    }

    const result = await generateChatResponse(messages, apiKey);
    return res.json(result);
  } catch (err) {
    console.error('Server error pada /api/chat:', err);
    return res.status(500).json({
      status: 'error',
      message: err.message || 'Terjadi kesalahan internal pada server.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`⚡ VENOM X MONICA AI ASSISTANT SERVER RUNNING!`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🔑 Gemini API Key Status: ${process.env.GEMINI_API_KEY ? 'TERKONFIGURASI' : 'BELUM DIISI'}`);
  console.log(`🔍 Google Search Grounding: SIAP DIGUNAKAN`);
  console.log(`====================================================`);
});
