# FRITZ!Box DNS-Whitelist

Firefox-/Zen-Erweiterung: Setzt die Domain der aktuellen Seite mit einem Klick auf die
**DNS-Filter-Ausnahmen („Erlaubt“)** deiner FRITZ!Box (FRITZ!OS mit DNS-Filterlisten, getestet mit
FRITZ!Box 7690 / FRITZ!OS 8.50).

- Ein Klick: Domain der aktuellen Seite wird auf der Box erlaubt (kein Tab, keine Weboberfläche nötig)
- Liste aller Domain-Ausnahmen der Box im Popup, mit Hinweis, wann sie über das Plugin hinzugefügt wurden
- Einträge direkt aus dem Popup wieder entfernen
- Hell/Dunkel passend zum System

## Hintergrund

Seit FRITZ!OS 8.50 hat die FRITZ!Box DNS-Filterlisten. Blockiert ein Filter dabei eine Seite, die man eigentlich braucht,
muss man bisher jedes Mal in die Weboberfläche der Box (Heimnetz → Netzwerk → Netzwerkeinstellungen → DNS-Filter →
„Eigene Domain hinzufügen“) und die Domain von Hand auf „Erlaubt“ setzen. Dieses Add-on erspart das: ein Klick im Browser genügt.

## Installation

**Temporär (zum Ausprobieren):** `about:debugging#/runtime/this-firefox` → „Temporäres Add-on laden“ → `manifest.json` wählen.
Bleibt nur bis zum Neustart des Browsers.

**Dauerhaft:** Erweiterung signieren lassen (z. B. `npx web-ext sign --channel=unlisted`, benötigt AMO-API-Schlüssel)
und die entstandene `.xpi` installieren – oder in Zen/Firefox Developer Edition / Nightly mit
`xpinstall.signatures.required = false` die ungesignierte Version nutzen.

Zum Bauen eines Zip-Pakets: `./build.sh`

## Einrichtung

Toolbar-Icon → „Einstellungen“ (oder `about:addons`):

| Feld | Bedeutung |
|---|---|
| Adresse | z. B. `http://fritz.box` (oder `https://fritz.box`) |
| Benutzername | leer = zuletzt benutzter Box-Benutzer |
| Passwort | Passwort des Box-Benutzers |
| Notiz | wird bei neuen Einträgen als Kommentar gespeichert |

Empfehlung: einen **eigenen Box-Benutzer** anlegen, der nur Zugriff auf die nötigen Einstellungen hat.

## Wie es funktioniert

Anmeldung über `login_sid.lua` (PBKDF2-Challenge-Response von AVM), danach Zugriff auf die REST-API der Box:

```
GET/POST/DELETE  /api/v0/beta/dnsfilter/domains
Authorization: AVM-SID <sid>
```

Diese Schnittstelle ist von AVM als **beta** gekennzeichnet und kann sich mit FRITZ!OS-Updates ändern.

## Datenschutz & Sicherheit

- Zugangsdaten liegen **unverschlüsselt** im lokalen Erweiterungsspeicher des Browsers.
- Die Erweiterung kommuniziert ausschließlich mit der konfigurierten FRITZ!Box. Keine Telemetrie, keine externen Server.
- Benötigte Rechte: `storage`, `activeTab` (Domain der aktuellen Seite) und Zugriff auf `fritz.box`.
- Inoffizielles Projekt, nicht mit AVM verbunden. FRITZ!Box ist eine Marke der AVM GmbH.

## Hinweis zu den Zeitstempeln

Die Box speichert kein Hinzufügedatum. Das Plugin merkt es sich lokal. Einträge, die anderweitig angelegt wurden,
erscheinen als „nicht über das Plugin hinzugefügt“.

## Lizenz

MIT
