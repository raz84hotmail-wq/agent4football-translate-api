app.get('/translate', async (req, res) => {
  try {
    const { text, target } = req.query;

    if (!text || !target) {
      return res.status(400).json({ error: "Parametri mancanti" });
    }

    const url = `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_API_KEY}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        target: target,
        format: "text"
      })
    });

    const data = await response.json();
    res.json({ translatedText: data.data.translations[0].translatedText });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Errore traduzione" });
  }
});
