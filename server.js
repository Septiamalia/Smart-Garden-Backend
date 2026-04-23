const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

let kondisi = "Basah";
let pump = "OFF";

app.get("/", (req, res) => {
  res.send("Backend jalan!");
});

app.get("/status", (req, res) => {
  res.json({ kondisi, pump });
});

app.post("/siram", (req, res) => {
  pump = "ON";
  res.send("Pompa nyala");
});

app.get("/pump", (req, res) => {
  res.json({ pump });
  pump = "OFF";
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server jalan di port " + PORT));