const { getStore } = require("@netlify/blobs");

const DEFAULT_STATE = {
  speed: 30,
  paused: false,
  fontSize: 48,
  resetId: 0,
  textVersion: 0,
  text: ""
};

function sanitizeState(input) {
  return {
    speed: Math.max(0, Math.min(250, Number(input.speed ?? DEFAULT_STATE.speed))),
    paused: Boolean(input.paused),
    fontSize: Math.max(24, Math.min(90, Number(input.fontSize ?? DEFAULT_STATE.fontSize))),
    resetId: Number(input.resetId ?? 0),
    textVersion: Number(input.textVersion ?? 0),
    text: typeof input.text === "string" ? input.text.slice(0, 600000) : ""
  };
}

exports.handler = async function(event) {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  const store = getStore("sunderkand-overlay-state");
  const key = "state";

  if (event.httpMethod === "GET") {
    const saved = await store.get(key, { type: "json" });
    return { statusCode: 200, headers, body: JSON.stringify(saved || DEFAULT_STATE) };
  }

  if (event.httpMethod === "POST") {
    let incoming = {};
    try { incoming = JSON.parse(event.body || "{}"); }
    catch (e) { return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON" }) }; }

    const cleaned = sanitizeState(incoming);
    await store.setJSON(key, cleaned);
    return { statusCode: 200, headers, body: JSON.stringify(cleaned) };
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
};
