const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// ======================
// ROUTE TEST RENDER
// ======================
app.get("/", (req, res) => {
  res.send("🍽️ Bot restaurant actif sur Render 🚀");
});

// ======================
// WEBHOOK (test curl / WhatsApp)
// ======================
app.post("/webhook", async (req, res) => {
  try {
    const message = req.body.message;

    let reply = "❓ Je n'ai pas compris. Tape MENU";

    if (!message) {
      return res.json({ reply: "❌ Aucun message reçu" });
    }

    const msg = message.toLowerCase();

    if (msg === "bonjour") {
      reply = "🍽️ Bienvenue au Restaurant ! Tape MENU";
    }

    if (msg === "menu") {
      reply =
        "📋 MENU:\n1. Pizza\n2. Burger\n3. Frites\n\nRéponds avec le numéro 😋";
    }

    if (msg === "1") {
      reply = "🍕 Pizza commandée !";
    }

    if (msg === "2") {
      reply = "🍔 Burger commandé !";
    }

    if (msg === "3") {
      reply = "🍟 Frites commandées !";
    }

    return res.json({ reply });
  } catch (error) {
    console.log(error);
    return res.json({ reply: "❌ Erreur serveur" });
  }
});

// ======================
// START SERVER (RENDER)
// ======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Bot restaurant actif 🚀");
});
