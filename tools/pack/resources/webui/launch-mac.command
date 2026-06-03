#!/usr/bin/env sh
# Double-click entry. `start` now detaches into the background and returns, so
# keep this Terminal window open long enough to read the printed URL.
DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
"$DIR/open-design.sh" start
printf '\nPress Enter to close this window (the service keeps running in the background; run ./open-design.sh stop to stop it)… '
read _
