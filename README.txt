GREENLINE BANK — INTERACTIVE PROTOTYPE
========================================

A static, front-end-only prototype of a mobile banking app. Built with plain
HTML, CSS, and JavaScript (no build step, no backend, no dependencies).


CONTENTS
--------
index.html    All app screens (markup + inline SVG icons)
style.css     All styling (design tokens, layout, components)
script.js     Screen navigation, transaction rendering, Send Money flow,
              PIN entry, Cash Map pins
manifest.json Web app manifest (name, theme color, display mode)


HOW TO RUN
-----------
No install or build required.

Option 1 — just open it:
  Double-click index.html to open it in a browser.

Option 2 — local server (recommended, avoids any file:// quirks):
  python3 -m http.server 8000
  Then visit http://localhost:8000 in a browser.

For the intended look, use a narrow/mobile-sized browser window or your
browser's device toolbar (e.g. Chrome DevTools device mode) — the UI is
designed as a phone screen, not a responsive desktop layout.


SCREENS
-------
- Home           Balance, quick actions (Add money / Send money), recent
                  transactions, direct deposit banner, savings goals,
                  security shortcuts, and a spending-by-category donut chart.
- Move Money      Menu of transfer actions (Pay Anyone, pay a bill,
                  transfer between accounts, external transfer, add money).
                  Reached from the "Send money" button on Home.
- My Account      Virtual debit card, lock card / view PIN / replace card
                  shortcuts, and account/routing number details.
- Transactions    Full transaction history grouped by date, with a
                  Pending / Posted filter. This is the "Activity" tab.
- Pay Anyone      Search and recent-contacts list for sending money to
                  people.
- Send Money      Full external-transfer flow: choose recipient, source
                  account, amount, optional note, optional schedule, and
                  a running summary of fees/total. Reached via Move Money →
                  External transfer.
- Cash Map        Map view with pins for nearby ATMs, cash-back stores,
                  and branches.
- Pending / Success  Transitional screens shown after a transfer is
                  submitted: a processing animation with the amount, then
                  (after ~10 seconds) a success animation with the amount
                  and a Done button back to Home.
- PIN entry modal Bottom-sheet PIN pad shown before confirming a send.
                  Enter the 4-digit PIN using your own device keyboard —
                  there's no on-screen keypad, the four boxes fill as you
                  type. Demo PIN is 1472.

Navigation between screens is handled by the go(screenName) function in
script.js, which toggles a .active class on the corresponding .screen
element. The bottom nav bar has three tabs — Home, Activity, and Cash Map —
and highlights the relevant one automatically, including for sub-pages
(e.g. Account and Transactions highlight the right tab). Screens reached by
drilling down (Move Money, Pay Anyone, Send Money, Account) don't live in
the nav bar itself.


DATA
----
All data is hardcoded in script.js and index.html — account balance,
transactions, goals, contacts, map pin positions, and the PIN (1472). There
is no backend, API, or persistence; refreshing the page resets everything
to its default state.


NOTE
----
This is a visual/interactive prototype for design or demo purposes only.
It is not a real banking application: there is no authentication, no real
money movement, and no data storage. Do not enter real account or card
information into it.
