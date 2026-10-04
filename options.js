const F = ["url", "user", "pass", "note"];
const DEFAULTS = { url: "http://fritz.box", user: "", pass: "", note: "Zen-Plugin" };
browser.storage.local.get(DEFAULTS).then((c) => F.forEach((k) => (document.getElementById(k).value = c[k])));
document.getElementById("save").onclick = async () => {
  await browser.storage.local.set(Object.fromEntries(F.map((k) => [k, document.getElementById(k).value.trim()])));
  document.getElementById("msg").textContent = "Gespeichert ✔";
};

