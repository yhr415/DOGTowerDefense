const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
app.use(cors());
app.use(morgan("dev"));

app.get("/proxy", async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) return res.status(400).send("Missing url");

    const response = await fetch(url);
    if (!response.ok) {
      return res.status(response.status).send("Failed to fetch resource");
    }

    res.set("Content-Type", response.headers.get("content-type"));
    response.body.pipe(res);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Internal error");
  }
});

app.listen(8080, () => {
  console.log("Proxy server running on http://localhost:8080");
});
