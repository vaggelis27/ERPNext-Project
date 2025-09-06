// ----- Datasets -----
const DATASETS = {
  items: {
    title: "Items",
    file: "data/items.csv",
    columns: [
      "Item Code",
      "Item Name",
      "Item Group",
      "Stock UOM",
      "Standard Rate",
    ],
  },
  customers: {
    title: "Customers",
    file: "data/customers.csv",
    columns: [
      "Customer Name",
      "Customer Group",
      "Territory",
      "Default Currency",
    ],
  },
};

const $ = (s) => document.querySelector(s);
let allRows = [];
let sortState = { key: null, asc: true };

// CSV loader //
function csvToArray(file) {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (res) => resolve(res.data),
      error: reject,
    });
  });
}
function esc(v) {
  if (v == null) return "";
  return String(v)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

// Render table with search & sort //
function renderTable(title, rows, columns) {
  $("#table-tools").classList.remove("d-none");
  $("#search").value = "";
  sortState = { key: null, asc: true };
  allRows = rows.slice();

  const thead = `<thead><tr>${columns
    .map((c) => `<th data-key="${c}">${c}</th>`)
    .join("")}</tr></thead>`;
  const tbody = buildTbody(allRows, columns);
  $("#view").innerHTML = `
    <div class="table-wrap">
      <div class="p-3 border-bottom border-secondary d-flex justify-content-between align-items-center">
        <h2 class="h5 m-0">${title}</h2>
        <span class="badge text-bg-secondary">${rows.length} rows</span>
      </div>
      <div class="table-responsive">
        <table class="table m-0">${thead}${tbody}</table>
      </div>
    </div>`;
  $("#row-count").textContent = `${rows.length} rows`;

  document.querySelectorAll("th[data-key]").forEach((th) => {
    th.onclick = () => sortBy(th.getAttribute("data-key"), columns);
  });
  $("#search").oninput = () => filter($("#search").value.trim(), columns);
}

function buildTbody(rows, columns) {
  const body = rows
    .map(
      (r) => `<tr>${columns.map((c) => `<td>${esc(r[c])}</td>`).join("")}</tr>`
    )
    .join("");
  return `<tbody>${body}</tbody>`;
}

function filter(q, columns) {
  const query = q.toLowerCase();
  const filtered = !query
    ? allRows
    : allRows.filter((r) =>
        columns.some((c) =>
          String(r[c] ?? "")
            .toLowerCase()
            .includes(query)
        )
      );
  $("#row-count").textContent = `${filtered.length} / ${allRows.length} rows`;
  const tbody = buildTbody(filtered, columns);
  const table = document.querySelector("#view table");
  table.querySelector("tbody").outerHTML = tbody;
}

function sortBy(key, columns) {
  const asc = sortState.key === key ? !sortState.asc : true;
  sortState = { key, asc };
  allRows.sort((a, b) => {
    const va = (a[key] ?? "").toString().toLowerCase();
    const vb = (b[key] ?? "").toString().toLowerCase();
    if (!isNaN(Number(va)) && !isNaN(Number(vb)))
      return asc ? Number(va) - Number(vb) : Number(vb) - Number(va);
    return asc ? va.localeCompare(vb) : vb.localeCompare(va);
  });
  filter($("#search").value.trim(), columns);
}

// Router-like navigation//
async function show(key) {
  const cfg = DATASETS[key];
  try {
    const rows = await csvToArray(cfg.file);
    const normalized = rows.map((r) =>
      Object.fromEntries(cfg.columns.map((c) => [c, r[c] ?? ""]))
    );
    renderTable(cfg.title, normalized, cfg.columns);
  } catch (e) {
    $("#table-tools").classList.add("d-none");
    $("#view").innerHTML = `
      <div class="alert alert-warning">
        File <code>${cfg.file}</code> not found. Place your CSV under <code>/data</code> and refresh.
      </div>`;
  }
}

function route() {
  const hash = (location.hash || "#home").replace("#", "");
  if (hash === "items") return show("items");
  if (hash === "customers") return show("customers");
  // default = home only (hero)
  $("#table-tools").classList.add("d-none");
}

window.addEventListener("hashchange", route);
window.addEventListener("DOMContentLoaded", route);
