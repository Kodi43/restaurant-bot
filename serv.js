const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

// =========================
// CONFIG
// =========================
const VERIFY_TOKEN = "restaurant123";
const ACCESS_TOKEN = "EAAX8ZAcJWcCwBRteOCwxLpDEvLq1uUC79BSKu2ZBoEDVIhAygZCCto9KrHEZB9IzTAQN6War0mcgIxob7tnuzowdKJO6ZBU1uKhuuI0qW3KQLJw8JuOvpsIggATZC56VBoHlp9YZBDlM0oeFjZCDXUCymPmysix6MNWaXLT1WASiVrPJ3dwP2ZCYlNehTY82PFZBd54ZADfoOXJ2UZCwUbethY8oeLxnaW0D3ijlJTsZAV7YQdwZBBSYJ5CQZ";
const PHONE_NUMBER_ID = "11897155508897870";

const PORT = process.env.PORT || 10000;

// =========================
// PAGE HOME
// =========================
app.get("/", (req, res) => {
  res.send("🍔 Bot Restaurant actif 🚀");
});

// =========================
// WEBHOOK VERIFY (Meta)
// =========================
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// =========================
// SEND MESSAGE FUNCTION
// =========================
async function sendMessage(to, text) {
  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: { body: text },
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.log("❌ erreur sendMessage:", err.response?.data || err.message);
  }
}

// =========================
// BOT LOGIC
// =========================
app.post("/webhook", async (req, res) => {
  console.log("🔥 MESSAGE REÇU");

  const message =
    req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body;

  const from =
    req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;

  if (!message) return res.sendStatus(200);

  console.log("📩 From:", from);
  console.log("💬 Message:", message);

  let reply = "";

  const msg = message.toLowerCase();

  // =========================
  // MENU RESTAURANT
  // =========================
  if (msg.includes("menu") || msg.includes("bonjour")) {
    reply =
      "🍔 MENU RESTAURANT\n\n" +
      "1️⃣ Pizza - 8€\n" +
      "2️⃣ Burger - 6€\n" +
      "3️⃣ Tacos - 7€\n" +
      "4️⃣ Boisson - 2€\n\n" +
      "👉 Réponds avec le numéro pour commander";
  }

  // =========================
  // COMMANDES
  // =========================
  else if (msg === "1") {
    reply = "🍕 Tu as choisi Pizza. Donne ton adresse pour livraison.";
  } else if (msg === "2") {
    reply = "🍔 Tu as choisi Burger. Donne ton adresse pour livraison.";
  } else if (msg === "3") {
    reply = "🌮 Tu as choisi Tacos. Donne ton adresse pour livraison.";
  } else if (msg === "4") {
    reply = "🥤 Tu as choisi Boisson. Donne ton adresse pour livraison.";
  }

  // =========================
  // DEFAULT
  // =========================
  else {
    reply =
      "🤖 Je n’ai pas compris.\n\nTape *menu* pour voir les plats 🍔";
  }

  await sendMessage(from, reply);

  res.sendStatus(200);
});

// =========================
// START SERVER
// =========================
app.listen(PORT, () => {
  console.log("🍔 Bot Restaurant actif 🚀 sur port", PORT);
});
