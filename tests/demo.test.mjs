import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ids = Array.from({ length: 20 }, (_, index) => String(index + 1).padStart(2, "0"));
const files = await Promise.all(ids.map(async (id) => ({
  id,
  html: await readFile(resolve(root, "Pages", `${id}.html`), "utf8"),
})));
const app = await readFile(resolve(root, "app.js"), "utf8");
const identityCss = await readFile(resolve(root, "identities.css"), "utf8");

test("exactly 20 static page fragments match the route registry", async () => {
  const names = (await readdir(resolve(root, "Pages"))).filter((name) => name.endsWith(".html")).sort();
  assert.deepEqual(names, ids.map((id) => `${id}.html`));
  const registry = [...app.matchAll(/^\s+\["(\d{2})",/gm)].map((match) => match[1]);
  assert.deepEqual(registry, ids);
});

test("every page has its own identity and scoped visual treatment", () => {
  const identities = [...app.matchAll(/^\s+"(\d{2})": \{ wordmark: "([^"]+)"/gm)];
  assert.deepEqual(identities.map((match) => match[1]), ids);
  assert.equal(new Set(identities.map((match) => match[2])).size, 20);
  for (const id of ids) {
    assert.ok(identityCss.includes(`body[data-page="${id}"]`), `Missing identity for page ${id}`);
  }
  assert.doesNotMatch(identityCss, /@import|https?:\/\//, "Visual identities must not require remote fonts or assets");
});

test("page titles have no shared suffix and the directory is an accessible optional dialog", async () => {
  const shell = await readFile(resolve(root, "index.html"), "utf8");
  assert.match(app, /document\.title = title;/);
  assert.doesNotMatch(app, /\| Contoso Account Services/);
  assert.match(shell, /<link rel="stylesheet" href="identities\.css">/);
  assert.match(shell, /<dialog[^>]+id="page-directory"[^>]+aria-labelledby="directory-title"/);
  assert.match(shell, /aria-haspopup="dialog"[^>]+aria-expanded="false"[^>]+aria-controls="page-directory"/);
  assert.match(app, /directory\.showModal\(\)/);
  assert.match(app, /directory\.addEventListener\("close"/);
});

for (const { id, html } of files) {
  test(`page ${id}: heading, disclosure, unique IDs, and valid connections`, async (context) => {
    assert.equal((html.match(/<h1\b/g) || []).length, 1, "Exactly one page heading");
    assert.match(html, /<h1[^>]+id="page-title"[^>]+data-description="[^"]+"/);
    assert.match(html, /class="data-note"/, "Data provenance must be visible");
    assert.match(html, /class="heading-actions"/, "Shared print button needs an action area");
    const elementIds = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(new Set(elementIds).size, elementIds.length, "No duplicate element IDs");
    for (const [, target] of html.matchAll(/\baria-labelledby="([^"]+)"/g)) {
      for (const reference of target.split(/\s+/)) assert.ok(elementIds.includes(reference), `Missing label ${reference}`);
    }
    for (const [, href] of html.matchAll(/\bhref="([^"]+)"/g)) {
      if (href.startsWith("#/Pages/")) {
        assert.ok(ids.includes(href.slice(8)), `Invalid page link ${href}`);
      } else {
        assert.ok(href.startsWith("demo_files/"), `Unexpected link ${href}`);
        // Documents are optional deployment assets and intentionally ignored by Git.
        const file = resolve(root, href.replaceAll("/", "\\"));
        try {
          assert.ok((await stat(file)).isFile(), `Missing document ${href}`);
        } catch (error) {
          if (error.code !== "ENOENT") throw error;
          assert.match(href, /^demo_files\/(?:Northstar-Renewal-and-Services-Agreement\.docx|Account-Portfolio-Performance\.xlsx|Account-Portfolio-Leadership-Readout\.pptx|Account-Manager-Daily-Brief\.pdf)$/);
          context.diagnostic(`Optional source document is not deployed: ${href}`);
        }
      }
    }
  });
}

test("collection pages provide accessible search, filters, reset, counts, and empty states", () => {
  const collectionIds = ["02", "07", "09", "11", "15", "17", "18"];
  for (const id of collectionIds) {
    const html = files.find((file) => file.id === id).html;
    assert.match(html, /data-collection/);
    assert.match(html, /<label>[^<]+<input type="search"/);
    assert.match(html, /<label>[^<]+<select>/);
    assert.match(html, /data-reset/);
    assert.match(html, /data-count aria-live="polite"/);
    assert.match(html, /data-empty[^>]*hidden/);
    const values = new Set([...html.matchAll(/<option value="([^"]+)"/g)].map((match) => match[1]));
    const categories = [...html.matchAll(/data-item data-category="([^"]+)"/g)].map((match) => match[1]);
    assert.ok(categories.length > 0);
    for (const category of categories) assert.ok(values.has(category), `Unfilterable category ${category} on page ${id}`);
  }
});

test("portfolio, expansion, and invoice totals reconcile with displayed rows", () => {
  const html = (id) => files.find((file) => file.id === id).html;
  const amounts = (source) => [...source.matchAll(/<td>\$([\d,]+)<\/td>/g)].map((match) => Number(match[1].replaceAll(",", "")));
  assert.equal(amounts(html("02")).reduce((sum, value) => sum + value, 0), 1320000);
  assert.equal(amounts(html("07")).reduce((sum, value) => sum + value, 0), 192000);
  assert.equal(amounts(html("18")).reduce((sum, value) => sum + value, 0), 282000);
  assert.match(html("20"), /\$840K/);
  assert.match(html("20"), /63\.6%/);
  assert.match(html("18"), /\$282,000 issued - \$192,000 paid = \$90,000 outstanding/);
});
