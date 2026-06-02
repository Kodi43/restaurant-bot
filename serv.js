const express = require("express");

const app = express();
app.use(express.json());

// ======================
// ROUTE ACCUEIL (corrige "Cannot GET /")
// ======================
app.get("/", (req, res) => {
  res.send("🍽️ Bot restaurant actif sur Render 🚀");
});

// ======================
// WEBHOOK TEST (WhatsApp / curl)
// ======================
app.post("/webhook", (req, res) => {
  try {
    const message = req.body.message;

    if (!message) {
      return res.json({ reply: "❌ Aucun message reçu" });
    }

    const msg = message.toLowerCase();

    let reply = "❓ Tape MENU pour commencer";

    if (msg === "bonjour") {
      reply = "🍽️ Bienvenue au Restaurant ! Tape MENU";
    }

    if (msg === "menu") {
      reply =
        "📋 MENU:\n1. Pizza 🍕\n2. Burger 🍔\n3. Frites 🍟\n\nRéponds 1, 2 ou 3";
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
// LANCEMENT SERVEUR (RENDER)
// ======================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Bot restaurant actif 🚀");
});
