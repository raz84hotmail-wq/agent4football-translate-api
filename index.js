import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/translate", async (req, res) => {
  try {
    const text = req.query.text;
    const target = req.query.target || "it";

    if (!text) {
      return res.status(400).json({ error: "Parametro 'text' mancante" });
    }

    const apiKey = process.env.GOOGLE_API_KEY;

    const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        target: target
      })
    });

    const data = await response.json();

    res.json({
      translatedText: data.data.translations[0].translatedText
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore traduzione" });
  }
});

app.get("/", (req, res) => {
  res.send("Agent4Football Translate API attiva");
});

app.listen(PORT, () => {
  console.log("Server avviato sulla porta", PORT);
});
