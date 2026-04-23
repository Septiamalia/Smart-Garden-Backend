const API = "http://localhost:3000";

async function getStatus() {
  const res = await fetch(API + "/status");
  const data = await res.json();

  document.getElementById("status").innerText =
    "Status: " + data.kondisi;
}

async function siram() {
  await fetch(API + "/siram", {
    method: "POST"
  });

  alert("Tanaman disiram!");
}

setInterval(getStatus, 3000);
getStatus();