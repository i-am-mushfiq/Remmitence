import { spawn } from "node:child_process";
import { appendFileSync, writeFileSync } from "node:fs";

// Drives the Bubblewrap CLI's interactive prompts non-interactively.
// Strategy: specific text-input prompts get specific answers (keystore
// password, distinguished-name fields); everything else — including all
// confirm/yes-no prompts, which auto-resolve to a default in non-TTY mode
// regardless of what we send — is left alone until the prompt has been
// static for a settle period, at which point we press Enter to accept
// whatever default Bubblewrap has pre-filled (shown in parentheses).
// Everything is logged to bubblewrap-session.log for inspection.

const LOG = "bubblewrap-session.log";
writeFileSync(LOG, "");

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node drive-bubblewrap.mjs <bubblewrap args...>");
  process.exit(1);
}

function stripAnsi(s) {
  // eslint-disable-next-line no-control-regex
  return s.replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, "").replace(/\r/g, "");
}

// Specific answers for prompts with no sensible default. Checked first.
const SPECIFIC_RULES = [
  [/path to your existing jdk/i, "C:\\Program Files\\Amazon Corretto\\jdk17.0.19_10"],
  [/path to your existing android sdk/i, "C:\\Users\\TL-77057\\android-sdk"],
  [/password.*key\s*store|key\s*store.*password/i, "bubblewrap123"],
  [/password.*for the key:|^key password/i, "bubblewrap123"],
  [/first and last name/i, "RemmiNext Sdn Bhd"],
  [/organizational unit/i, "Engineering"],
  [/name of your organization/i, "RemmiNext Sdn Bhd"],
  [/name of your city or locality/i, "Kuala Lumpur"],
  [/name of your state or province/i, "Kuala Lumpur"],
  [/country code/i, "MY"],
];

const SETTLE_MS = 2500; // how long a prompt must sit unchanged before we accept its default
const POLL_MS = 500;

let cleanBuffer = "";
let currentTail = "";
let tailSince = Date.now();
let lastHandledTail = "";
let awaitingAnswer = false;
let lastActivityAt = Date.now();

const child = spawn("npx", ["--yes", "@bubblewrap/cli", ...args], {
  cwd: process.cwd(),
  shell: true,
  stdio: ["pipe", "pipe", "pipe"],
});

function handleChunk(raw) {
  const text = raw.toString();
  process.stdout.write(text);
  appendFileSync(LOG, text);
  cleanBuffer = (cleanBuffer + stripAnsi(text)).slice(-2000);
  lastActivityAt = Date.now();

  const tail = cleanBuffer.slice(-300).trim();
  if (tail !== currentTail) {
    currentTail = tail;
    tailSince = Date.now();
  }
}

child.stdout.on("data", handleChunk);
child.stderr.on("data", handleChunk);

const poll = setInterval(() => {
  if (awaitingAnswer) return;
  const tail = currentTail;
  if (!tail || tail === lastHandledTail) return;

  // Specific rules can fire as soon as the prompt appears.
  for (const [matcher, answer] of SPECIFIC_RULES) {
    if (matcher.test(tail)) {
      send(tail, answer);
      return;
    }
  }

  // Generic fallback: only after the prompt has been stable for SETTLE_MS,
  // and only if it actually looks like a live prompt (contains a "?" —
  // list-style prompts render their options across multiple lines below it).
  if (tail.includes("?") && Date.now() - tailSince > SETTLE_MS) {
    send(tail, null);
  }
}, POLL_MS);

function send(signature, answer) {
  awaitingAnswer = true;
  const toSend = (answer === null ? "" : answer) + "\n";
  setTimeout(() => {
    child.stdin.write(toSend);
    lastHandledTail = signature;
    appendFileSync(LOG, `\n>>> ANSWERED with: ${JSON.stringify(toSend)}\n`);
    awaitingAnswer = false;
  }, 300);
}

child.on("exit", (code) => {
  clearInterval(poll);
  appendFileSync(LOG, `\n>>> EXIT CODE: ${code}\n`);
  process.exit(code ?? 0);
});

setInterval(() => {
  if (Date.now() - lastActivityAt > 30000) {
    appendFileSync(LOG, "\n>>> WATCHDOG: no output in 30s, may be stuck or downloading...\n");
    lastActivityAt = Date.now();
  }
}, 5000);
