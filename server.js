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
  axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    chat_id: CHAT_ID,
    text: msg
  });
}

app.get("/", (req, res) => res.send("Backend jalan"));

app.get("/status", (req, res) => {
  res.json({ kondisi, pump });
});

app.post("/sensor", (req, res) => {
  kondisi = req.body.kondisi;

  if (kondisi === "Kering") {
    kirimTelegram("⚠️ Tanah kering!");
  }

  res.send("OK");
});

app.post("/siram", (req, res) => {
  pump = "ON";
  kirimTelegram("💧 Disiram dari web");
  res.send("ON");
});

app.get("/pump", (req, res) => {
  res.json({ pump });
  pump = "OFF";
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server jalan di " + PORT));