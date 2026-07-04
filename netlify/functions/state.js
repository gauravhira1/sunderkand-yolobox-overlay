let currentState = global.__SUNDERKAND_STATE__ || {
  speed: 30,
  paused: false,
  fontSize: 48,
  resetId: 0,
  textVersion: 0,
  text: "",
  textFile: "hanuman-chalisa.txt",
  textColor: "#ffffff",
  shadowColor: "#000000",
  jumpSeconds: 0,
  jumpRequestId: 0
};

global.__SUNDERKAND_STATE__ = currentState;

function safeColor(value, fallback) {
  if (typeof value !== "string") return fallback;
  const v = value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return v;
  return fallback;
}

function safeFile(value, fallback) {
  const allowed = ["jai-ambe-gauri.txt", "hanuman-chalisa.txt", "sunderkand.txt"];
  if (allowed.includes(value)) return value;
  return fallback;
}

function sanitizeState(input) {
  return {
    speed: Math.max(0, Math.min(250, Number(input.speed ?? currentState.speed ?? 30))),
    paused: Boolean(input.paused),
    fontSize: Math.max(24, Math.min(90, Number(input.fontSize ?? currentState.fontSize ?? 48))),
    resetId: Number(input.resetId ?? currentState.resetId ?? 0),
    textVersion: Number(input.textVersion ?? currentState.textVersion ?? 0),
    text: typeof input.text === "string" ? input.text.slice(0, 600000) : "",
    textFile: safeFile(input.textFile ?? currentState.textFile, "hanuman-chalisa.txt"),
    textColor: safeColor(input.textColor ?? currentState.textColor, "#ffffff"),
    shadowColor: safeColor(input.shadowColor ?? currentState.shadowColor, "#000000"),
    jumpSeconds: Number(input.jumpSeconds ?? 0),
    jumpRequestId: Number(input.jumpRequestId ?? currentState.jumpRequestId ?? 0)
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

  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };

  if (event.httpMethod === "GET") {
    return { statusCode: 200, headers, body: JSON.stringify(currentState) };
  }

  if (event.httpMethod === "POST") {
    let incoming = {};
    try { incoming = JSON.parse(event.body || "{}"); }
    catch (e) { return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON" }) }; }

    currentState = sanitizeState(incoming);
    global.__SUNDERKAND_STATE__ = currentState;
    return { statusCode: 200, headers, body: JSON.stringify(currentState) };
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
};
