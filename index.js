import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ===== CONFIG =====
const PORT = process.env.PORT || 3000;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// ===== HEALTH CHECK =====
app.get("/", (req, res) => {
  res.send("Agent4Football Translate API attiva");
});

// ===== TRANSLATE (GET) =====
app.get("/translate", async (req, res) => {
  try {
    const { text, target, source } = req.query;

    if (!text || !target) {
      return res.status(400).json({ error: "Parametri mancanti" });
    }

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          target: target,
          source: source || "en",
          format: "text"
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error(data.error);
      return res.status(500).json({ error: "Errore Google Translate" });
    }

    res.json({
      translatedText: data.data.translations[0].translatedText
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore interno server" });
  }
});

// ===== START SERVER =====
app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
