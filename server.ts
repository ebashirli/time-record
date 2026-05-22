import https from 'https';
import next from 'next';
import fs from 'fs';

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = 3000;

const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('./10.10.8.253+2-key.pem'),
  cert: fs.readFileSync('./10.10.8.253+2.pem'),
};

app.prepare().then(() => {
  const server = https.createServer(httpsOptions, (req, res) => {
    console.log(`→ ${req.method} ${req.url}`);

    handle(req, res);
  });

  server.listen(port, hostname, () => {
    console.log(`✅ Server ready`);
    console.log(`https://10.10.8.253:${port}`);
  });
});