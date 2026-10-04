#!/bin/sh
# Baut fritzbox-dns-whitelist.zip (kann in AMO hochgeladen oder mit web-ext signiert werden)
set -e
cd "$(dirname "$0")"
rm -f fritzbox-dns-whitelist.zip
zip -r fritzbox-dns-whitelist.zip manifest.json background.js popup.html popup.js options.html options.js style.css icon.svg LICENSE
echo "→ fritzbox-dns-whitelist.zip"
