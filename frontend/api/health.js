const { send } = require("./_lib/http");

module.exports = function handler(_req, res) {
  send(res, 200, { ok: true, service: "tecnoantioquia-api" });
};
