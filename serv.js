const express = require("express");

const app = express();
app.use(express.json());

// =====================
// VERIFY TOKEN (IMPORTANT META)
// =====================
const VERIFY_TOKEN = "restaurant123";

// =====================
// HOME
// =====================
app.get("/", (req, res) => {
  res.send("🍽️ Bot WhatsApp actif sur Render 🚀");
});

// =====================
// VERIFY WEBHOOK (GET)
// =====================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  } else {
    return res.sendStatus(403);
  }
});

// =====================
// RECEIVE MESSAGES (POST)
// =====================
app.post("/webhook", (req, res) => {
  const message =
    req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body || "";

  let reply = "Tape MENU";

  if (message.toLowerCase() === "bonjour") {
    reply = "🍽️ Bienvenue ! Tape MENU";
  }

  if (message.toLowerCase() === "menu") {
    reply = "1. Pizza 🍕\n2. Burger 🍔\n3. Frites 🍟";
  }

  console.log("Message reçu:", message);

  res.json({ reply });
});

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Bot WhatsApp actif 🚀");
});
