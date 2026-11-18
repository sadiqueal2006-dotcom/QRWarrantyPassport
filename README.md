# QR Warranty Passport — Starter Demo

A simple responsive website prototype containing:
- Public homepage and Product ID lookup
- Shop Admin demo login (PIN: `1234`)
- Product registration form
- QR code generation and PNG download
- Product passport page
- Demo service callback form
- JSON export of local demo records

## Run locally
Open `index.html` in a browser. QR generation uses the QRCode.js CDN, so the browser needs an internet connection for that feature.

## Important: this is a front-end prototype, not a production SaaS
This version stores product records in the browser's `localStorage`. Therefore:
- Records are visible only in the same browser and device.
- A QR scanned on another phone will not be able to retrieve this browser's local record.
- The demo PIN is not secure authentication.
- Service requests are stored locally and are not sent to the shop.
- Do not enter real customer personal information or real warranty documents.

## Before a real launch
Connect a server-side database and API (for example Cloudflare Workers + D1), add proper shop authentication and role-based access, private document storage, rate limiting, backups, consent/privacy notice, and verified ownership controls. Use random unguessable public product tokens rather than exposing sequential IDs. Test warranty-date calculations, QR scans on another phone, access permissions and data deletion.

## Suggested production structure
- `index.html`: public marketing page
- `admin.html`: authenticated shop dashboard
- `product.html`: customer-facing passport
- `app.js`, `admin.js`, `product.js`: front-end logic
- `styles.css`: responsive styling
