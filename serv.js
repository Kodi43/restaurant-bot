const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// =====================
// CONFIG META
// =====================
const VERIFY_TOKEN = "restaurant123";

// ⚠️ METS TON TOKEN ICI (local, pas partagé)
const WHATSAPP_TOKEN = "EAAX8ZAcJWcCwBRmF16rzH2Il6KyilbPofFnZCOCM4i8IQ0FWTQxeHkBvR21hnAhTpQepRMDUOG4cSBSqnDxzwNPVVbSfyZBtDUU59oasqmuqlPQeIoZBGB6g2VXZAry2nz86cuhXDEkZA3oarSC211QAELB1SlRNQ2bLXejirBuWsT7j4RRDknGZBmnOfzfbqeOwM41ig1ZAlIrs91ZC5YEse1aXo290SsqPgrZAz9B4VH4ofvMI1XbgZDZD";

// Phone Number ID (tu l'as déjà)
const PHONE_NUMBER_ID = "1189715550889787";

// =====================
// HOME
// =====================
app.get("/", (req, res) => {
  res.send("🍽️ Bot WhatsApp actif 🚀");
});

// =====================
// VERIFY WEBHOOK
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
// SEND MESSAGE FUNCTION
// =====================
async function sendMessage(to, text) {
  await axios.post(
    `https://graph.facebook.com/v20.0/${PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: "whatsapp",
      to: to,
      type: "text",
      text: { body: text }
    },
    {
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json"
      }
    }
  );
}

// =====================
// WEBHOOK RECEIVE
// =====================
app.post("/webhook", async (req, res) => {
  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const value = changes?.value;

  const message = value?.messages?.[0];
  const from = message?.from;
  const text = message?.text?.body || "";

  console.log("Message reçu:", text);

  let reply = "Tape MENU";

  if (text.toLowerCase() === "bonjour") {
    reply = "🍽️ Bienvenue ! Tape MENU";
  }

  if (text.toLowerCase() === "menu") {
    reply = "1. Pizza 🍕\n2. Burger 🍔\n3. Frites 🍟";
  }

  if (from) {
    await sendMessage(from, reply);
  }

  res.sendStatus(200);
});

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Bot WhatsApp actif 🚀");
});
