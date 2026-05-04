// typescript

import express from "express";
import type { Request, Response } from "express";

import { createProxyMiddleware } from "http-proxy-middleware";
// import type { Filter, Options, RequestHandler } from "http-proxy-middleware";

const app = express();

const proxyMiddleware = createProxyMiddleware<Request, Response>({
  target: "http://10.10.10.56:8000",
  changeOrigin: true,
});

app.use("/", proxyMiddleware);

app.listen(51212);

// proxy and keep the same base path "/api"
// http://127.0.0.1:3000/api/foo/bar -> http://10.10.10.56:8000
