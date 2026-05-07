import { createServer } from "https";
// import { parse } from "url";
import next from "next";
import fs from "fs";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync("./localhost+3-key.pem"),
  cert: fs.readFileSync("./localhost+3.pem"),
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const protocol = httpsOptions ? "https" : "http";
    const base = `${protocol}://${req.headers.host}`;

    const parsedUrl = new URL(req.url, base);
    handle(req, res, parsedUrl);
  }).listen(3000, "0.0.0.0", (err) => {
    if (err) throw err;
    console.log("> Ready on https://localhost:3000");
  });
});
