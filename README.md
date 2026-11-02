# Last Light Courier

A tiny offline route puzzle. Collect every parcel, use a single-use charger wisely,
and reach the exit before the battery runs out. Three original routes; no timer.

For download instructions and optional feedback, see [Try a delivery](PLAYTEST.md).
To generate a single-file copy locally, run `python3 build-single.py`, then open
`last-light-courier.html`; no sibling files are needed for the generated copy.

Alternatively, extract the entire source ZIP, then open `index.html` in a modern browser. Keep `game.js`
and `ui.js` beside it. No install, server, build step or network connection needed.
Use on-screen direction buttons or arrow keys/WASD. U undoes; R restarts.
Select any route at any time. While the route selector has focus, arrow keys change
the selection; click the board or a direction button to resume keyboard movement.
Restart clears the route; reloading clears all progress. There is no saved progress.

Battery falls by one for every valid step; walls cost nothing. A charger refills
battery once per attempt. Crossing the exit early is allowed; collect all parcels
before finishing. Reaching the exit on the final unit of battery counts as a win.
Undo restores battery, parcels and charger state. No ads, accounts or telemetry.

Prototype. Rule and synthetic UI tests run with Node.js 22 on Linux.
The core play loop, buttons, keyboard, undo and restart were also checked in
headless Chromium 156 on Linux at desktop and 375-pixel viewport widths.
Other browsers and touch hardware have not been tested.
To run developer checks, use `node test.js` from this folder.
If reporting a bug, include route name, moves and expected result; avoid personal data.
Source and original CSS/text assets are MIT licensed. No third-party libraries.

To rebuild the portable file from source, run `python3 build-single.py`.
