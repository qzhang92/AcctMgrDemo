# Contoso Account Services

An account-management demo with **20 visually distinct static pages**, including
the original Northstar account overview. Each page has its own masthead,
typography, palette, and layout. No dependencies, build step, external assets,
backend, or live data connections.

## Run locally

Requires Node.js.

```powershell
node .\server.mjs
```

Open <http://127.0.0.1:4174/#/Pages/01>. Page routes use two-digit identifiers
from `01` through `20`. The root URL opens page `01`. Each route supports direct
links, refresh, and browser back/forward navigation. The original `#overview`,
`#renewal`, `#stakeholders`, and `#documents` bookmarks redirect to the
corresponding new pages.

To choose another port:

```powershell
$env:PORT = 4180
node .\server.mjs
```

The server binds only to the local computer. Stop it with Ctrl+C.

## Pages

| Route | Page | Visual identity |
|-------|------|-----------------|
| [01](http://127.0.0.1:4174/#/Pages/01) | Account Manager Home | daybook. / Warm editorial daily planner |
| [02](http://127.0.0.1:4174/#/Pages/02) | Account Portfolio | ATLAS / Cobalt index with a numerical side rail |
| [03](http://127.0.0.1:4174/#/Pages/03) | Customer Account Overview | NORTHSTAR / Industrial profile with an oversized dark hero |
| [04](http://127.0.0.1:4174/#/Pages/04) | Customer Health Dashboard | pulse / Clinical teal scorecards and rounded surfaces |
| [05](http://127.0.0.1:4174/#/Pages/05) | Renewal Pipeline | flow / Purple dot-grid kanban studio |
| [06](http://127.0.0.1:4174/#/Pages/06) | Renewal Detail | Renewal Dossier / Centered serif commercial document |
| [07](http://127.0.0.1:4174/#/Pages/07) | Expansion Opportunities | UPSIDE / Bold magenta opportunity exchange |
| [08](http://127.0.0.1:4174/#/Pages/08) | Opportunity Detail | PLUS / 500 / Asymmetric burnt-orange business case |
| [09](http://127.0.0.1:4174/#/Pages/09) | Contract & Agreement Library | The Vault / Archive catalogue with file-spine cards |
| [10](http://127.0.0.1:4174/#/Pages/10) | Contract Review Workspace | CLAUSE / Burgundy legal proof and square annotations |
| [11](http://127.0.0.1:4174/#/Pages/11) | Stakeholder Directory | people & partners / Warm, three-column profile directory |
| [12](http://127.0.0.1:4174/#/Pages/12) | Account Relationship Map | ORBIT / Dark relationship canvas with orbital nodes |
| [13](http://127.0.0.1:4174/#/Pages/13) | Meeting Preparation Brief | NEXT / Yellow meeting ticket and timed agenda |
| [14](http://127.0.0.1:4174/#/Pages/14) | Meeting Summary & Actions | Fieldnotes / Ruled notebook with a red margin |
| [15](http://127.0.0.1:4174/#/Pages/15) | Task & Follow-up Center | ACTION / DESK / Compact task register with an orange rail |
| [16](http://127.0.0.1:4174/#/Pages/16) | Service Delivery Overview | SERVICE GRID / Engineering blueprint and milestone track |
| [17](http://127.0.0.1:4174/#/Pages/17) | Support & Escalations | SIGNAL / Red incident desk and alert banner |
| [18](http://127.0.0.1:4174/#/Pages/18) | Revenue & Billing Overview | LEDGER / Mint financial ledger and tabular numerals |
| [19](http://127.0.0.1:4174/#/Pages/19) | Quarterly Business Review | Northstar Review / Large-format editorial journal |
| [20](http://127.0.0.1:4174/#/Pages/20) | Leadership Portfolio Readout | BOARDROOM / Navy-and-gold executive briefing |

## Structure and interactions

- [index.html](index.html) provides the page host and optional page directory.
- [app.js](app.js) manages hash routing, navigation, printing, and local filters.
- [Pages/](Pages/) contains 20 HTML content fragments, loaded into the shell.
  These fragments are not standalone styled documents; use the routes above.
- [styles.css](styles.css) preserves the original visual language;
  [pages.css](pages.css) adds reusable content layouts;
  [identities.css](identities.css) supplies 20 scoped designs and responsive/print
  adaptations. The active route sets `body[data-page]`; switching pages replaces
  that identity rather than accumulating themes.

Use **Browse 20 pages** to open a modal directory on desktop or mobile. Close it
with its button or Escape; keyboard focus returns to the opener. There is no
persistent sidebar. Each page can be opened directly and has its own short
browser title, without a shared company suffix. Visual identities are inspired
by the variety of layouts in the supplied LisbonDemo reference; they do not
import its styles, assets, or external fonts.

Each page includes previous/next navigation and a print button. Search and
category filters combine, show result counts and empty states, and can be reset.
Filters reset when navigating to another page. Scope disclosures use native
HTML details elements.

JavaScript and an HTTP server are required for routing and filters; opening
the shell directly as a local file is not supported. There are no simulated
saves, approvals, ticket updates, invitations, or signatures. Unknown routes
and failed page requests show explicit errors.

## Source data and boundaries

The snapshot is fixed at **20 October 2026**.

### Original Northstar demo facts

The original page's commercial facts carry forward from the renewal agreement,
portfolio workbook, and leadership readout in `demo_files`. The daily brief PDF
is linked as supporting material, not used for page metrics. The top-level demo
script was not readable as an ordinary Office document and was not used.

- Current annual base: **$480,000**, covering **2,000 seats**.
- Optional expansion: **500 seats / $120,000 full-year value**, requiring a
  separate signed change order.
- Proposed 2027 billing: **$120,000 quarterly / net 30**.
- Proposed service-credit cap: **up to 10% of the affected month's recurring
  fee**, not an approval.
- Customer confirmation target: **22 October**. Internal checkpoint:
  **23 October**. These are separate milestones.
- Proposed availability target: **99.9% monthly**, not actual measured uptime.
- The renewal is unsigned and the service lead is unassigned.

### Added fictional examples

Alpine Retail, Harbor Healthcare, and Meridian Logistics and their commercial
records were added for this collection. All health scores, adoption percentages,
support cases, invoices, meeting records, and discovery narratives are fictional,
not extracted from the original documents or connected systems. Each page
discloses its data boundary. Stakeholders are roles, not real people.

| Account | Annual base | Seats | Health | Adoption | Optional annual expansion |
|---------|------------:|------:|-------:|---------:|--------------------------:|
| Northstar | $480,000 | 2,000 | 68 | 82% | $120,000 / 500 seats |
| Alpine | $288,000 | 1,200 | 91 | 94% | $48,000 / 200 seats |
| Harbor | $360,000 | 1,500 | 54 | 71% | None |
| Meridian | $192,000 | 800 | 86 | 90% | $24,000 / 100 seats |
| **Total** | **$1,320,000** | **5,500** | | | **$192,000 / 800 seats** |

Current annual base, unsigned renewal pipeline, and optional expansion are
distinct. No optional expansion is committed. Northstar plus Harbor account for
$840,000 (63.6%) of base needing attention, not projected loss. The illustrative
invoice subset totals $282,000 issued, $192,000 paid, and $90,000 overdue.
Portfolio health and adoption averages are unweighted means, rounded for display.
All financial values are USD, excluding tax.

## Validation

Run the dependency-free structural checks:

```powershell
node --check .\app.js
node --test .\tests\demo.test.mjs
```

For browser validation, check all 20 routes at desktop and mobile widths,
exact browser titles, independent mastheads and layouts, navigation history,
direct refresh, the directory's keyboard/focus behavior, combined search/category
filters, empty/reset states, scope disclosures, print layout, and unknown routes.
Document URLs can be checked with HTTP HEAD to avoid downloading large files.

## Static hosting

Publish `index.html`, `styles.css`, `pages.css`, `identities.css`, `app.js`, and
the entire `Pages` directory together. Preserve `demo_files` and the four original filenames if
document downloads should remain available. That directory is ignored by Git,
so copy it separately when deploying; it is not included in a clone.

Hash routing requires no server-side route rewrites. No external fonts, images,
libraries, or services are required. The Office documents are approximately
202-242 MiB each; check host file-size limits. Documents are not fetched until
a user selects a document link.
