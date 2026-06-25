import "dotenv/config";
import https from "https";
import next from "next";
import fs from "fs";

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = 3000;

const app = next({ dev });
const handle = app.getRequestHandler();
const host = process.env.BETTER_AUTH_URL?.split(":").at(1)?.replace("//", "");

const httpsOptions = {
  key: fs.readFileSync(`./${host}+2-key.pem`),
  cert: fs.readFileSync(`./${host}+2.pem`),
};

app.prepare().then(() => {
  const server = https.createServer(httpsOptions, (req, res) => {
    console.log(`→ ${req.method} ${req.url}`);

    handle(req, res);
  });

  server.listen(port, hostname, () => {
    console.log(`✅ Server ready`);
    console.log(`https://${host}:${port}`);
  });
});
