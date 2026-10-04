const $ = (id) => document.getElementById(id);
const status = (t, c = "") => { $("status").textContent = t; $("status").className = c; };

browser.tabs.query({ active: true, currentWindow: true }).then(([tab]) => {
  try { $("domain").value = new URL(tab.url).hostname; } catch {}
});
$("opts").onclick = (e) => { e.preventDefault(); browser.runtime.openOptionsPage(); window.close(); };
$("go").onclick = async () => {
  const domain = $("domain").value.trim();
  if (!domain) return status("Keine Domain.", "err");
  $("go").disabled = true; status("Trage ein …");
  const r = await browser.runtime.sendMessage({ type: "whitelist", domain });
  $("go").disabled = false;
  if (r?.ok) status(`✔ ${domain} ${r.note || "erlaubt"}`, "ok");
  else status("✖ " + (r?.error || "Fehler"), "err");
  loadList();
};

const fmt = (t) => new Date(t).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" });
async function loadList() {
  const ul = $("list");
  $("refresh").classList.add("spin"); $("refresh").disabled = true;
  const r = await browser.runtime.sendMessage({ type: "list" });
  $("refresh").classList.remove("spin"); $("refresh").disabled = false;
  ul.textContent = "";
  if (!r?.ok) { const li = document.createElement("li"); li.className = "msg err"; li.textContent = "✖ " + (r?.error || "Fehler"); ul.append(li); return; }
  if (!r.list.length) { const li = document.createElement("li"); li.className = "msg"; li.textContent = "Noch keine Einträge."; ul.append(li); return; }
  for (const e of r.list.sort((a, b) => (b.added || 0) - (a.added || 0))) {
    const li = document.createElement("li");
    const d = document.createElement("div"); d.className = "d";
    d.textContent = e.domain;
    const small = document.createElement("small");
    const dot = document.createElement("span"); dot.className = "dot" + (e.action === "allow" ? "" : " deny");
    small.append(dot, (e.action === "allow" ? "erlaubt" : "gesperrt") + " · " + (e.added ? fmt(e.added) : "nicht über das Plugin hinzugefügt"));
    d.append(small);
    const del = document.createElement("button"); del.textContent = "Entfernen"; del.title = "Von der Box löschen";
    del.onclick = async () => {
      del.disabled = true;
      const x = await browser.runtime.sendMessage({ type: "remove", uid: e.uid, domain: e.domain });
      x?.ok ? loadList() : status("✖ " + (x?.error || "Fehler"), "err");
    };
    li.append(d, del); ul.append(li);
  }
}
loadList();
$("refresh").onclick = loadList;
