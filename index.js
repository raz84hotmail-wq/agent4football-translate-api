import express from "express";
import fetch from "node-fetch";

const app = express();

// route di test
app.get("/", (req, res) => {
  res.send("Agent4Football Translate API attiva");
});

// route di traduzione
app.get("/translate", async (req, res) => {
  const { text, target } = req.query;

  if (!text || !target) {
    return res.status(400).json({
      error: "Parametri mancanti: text e target"
    });
  }

  try {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "API key mancante"
      });
    }

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          q: text,
          target: target,
          format: "text"
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("Errore Google API:", data.error);
      return res.status(500).json({ error: "Errore Google Translate" });
    }

    res.json({
      translatedText: data.data.translations[0].translatedText
    });

  } catch (err) {
    console.error("Errore server:", err);
    res.status(500).json({ error: "Errore traduzione" });
  }
});

// PORTA (OBBLIGATORIO PER RENDER)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server avviato su porta", PORT);
});
