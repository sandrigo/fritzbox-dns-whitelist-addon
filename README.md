# FRITZ!Box DNS-Whitelist

🇩🇪 [Deutsche Version](README.de.md)

Firefox / Zen browser extension that adds the domain of the current page to the **DNS filter exceptions ("Allowed")** of your
FRITZ!Box with a single click (FRITZ!OS with DNS filter lists; tested with a FRITZ!Box 7690 / FRITZ!OS 8.50).

- One click: the domain of the current page is allowed on the box (no extra tab, no web UI needed)
- Popup lists all domain exceptions on the box, including when they were added through the add-on
- Remove entries straight from the popup
- Light/dark theme follows your system

## Background

Since FRITZ!OS 8.50 the FRITZ!Box has DNS filter lists. When a filter blocks a site you actually need, you previously had to open
the box's web interface (Home Network → Network → Network Settings → DNS Filter → "Add custom domain") and set the domain to
"Allowed" by hand. This add-on skips that: one click in your browser is enough.

## Installation

**Temporary (to try it out):** `about:debugging#/runtime/this-firefox` → "Load Temporary Add-on" → select `manifest.json`.
Stays installed only until the browser is restarted.

**Permanent:** have the extension signed (e.g. `npx web-ext sign --channel=unlisted`, requires AMO API keys) and install the
resulting `.xpi` – or use the unsigned version in Firefox Developer Edition / Nightly with `xpinstall.signatures.required = false`.

To build a zip package: `./build.sh`

## Setup

Toolbar icon → "Einstellungen" / settings (or `about:addons`):

| Field | Meaning |
|---|---|
| Address | e.g. `http://fritz.box` (or `https://fritz.box`) |
| Username | empty = last used box user |
| Password | password of the box user |
| Note | stored as comment on new entries |

Recommendation: create a **dedicated box user** with access to only the settings it needs.

## How it works

Sign-in via `login_sid.lua` (AVM's PBKDF2 challenge-response), then access to the box's REST API:

```
GET/POST/DELETE  /api/v0/beta/dnsfilter/domains
Authorization: AVM-SID <sid>
```

AVM labels this interface **beta**; it may change with FRITZ!OS updates.

## Privacy & security

- Credentials are stored **unencrypted** in the browser's local extension storage.
- The extension talks only to the configured FRITZ!Box. No telemetry, no external servers.
- Permissions: `storage`, `activeTab` (domain of the current page) and access to `fritz.box`.
- Unofficial project, not affiliated with AVM. FRITZ!Box is a trademark of AVM GmbH.

## About the timestamps

The box does not store an "added on" date. The add-on remembers it locally. Entries created in another way show up as
"not added via the add-on".

## Privacy

See [PRIVACY.md](PRIVACY.md).

## License

MIT
