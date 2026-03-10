import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    cors: { origin: "*" },
  });

  app.use(express.json({ limit: "50mb" }));

  // AI Lyrics & Theme Generation Endpoint
  app.post("/api/generate", async (req, res) => {
    const { text, image, genre, duration, language, lyricLanguage, vocalGender } = req.body;

    try {
      const model = ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: [
          {
            text: `Generate a detailed song theme and lyrics based on the following:
            - Input Text: ${text || "None"}
            - Genre: ${genre}
            - Duration: ${duration} minutes
            - UI Language: ${language}
            - Lyrics Language: ${lyricLanguage || language}
            - Vocal Style: ${vocalGender || 'any'}
            
            Return a JSON object with:
            - theme: A short description of the song's mood and story.
            - lyrics: Structured lyrics (Verse, Chorus, Bridge, etc.) in ${lyricLanguage || language}.
            - bpm: Recommended BPM for this genre.
            - key: Recommended musical key.`,
          },
          ...(image ? [{ inlineData: { data: image.split(",")[1], mimeType: "image/png" } }] : []),
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              theme: { type: Type.STRING },
              lyrics: { type: Type.STRING },
              bpm: { type: Type.NUMBER },
              key: { type: Type.STRING },
            },
            required: ["theme", "lyrics", "bpm", "key"],
          },
        },
      });

      const response = await model;
      const result = JSON.parse(response.text || "{}");
      
      // Generate Copyright Hash
      const hash = crypto.createHash('sha256')
        .update(result.lyrics + genre + Date.now())
        .digest('hex');

      res.json({
        ...result,
        audio_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        cover_url: `https://picsum.photos/seed/${hash}/1024/1024`,
        midi_url: "#",
        copyrightHash: hash,
        issuedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("AI Generation Error:", error);
      res.status(500).json({ error: "Failed to generate AI content" });
    }
  });

  // Chat Socket Logic
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("send_message", async (data) => {
      // In a real app, we'd use Gemini to translate the message for all participants
      // For this demo, we'll broadcast the original and a "translated" placeholder
      io.emit("receive_message", {
        ...data,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  const PORT = 3000;
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
