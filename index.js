const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Agent4Football Translate API attiva");
});

app.get("/translate", async (req, res) => {
  const { text, target } = req.query;

  if (!text || !target) {
    return res.status(400).json({ error: "Parametri mancanti" });
  }

  try {
    const apiKey = process.env.GOOGLE_API_KEY;

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

    res.json({
      translatedText: data.data.translations[0].translatedText
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Errore traduzione");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server avviato su porta", PORT);
});
