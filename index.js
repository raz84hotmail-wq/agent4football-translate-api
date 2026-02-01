import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

/** ✅ CORS OPEN (funziona anche con Origin: null e GoodBarber) */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

/** ✅ Preflight */
app.options("*", cors());

app.get("/", (req, res) => {
  res.send("Agent4Football Translate API attiva");
});

app.get("/translate", async (req, res) => {
  const { text, target } = req.query;

  if (!text || !target) {
    return res.status(400).json({ error: "Parametri mancanti" });
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key mancante" });
  }

  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ q: text, target, format: "text" })
      }
    );

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message || "Errore Google Translate" });
    }

    res.json({
      translatedText: data.data.translations[0].translatedText
    });

  } catch (err) {
    res.status(500).json({ error: "Errore server" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log("Server avviato su porta", PORT));
