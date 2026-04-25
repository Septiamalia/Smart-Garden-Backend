const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(cors());

let kondisi = "Basah";
let pump = "OFF";
let lastKondisi = "";

let suhu = 0;
let humidity = 0;
let light = 0;

const TOKEN = "8771973466:AAFhS4_Lh3BQI_bfyk2-yivd0BMP818dr_8";
const CHAT_ID = "1868833642";

// 📩 FUNCTION TELEGRAM (AMAN)
function kirimTelegram(msg) {
  console.log("Kirim ke Telegram:", msg);

  axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    chat_id: CHAT_ID,
    text: msg
  })
  .then(() => console.log("✅ Terkirim"))
  .catch(err => console.log("❌ Error:", err.message));
}

// 🏠 ROOT
app.get("/", (req, res) => {
  res.send("Backend jalan");
});

// 📊 STATUS (buat web)
app.get("/status", (req, res) => {
  res.json({ kondisi, pump });
});

// 📊 DATA SENSOR (buat dashboard web)
app.get("/sensor-data", (req, res) => {
  res.json({
    suhu,
    humidity,
    light
  });
});

// 🌱 DATA DARI ESP32
app.post("/sensor", (req, res) => {
  kondisi = req.body.kondisi;
  suhu = req.body.suhu;
  humidity = req.body.humidity;
  light = req.body.light;

  console.log("📥 Sensor:", kondisi, suhu, humidity, light);

  // 🔥 Anti spam Telegram
  if (kondisi === "Kering" && lastKondisi !== "Kering") {
    kirimTelegram(
      "⚠️ TANAH KERING!\n\n" +
      "🌡️ Suhu: " + suhu + "°C\n" +
      "💧 Humidity: " + humidity + "%\n" +
      "☀️ Cahaya: " + light
    );
  }

  lastKondisi = kondisi;

  res.send("OK");
});

// 💧 SIRAM DARI WEB
app.post("/siram", (req, res) => {
  console.log("🔥 /siram dipanggil");

  pump = "ON";

  kirimTelegram(
    "💧 TANAMAN DISIRAM\n\n" +
    "🌡️ Suhu: " + suhu + "°C\n" +
    "💧 Humidity: " + humidity + "%\n" +
    "☀️ Cahaya: " + light + "\n" +
    "🌱 Kondisi: " + kondisi
  );

  res.send("ON");
});

// ❗ biar ga error kalau dibuka di browser
app.get("/siram", (req, res) => {
  res.send("Gunakan POST untuk siram");
});

// 🤖 ESP32 CEK POMPA
app.get("/pump", (req, res) => {
  res.json({ pump });

  // reset setelah dibaca
  pump = "OFF";
});

// 🧪 TEST TELEGRAM
app.get("/test", (req, res) => {
  kirimTelegram("🔥 Test dari backend");
  res.send("Test dikirim");
});

// 🛑 ANTI CRASH
process.on("uncaughtException", (err) => {
  console.log("❌ ERROR:", err);
});

// 🚀 RUN SERVER (WAJIB UNTUK RAILWAY)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server jalan di " + PORT);
});