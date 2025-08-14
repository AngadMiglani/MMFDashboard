
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) {
    res.status(400).send("Missing id");
    return;
  }
  const driveUrl = `https://drive.google.com/uc?export=view&id=${id}`;

  const upstream = await fetch(driveUrl, { redirect: "follow" });
  if (!upstream.ok) {
    res.status(upstream.status).send("Upstream error");
    return;
  }

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
  res.setHeader("Content-Type", upstream.headers.get("content-type") || "image/jpeg");

  upstream.body.pipe(res);
}