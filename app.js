// Load CSV and render as table
function loadCSV(filePath, tableId) {
  Papa.parse(filePath, {
    download: true,
    header: true,
    complete: function (results) {
      renderTable(results.data, tableId);
    },
    error: function (error) {
      console.error("Error parsing CSV:", error);
      document.querySelector(
        `#${tableId}`
      ).innerHTML = `<tr><td colspan="5" class="text-danger">Error loading data.</td></tr>`;
    },
  });
}

// Render table with headers and rows
function renderTable(data, tableId) {
  const table = document.getElementById(tableId);
  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");

  thead.innerHTML = "";
  tbody.innerHTML = "";

  if (!data || data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-muted">No data available.</td></tr>`;
    return;
  }

  // Create table header
  const headers = Object.keys(data[0]);
  let headerRow = "<tr>";
  headers.forEach((h) => {
    headerRow += `<th>${h}</th>`;
  });
  headerRow += "</tr>";
  thead.innerHTML = headerRow;

  // Create table rows
  data.forEach((row) => {
    let rowHTML = "<tr>";
    headers.forEach((h) => {
      rowHTML += `<td>${row[h] || ""}</td>`;
    });
    rowHTML += "</tr>";
    tbody.innerHTML += rowHTML;
  });
}

// Search filter across all tables
function filterTables(query) {
  const tables = document.querySelectorAll("table");
  query = query.toLowerCase();

  tables.forEach((table) => {
    const rows = table.querySelectorAll("tbody tr");
    rows.forEach((row) => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(query) ? "" : "none";
    });
  });
}

// Init
document.addEventListener("DOMContentLoaded", function () {
  loadCSV("data/suppliers.csv", "suppliersTable");
  loadCSV("data/items.csv", "itemsTable");
  loadCSV("data/crm.csv", "crmTable");
  loadCSV("data/bom.csv", "bomTable");
  loadCSV("data/quality.csv", "qualityTable");

  // Search box
  const searchInput = document.getElementById("searchInput");
  const resetBtn = document.getElementById("resetBtn");

  if (searchInput) {
    searchInput.addEventListener("input", function () {
      filterTables(this.value);
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      searchInput.value = "";
      filterTables("");
    });
  }
});

// Handle gallery image click
document.addEventListener("DOMContentLoaded", function () {
  const galleryImages = document.querySelectorAll(".gallery-img");
  const modalImage = document.getElementById("modalImage");

  galleryImages.forEach((img) => {
    img.addEventListener("click", function () {
      modalImage.src = this.src;
      modalImage.alt = this.alt;
    });
  });
});
