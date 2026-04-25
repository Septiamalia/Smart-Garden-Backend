const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

let kondisi = "Basah";
let pump = "OFF";

const TOKEN = "8771973466:AAFhS4_Lh3BQI_bfyk2-yivd0BMP818dr_8";
const CHAT_ID = "1868833642";

function kirimTelegram(msg) {
  console.log("Kirim ke Telegram:", msg);

  axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    chat_id: CHAT_ID,
    text: msg
  })
  .then(() => console.log("✅ Terkirim"))
  .catch(err => console.log("❌ Error:", err.message));
}

app.get("/test", (req, res) => {
  kirimTelegram("🔥 Test dari backend");
  res.send("Test dikirim");
});