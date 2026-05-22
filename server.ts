import { createServer } from "https";
import { parse } from "url";
import next from "next";
import fs from "fs";

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync("./10.10.8.253+2-key.pem"),
  cert: fs.readFileSync("./10.10.8.253+2.pem"),
};

app.prepare().then(() => {
  const server = createServer(httpsOptions, async (req, res) => {
    try {
      const parsedUrl = parse(req.url!, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  server.on("error", (err) => {
    console.error("Server error:", err);
    process.exit(1);
  });

  server.listen(port, hostname, () => {
    console.log(`> Ready on https://${hostname}:${port}`);
  });
});
