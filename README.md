# ERPNext – Milk Cycle Demo

This repository presents a demo simulating a milk supply chain workflow implemented in ERPNext and visualized with a static frontend.  
It covers Phase 1 (Setup, Master Data, CRM) and Phase 2 (Purchase Receipts, Quality, BOM).  

The goal is to demonstrate end-to-end traceability, quality control, and integration of business processes, using CSV data displayed in a clean web UI.

## Tech Stack

- **Frontend:** [Bootstrap 5](https://getbootstrap.com/), [Bootstrap Icons](https://icons.getbootstrap.com/)  
- **CSV Handling:** [PapaParse](https://www.papaparse.com/)  
- **Languages & Tools:** HTML5, CSS3, Vanilla JavaScript  
  - References: [W3Schools](https://www.w3schools.com/), [Stack Overflow](https://stackoverflow.com/), [Udemy Web Development Bootcamp by Angela Yu](https://www.udemy.com/course/the-complete-web-development-bootcamp/)  
- **Hosting:** [GitHub Pages](https://pages.github.com/)

## Data Files

- `suppliers.csv` – Supplier master data  
- `items.csv` – Item master data (RAW / PAST milk)  
- `crm.csv` – CRM workflow (Lead → Opportunity → Quotation → Customer)  
- `purchase_receipts.csv` – Raw milk deliveries (with FAT, SNF, pH)  
- `quality.csv` – Quality inspections and acceptance rules  
- `bom.csv` – Bill of Materials (BOM-MILK_PAST-001)  

## Live Demo

The project is available on GitHub Pages:  
[https://vaggelis27.github.io/ERPNext-Project/](https://vaggelis27.github.io/ERPNext-Project/)

---

### Pitch

**“This demo simulates a milk supply chain workflow in ERPNext.  
I set up suppliers, items, and customers, then recorded purchase receipts with quality checks (FAT, SNF, pH).  
Data flows through batches, CRM (Lead → Opportunity → Quotation → Customer), and a Bill of Materials for pasteurized milk.  
The goal is to show end-to-end traceability, quality control, and integration of business processes, visualized through CSV data and a clean web UI.”**
