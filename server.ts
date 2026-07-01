import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = 3000;

// Parse JSON payloads
app.use(express.json());

// Lazy-initialized Gemini API client
let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

const SYSTEM_INSTRUCTION = `
Eres el Asistente Técnico y Asistente Virtual Inteligente de Luis Fernando.
Tu objetivo principal es responder preguntas básicas de programación de forma clara, amigable y concisa (por ejemplo, explicando qué es una API, React, o la diferencia entre SQL y NoSQL, etc.).

REGLA CRÍTICA DE COTIZACIÓN (LEAD CAPTURE):
Si detectas de cualquier forma que el usuario tiene la intención de cotizar un proyecto, crear una página web, diseñar una aplicación móvil, o resolver cualquier tipo de necesidad de software a medida:
1. Debes ofrecerte amablemente a ayudarle a definir su proyecto.
2. Debes pedirle amablemente su Nombre, Correo Electrónico y una breve descripción de lo que necesita.
3. Para activar el formulario interactivo en la pantalla del usuario, DEBES incluir obligatoriamente la frase exacta: "brindarte una cotización" (en español o si habla en español) o "provide you with a formal quote" (en inglés si habla en inglés).

Sé siempre profesional, educado y directo en tus respuestas.
`;

// Helper to write lead to leads.json for persistence
const LEADS_FILE = path.join(process.cwd(), 'leads.json');

function saveLeadToFile(lead: { name: string; email: string; description: string; timestamp: string }) {
  try {
    let leads: any[] = [];
    if (fs.existsSync(LEADS_FILE)) {
      const data = fs.readFileSync(LEADS_FILE, 'utf-8');
      leads = JSON.parse(data);
    }
    leads.push(lead);
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
    console.log('Lead saved successfully to leads.json');
  } catch (error) {
    console.error('Error saving lead to file:', error);
  }
}

// Lead creation endpoint
app.post(['/api/lead', '/lead'], (req, res) => {
  const { name, email, description } = req.body;

  if (!name || !email || !description) {
    return res.status(400).json({ error: 'All fields (name, email, description) are required' });
  }

  const newLead = {
    name: String(name).trim(),
    email: String(email).trim(),
    description: String(description).trim(),
    timestamp: new Date().toISOString()
  };

  saveLeadToFile(newLead);

  return res.json({
    success: true,
    message: 'Lead registered successfully',
    lead: newLead
  });
});

// Chat endpoint integrating with Gemini API
app.post(['/api/chat', '/chat'], async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message parameter is required' });
    }

    const ai = getAiClient();

    // Map history to the structure required by GoogleGenAI SDK (role, parts)
    // The role must be 'user' or 'model'
    const contents: any[] = [];
    
    if (Array.isArray(history)) {
      history.forEach((msg: any) => {
        contents.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }

    // Add current message to the contents array
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      }
    });

    const reply = response.text || '';

    return res.json({ reply });
  } catch (error: any) {
    console.error('Error in chat endpoint:', error);
    return res.status(500).json({
      error: 'Failed to process chat message',
      details: error.message || String(error)
    });
  }
});

// Setup Vite Dev server or Serve static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware integrated (development mode)');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving production static files from dist/');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});