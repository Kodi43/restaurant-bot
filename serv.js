const express = require("express")
const axios = require("axios")
const app = express()

app.use(express.json())

// 🔑 METS TES INFOS ICI (IMPORTANT)
const TOKEN = "EAAX8ZAcJWcCwBRtZCRduOOjotHfqy6CJ480lZCI4BAW3QY08MJ9hZB55kGMOzUZCCZBbLD0zjFAmkGEnZBr6I6SRqj04t7xDKnaR7QEp3easBi8Y3BFDMU5aTR9pCDfGguZCjE4ZCiteAGYU8ieeyZCZAjxMj8VTqnPZC5qX8WImep0wUH529Jvx0wzlluaxMEZCSfyyyOASfsR5AzBIioBYxLGrfQh103wTmAGN5HkpKHzqde1KyPFlhcgZDZD"
const PHONE_ID = "1189715550889787"

// 📩 envoyer message WhatsApp
async function sendMessage(to, text) {
  try {
    await axios.post(
      `https://graph.facebook.com/v19.0/${PHONE_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: { body: text }
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    )
  } catch (err) {
    console.log("Erreur envoi message", err.response?.data || err.message)
  }
}

// 🔥 webhook WhatsApp
app.post("/webhook", async (req, res) => {

  const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]

  if (!msg) return res.sendStatus(200)

  const from = msg.from
  const text = msg.text?.body?.toLowerCase()

  let reply = ""

  if (text === "bonjour") {
    reply = `🍽️ Bienvenue au Restaurant !

1️⃣ Menu
2️⃣ Commander
3️⃣ Horaires`
  }

  else if (text === "1") {
    reply = `🍔 MENU :
Burger - 5€
Pizza - 8€
Boisson - 2€`
  }

  else if (text === "2") {
    reply = "📦 Écris ta commande"
  }

  else if (text === "3") {
    reply = "⏰ Ouvert 11h - 23h"
  }

  else {
    reply = "Écris BONJOUR pour commencer"
  }

  await sendMessage(from, reply)

  res.sendStatus(200)
})

app.listen(3000, () => {
  console.log("Bot restaurant actif 🚀")
})
