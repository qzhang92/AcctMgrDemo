# Contoso Account Services

A single-page, static customer account detail demo for Northstar Manufacturing.
The existing LisbonDemo is unchanged.

## Run locally

Requires Node.js; no dependencies or build step.

```powershell
node .\server.mjs
```

Open http://127.0.0.1:4174. To choose another port:

```powershell
$env:PORT = 4180
node .\server.mjs
```

The server binds only to the local computer. Stop it with Ctrl+C.

## Page contents

- Account overview, current base, seats, optional expansion, and dated milestones.
- Proposed 2027 renewal, open actions, and expandable service scope.
- Role-based stakeholders and links to the four original workspace documents.
- Responsive desktop/mobile layouts and a print-friendly account brief.

Section navigation and the scope disclosure work without JavaScript. JavaScript
only enables the Print brief button. There is no backend, authentication,
live account data, or workflow mutation.

## Source data and boundaries

The snapshot is dated **20 October 2026**, not the viewer's current date. Content
is based on the renewal agreement, portfolio workbook, and leadership readout
in `demo files`. The daily brief PDF is linked as a supporting document, not
used as a source for page metrics. The top-level demo script was not readable
as an ordinary Office document and was not used.

All account data is fictional. The $480,000 current annual base is distinct from
an executed renewal; the $120,000 expansion is optional and requires a signed
change order. The 10% service-credit cap is a proposed position, not an approval.
Customer confirmation on 22 October and the internal checkpoint on 23 October
are separate milestones. Stakeholders are roles, not actual people.

## Static hosting

Publish `index.html`, `styles.css`, and `app.js` together, preserving the
`demo files` directory and filenames if document links should remain available.
No external fonts, images, libraries, or services are required. The Office
documents are approximately 202-242 MiB each; check host file-size limits before
publishing. The page does not download documents until a link is selected.
