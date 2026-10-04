# Angaben für addons.mozilla.org (zum Kopieren)

**Name (max. 50):** FRITZ!Box DNS-Whitelist

**Zusammenfassung (max. 250):**
Erlaubt die Domain der aktuellen Seite mit einem Klick in den DNS-Filter-Ausnahmen deiner FRITZ!Box (FRITZ!OS 8.50+). Listet, zeigt und entfernt Einträge direkt im Popup. / Allow the current site's domain in your FRITZ!Box DNS filter with one click.

**Beschreibung:**
Seit FRITZ!OS 8.50 hat die FRITZ!Box DNS-Filterlisten. Blockiert ein Filter eine Seite, die du brauchst, musst du bisher in die Weboberfläche der Box und die Domain von Hand auf „Erlaubt“ setzen. Dieses Add-on erledigt das mit einem Klick.

• Ein Klick: Domain der aktuellen Seite auf der Box erlauben (kein Tab, keine Weboberfläche)
• Liste aller Domain-Ausnahmen der Box im Popup, mit Datum, wann sie über das Add-on hinzugefügt wurden
• Einträge direkt aus dem Popup entfernen, Liste jederzeit aktualisieren
• Hell/Dunkel passend zum System

Einrichtung: Adresse, Benutzername und Passwort der FRITZ!Box in den Einstellungen eintragen. Empfehlung: eigenen Box-Benutzer mit nur den nötigen Rechten anlegen. Die Daten werden nur lokal im Browser gespeichert und nur an deine Box gesendet.

Inoffizielles Projekt, nicht mit AVM verbunden. FRITZ!Box ist eine Marke der AVM GmbH. Nutzt die als „beta“ gekennzeichnete REST-API der Box, die sich mit Updates ändern kann.

**Description (English):**
Since FRITZ!OS 8.50 the FRITZ!Box has DNS filter lists. If a filter blocks a site you need, you had to open the box's web interface and allow the domain by hand. This add-on does it with one click: allow the current page's domain, see all domain exceptions on the box, and remove them again – all from the popup. Credentials are stored locally and sent only to your own box. Unofficial, not affiliated with AVM.

**Kategorie:** Sonstiges / Other (alternativ: Privacy & Security)

**Support-Seite / Issues:** https://github.com/sandrigo/fritzbox-dns-whitelist-addon/issues
**Homepage:** https://github.com/sandrigo/fritzbox-dns-whitelist-addon
**Lizenz:** MIT
**Datenschutzerklärung:** Inhalt von PRIVACY.md einfügen (oder Link: https://github.com/sandrigo/fritzbox-dns-whitelist-addon/blob/main/PRIVACY.md)

**Hinweise für die Prüfer (Notes to reviewer):**
The extension needs a FRITZ!Box to be tested. Sign-in uses AVM's login_sid.lua (PBKDF2 challenge-response) and the box's REST API /api/v0/beta/dnsfilter/domains. The code is not minified; no build step. Host permission is limited to fritz.box; credentials are sent only to the user-configured address.

**Screenshots (selbst machen):** (1) Popup mit Liste, (2) Einstellungsseite, ggf. (3) Popup auf einer gesperrten Seite.
