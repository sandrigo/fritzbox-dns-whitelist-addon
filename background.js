const DEFAULTS = { url: "http://fritz.box", user: "", pass: "", note: "Zen-Plugin" };

// ---------- FRITZ!Box REST-API (kein Tab nötig) ----------
const hex2b = (h) => Uint8Array.from(h.match(/../g).map((x) => parseInt(x, 16)));
const b2hex = (b) => [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
async function pbkdf2(data, salt, iterations) {
  const key = await crypto.subtle.importKey("raw", data, "PBKDF2", false, ["deriveBits"]);
  return new Uint8Array(await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, key, 256));
}

async function apiLogin(base, user, pass) {
  const info = await (await fetch(base + "/login_sid.lua?version=2")).text();
  const challenge = /<Challenge>(.*?)<\/Challenge>/.exec(info)?.[1];
  if (!challenge?.startsWith("2$")) throw new Error("Unbekanntes Login-Verfahren der Box");
  const [, i1, s1, i2, s2] = challenge.split("$");
  const name = user || /<User last="1">(.*?)<\/User>/.exec(info)?.[1] || "";
  const h1 = await pbkdf2(new TextEncoder().encode(pass), hex2b(s1), +i1);
  const h2 = await pbkdf2(h1, hex2b(s2), +i2);
  const body = new URLSearchParams({ username: name, response: `${s2}$${b2hex(h2)}` });
  const res = await (await fetch(base + "/login_sid.lua?version=2", { method: "POST", body })).text();
  const sid = /<SID>([0-9a-f]+)<\/SID>/.exec(res)?.[1];
  if (!sid || /^0+$/.test(sid)) throw new Error("Login fehlgeschlagen (Zugangsdaten prüfen)");
  return sid;
}

async function apiSession(cfg) {
  try { return await apiSessionInner(cfg); }
  catch (e) {
    if (e instanceof TypeError) throw new Error(`Box unter ${cfg.url} nicht erreichbar (${e.message}) – Adresse in den Einstellungen prüfen (http/https, IP)`);
    throw e;
  }
}

async function apiSessionInner(cfg) {
  const base = cfg.url.replace(/\/+$/, "");
  const url = base + "/api/v0/beta/dnsfilter/domains";
  const call = (sid, path = "", init = {}) =>
    fetch(url + path, { cache: "no-store", ...init, headers: { Authorization: "AVM-SID " + sid, "Content-Type": "application/json" } });
  const store = browser.storage.session ?? browser.storage.local;
  let { sid } = await store.get("sid");
  let list = sid ? await call(sid) : null;
  if (!list || !list.ok) {
    if (!cfg.pass) throw new Error("Kein Passwort hinterlegt (Optionen).");
    sid = await apiLogin(base, cfg.user, cfg.pass);
    await store.set({ sid });
    list = await call(sid);
    if (!list.ok) throw new Error("API-Zugriff verweigert (" + list.status + ")");
  }
  return { sid, call, entries: await list.json() };
}

async function logAdd(domain) {
  const { log = {} } = await browser.storage.local.get("log");
  log[domain.toLowerCase()] = Date.now();
  await browser.storage.local.set({ log });
}

async function apiAdd(cfg, domain) {
  const { sid, call, entries } = await apiSession(cfg);
  const existing = entries.find((e) => e.domain?.toLowerCase() === domain.toLowerCase());
  if (existing?.action === "allow") return { ok: true, listed: true, note: "war schon erlaubt" };
  if (existing) await call(sid, "/" + existing.UID, { method: "DELETE" });
  const r = await call(sid, "", { method: "POST", body: JSON.stringify({ enabled: true, domain, comment: cfg.note, action: "allow" }) });
  if (!r.ok) throw new Error("API-Fehler beim Anlegen: " + r.status + " " + (await r.text()).slice(0, 150));
  await logAdd(domain);
  return { ok: true, listed: true };
}

async function apiList() {
  const cfg = await browser.storage.local.get(DEFAULTS);
  const { entries } = await apiSession(cfg);
  const { log = {} } = await browser.storage.local.get("log");
  // Protokoll mit der Box abgleichen: was dort (z. B. manuell) gelöscht wurde, fliegt auch aus dem Protokoll
  const onBox = new Set(entries.map((e) => e.domain?.toLowerCase()));
  const pruned = Object.fromEntries(Object.entries(log).filter(([d]) => onBox.has(d)));
  if (Object.keys(pruned).length !== Object.keys(log).length) await browser.storage.local.set({ log: pruned });
  return entries.map((e) => ({ uid: e.UID, domain: e.domain, action: e.action, comment: e.comment, added: pruned[e.domain?.toLowerCase()] || null }));
}

async function apiRemove(uid, domain) {
  const cfg = await browser.storage.local.get(DEFAULTS);
  const { sid, call } = await apiSession(cfg);
  const r = await call(sid, "/" + uid, { method: "DELETE" });
  if (!r.ok) throw new Error("Löschen fehlgeschlagen: " + r.status);
  const { log = {} } = await browser.storage.local.get("log");
  delete log[domain.toLowerCase()];
  await browser.storage.local.set({ log });
}

async function run(domain) {
  await browser.browserAction.setBadgeText({ text: "…" });
  let r;
  try {
    r = await apiAdd(await browser.storage.local.get(DEFAULTS), domain);
  } catch (e) {
    r = { ok: false, error: e.message };
  }
  await browser.browserAction.setBadgeText({ text: r.ok ? "✔" : "✖" });
  await browser.browserAction.setBadgeBackgroundColor({ color: r.ok ? "#0a7d2c" : "#c00" });
  await browser.storage.local.set({ last: { domain, ...r, at: Date.now() } });
  setTimeout(() => browser.browserAction.setBadgeText({ text: "" }), 15000);
  return r;
}

browser.runtime.onMessage.addListener((msg) => {
  if (msg?.type === "whitelist") return run(msg.domain);
  if (msg?.type === "list") return apiList().then((list) => ({ ok: true, list }), (e) => ({ ok: false, error: e.message }));
  if (msg?.type === "remove") return apiRemove(msg.uid, msg.domain).then(() => ({ ok: true }), (e) => ({ ok: false, error: e.message }));
});
