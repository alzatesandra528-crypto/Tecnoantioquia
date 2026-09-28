let createApp;

try {
  ({ createApp } = require("./_lib/app"));
} catch {
  ({ createApp } = require("../../backend/src/app"));
}

const app = createApp();

module.exports = function handler(req, res) {
  if (req.url && !req.url.startsWith("/api")) {
    req.url = "/api" + (req.url.startsWith("/") ? req.url : "/" + req.url);
  }

  return app(req, res);
};
