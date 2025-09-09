// ERPNext Milk Demo — CSV loading & rendering
// Dependencies: PapaParse (included in <head>), Bootstrap bundle
// Data files: data/suppliers.csv, data/items.csv, data/crm.csv

// CSV loader with BOM handling and fallback for delimiter (;)
async function loadCSV(url) {
  const parse = (opts = {}) =>
    new Promise((resolve, reject) => {
      Papa.parse(url, {
        download: true,
        header: true,
        skipEmptyLines: true,
        transformHeader: (h) => (h || "").replace(/^\uFEFF/, "").trim(),
        ...opts,
        complete: (r) => resolve(r.data || []),
        error: (err) => reject(err),
      });
    });

  const withTimeout = (p) =>
    Promise.race([
      p,
      new Promise((_, rej) =>
        setTimeout(() => rej(new Error(`Timeout loading ${url}`)), 15000)
      ),
    ]);

  // First attempt: auto-detect delimiter
  let rows = await withTimeout(parse());
  if (!rows || rows.length === 0) {
    console.warn(
      `[CSV] No rows detected for ${url}. Retrying with ';' delimiter…`
    );
    rows = await withTimeout(parse({ delimiter: ";" }));
  }
  return rows;
}

// Render a table dynamically based on CSV rows
function renderTable(tableEl, rows) {
  if (!tableEl) return;
  const thead = tableEl.querySelector("thead");
  const tbody = tableEl.querySelector("tbody");
  thead.innerHTML = "";
  tbody.innerHTML = "";

  if (!rows || rows.length === 0) {
    thead.innerHTML = "<tr><th>—</th></tr>";
    tbody.innerHTML = "<tr><td>No data available.</td></tr>";
    return;
  }

  const headers = Object.keys(rows[0]);
  const trHead = document.createElement("tr");
  headers.forEach((h) => {
    const th = document.createElement("th");
    th.textContent = h;
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);

  const frag = document.createDocumentFragment();
  rows.forEach((r) => {
    const tr = document.createElement("tr");
    headers.forEach((h) => {
      const td = document.createElement("td");
      const val = r[h];
      td.textContent = val === undefined || val === null ? "" : String(val);
      tr.appendChild(td);
    });
    frag.appendChild(tr);
  });
  tbody.appendChild(frag);
}

// Setup search input (global filter on the active table)
function setupSearch(inputEl, resetBtn) {
  inputEl.addEventListener("input", () => {
    const q = inputEl.value.trim().toLowerCase();
    filterVisibleTable(q);
  });
  resetBtn.addEventListener("click", () => {
    inputEl.value = "";
    filterVisibleTable("");
  });
}

// Apply filtering to the active tab's table
function filterVisibleTable(q) {
  const activePane = document.querySelector(".tab-pane.active.show");
  if (!activePane) return;
  activePane.querySelectorAll("tbody tr").forEach((row) => {
    const text = row.innerText.toLowerCase();
    row.style.display = q && !text.includes(q) ? "none" : "";
  });
}

// -----------------------------------------------------
// Init
// -----------------------------------------------------
(async function init() {
  try {
    if (typeof Papa === "undefined") {
      throw new Error("PapaParse not loaded. Check the <script> in <head>.");
    }

    const paths = {
      suppliers: "data/suppliers.csv",
      items: "data/items.csv",
      crm: "data/crm.csv",
    };

    const [suppliers, items, crm] = await Promise.all([
      loadCSV(paths.suppliers).catch((e) => {
        console.error("Suppliers CSV error:", e);
        return [];
      }),
      loadCSV(paths.items).catch((e) => {
        console.error("Items CSV error:", e);
        return [];
      }),
      loadCSV(paths.crm).catch((e) => {
        console.error("CRM CSV error:", e);
        return [];
      }),
    ]);

    console.log(`[OK] Suppliers: ${suppliers.length} rows`);
    console.log(`[OK] Items: ${items.length} rows`);
    console.log(`[OK] CRM: ${crm.length} rows`);

    renderTable(document.getElementById("suppliersTable"), suppliers);
    renderTable(document.getElementById("itemsTable"), items);
    renderTable(document.getElementById("crmTable"), crm);

    setupSearch(
      document.getElementById("searchInput"),
      document.getElementById("resetBtn")
    );

    // Re-apply filter when switching tabs
    document
      .querySelectorAll('button[data-bs-toggle="pill"]')
      .forEach((btn) => {
        btn.addEventListener("shown.bs.tab", () => {
          const q = document
            .getElementById("searchInput")
            .value.trim()
            .toLowerCase();
          filterVisibleTable(q);
        });
      });
  } catch (err) {
    console.error("[Init Error]", err);
    alert(
      "CSV loading failed.\nMake sure you run the site via HTTP (Live Server or `python3 -m http.server`) and verify the files:\n- data/suppliers.csv\n- data/items.csv\n- data/crm.csv"
    );
  }
})();
