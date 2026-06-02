const express = require("express")
const app = express()

app.use(express.json())

app.post("/webhook", (req, res) => {

  const message = req.body.message

  let reply = ""

  if (!message) {
    return res.sendStatus(200)
  }

  const text = message.toLowerCase()

  if (text === "bonjour") {
    reply = "🍽️ Bienvenue au Restaurant ! Tape MENU"
  }

  else if (text === "menu") {
    reply = "🍔 Burger 5€\n🍕 Pizza 8€\n🥤 Boisson 2€"
  }

  else {
    reply = "Écris BONJOUR ou MENU"
  }

  console.log("Client:", text)
  console.log("Bot:", reply)

  res.json({ reply })

})

app.listen(3000, () => {
  console.log("Bot restaurant actif 🚀")
})
