const pages = [
  ["01", "Account Manager Home", "Workspace"],
  ["02", "Account Portfolio", "Workspace"],
  ["03", "Customer Account Overview", "Workspace"],
  ["04", "Customer Health Dashboard", "Workspace"],
  ["05", "Renewal Pipeline", "Commercial"],
  ["06", "Renewal Detail", "Commercial"],
  ["07", "Expansion Opportunities", "Commercial"],
  ["08", "Opportunity Detail", "Commercial"],
  ["09", "Contract & Agreement Library", "Commercial"],
  ["10", "Contract Review Workspace", "Commercial"],
  ["11", "Stakeholder Directory", "Relationships"],
  ["12", "Account Relationship Map", "Relationships"],
  ["13", "Meeting Preparation Brief", "Relationships"],
  ["14", "Meeting Summary & Actions", "Relationships"],
  ["15", "Task & Follow-up Center", "Delivery & insights"],
  ["16", "Service Delivery Overview", "Delivery & insights"],
  ["17", "Support & Escalations", "Delivery & insights"],
  ["18", "Revenue & Billing Overview", "Delivery & insights"],
  ["19", "Quarterly Business Review", "Delivery & insights"],
  ["20", "Leadership Portfolio Readout", "Delivery & insights"],
];

const main = document.querySelector("#main");
const nav = document.querySelector("#workspace-nav");
const pager = document.querySelector(".page-pager");
const toggle = document.querySelector(".nav-toggle");
let currentRequest;
let firstRender = true;

for (const group of new Set(pages.map((page) => page[2]))) {
  const heading = document.createElement("p");
  heading.className = "workspace-label";
  heading.textContent = group;
  nav.append(heading);
  for (const [id, title, category] of pages) {
    if (category !== group) continue;
    const link = document.createElement("a");
    link.className = "nav-link";
    link.href = `#/Pages/${id}`;
    link.innerHTML = `<span class="page-number">${id}</span><span>${title}</span>`;
    nav.append(link);
  }
}

toggle.hidden = false;
toggle.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") !== "true";
  toggle.setAttribute("aria-expanded", String(open));
  nav.classList.toggle("is-open", open);
});

document.querySelector(".skip-link").addEventListener("click", (event) => {
  event.preventDefault();
  main.focus();
  main.scrollIntoView();
});

function wireFilters() {
  for (const collection of main.querySelectorAll("[data-collection]")) {
    const search = collection.querySelector('input[type="search"]');
    const filter = collection.querySelector("select");
    const items = [...collection.querySelectorAll("[data-item]")];
    const count = collection.querySelector("[data-count]");
    const empty = collection.querySelector("[data-empty]");
    const update = () => {
      const query = search ? search.value.trim().toLowerCase() : "";
      const value = filter ? filter.value : "all";
      let visible = 0;
      for (const item of items) {
        const matches = item.textContent.toLowerCase().includes(query) &&
          (value === "all" || item.dataset.category === value);
        item.hidden = !matches;
        if (matches) visible += 1;
      }
      if (count) count.textContent = `${visible} of ${items.length} shown`;
      if (empty) empty.hidden = visible !== 0;
    };
    search?.addEventListener("input", update);
    filter?.addEventListener("change", update);
    collection.querySelector("[data-reset]")?.addEventListener("click", () => {
      if (search) search.value = "";
      if (filter) filter.value = "all";
      update();
      search?.focus();
    });
    update();
  }
  main.querySelector("[data-print]")?.addEventListener("click", () => window.print());
}

function renderPager(index) {
  pager.replaceChildren();
  for (const [offset, label] of [[-1, "Previous"], [1, "Next"]]) {
    const target = pages[index + offset];
    const element = document.createElement(target ? "a" : "span");
    if (target) {
      element.href = `#/Pages/${target[0]}`;
      element.textContent = `${label}: ${target[1]}`;
    }
    pager.append(element);
  }
  pager.hidden = false;
}

async function renderRoute() {
  const legacyRoutes = { "#overview": "03", "#renewal": "06", "#stakeholders": "11", "#documents": "09" };
  if (legacyRoutes[location.hash]) {
    location.replace(`#/Pages/${legacyRoutes[location.hash]}`);
    return;
  }
  currentRequest?.abort();
  const request = new AbortController();
  currentRequest = request;
  const match = /^#\/Pages\/(\d{2})\/?$/.exec(location.hash);
  const index = match ? pages.findIndex(([id]) => id === match[1]) : -1;
  nav.classList.remove("is-open");
  toggle.setAttribute("aria-expanded", "false");
  for (const link of nav.querySelectorAll("a")) {
    const active = index >= 0 && link.hash === `#/Pages/${pages[index][0]}`;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
  pager.hidden = true;
  main.setAttribute("aria-busy", "true");
  main.innerHTML = '<div class="card loading-state" role="status">Loading page...</div>';
  try {
    if (index < 0) throw new Error("This demo page does not exist. Choose a page from the workspace navigation.");
    const [id, title] = pages[index];
    const response = await fetch(`Pages/${id}.html`, { signal: request.signal });
    if (!response.ok) throw new Error(`Unable to load page ${id} (HTTP ${response.status}).`);
    const html = await response.text();
    if (request.signal.aborted) return;
    main.innerHTML = html;
    const heading = main.querySelector("h1");
    if (!heading) throw new Error(`Page ${id} is missing its heading.`);
    document.title = `${title} | Contoso Account Services`;
    document.querySelector("#breadcrumb-title").textContent = title;
    const description = document.createElement("p");
    description.className = "page-description";
    description.textContent = heading.dataset.description || "";
    heading.after(description);
    const actions = main.querySelector(".heading-actions");
    if (actions) actions.insertAdjacentHTML("afterbegin", '<button type="button" class="button button-secondary" data-print>Print page</button>');
    wireFilters();
    renderPager(index);
    document.querySelector("#route-status").textContent = `Page ${id} of 20: ${title}`;
  } catch (error) {
    if (request.signal.aborted) return;
    console.error("Page navigation failed:", error);
    document.title = "Page unavailable | Contoso Account Services";
    document.querySelector("#breadcrumb-title").textContent = "Page unavailable";
    main.innerHTML = '<section class="card error-state"><span class="eyebrow">NAVIGATION ERROR</span><h1>Page unavailable</h1><p></p><a class="button button-primary" href="#/Pages/01">Return to workspace home</a></section>';
    main.querySelector("p").textContent = error instanceof Error ? error.message : "An unexpected navigation error occurred.";
    document.querySelector("#route-status").textContent = "Page could not be loaded.";
  } finally {
    if (!request.signal.aborted) {
      main.setAttribute("aria-busy", "false");
      if (!firstRender) main.focus({ preventScroll: true });
      firstRender = false;
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }
}

window.addEventListener("hashchange", renderRoute);
if (!location.hash) history.replaceState(null, "", "#/Pages/01");
renderRoute();
