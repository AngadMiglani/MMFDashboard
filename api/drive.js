// server.js (CommonJS)
const express = require("express");
const app = express();
const PORT = 5000;

const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

app.get("/drive", async (req, res) => {
  const id = req.query.id;
  if (!id) return res.status(400).send("Missing id");
  const driveUrl = `https://drive.google.com/uc?export=view&id=${id}`;

  const upstream = await fetch(driveUrl, { redirect: "follow" });
  if (!upstream.ok) return res.status(upstream.status).send("Upstream error");

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  res.setHeader("Content-Type", upstream.headers.get("content-type") || "image/jpeg");

  upstream.body.pipe(res);
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
