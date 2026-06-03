const storageKey = "calculadora-piscicultura-biometrias";

const form = document.querySelector("#biometryForm");
const fields = {
  property: document.querySelector("#property"),
  date: document.querySelector("#date"),
  tank: document.querySelector("#tank"),
  species: document.querySelector("#species"),
  customSpecies: document.querySelector("#customSpecies"),
  fishTotal: document.querySelector("#fishTotal"),
  sampleCount: document.querySelector("#sampleCount"),
  sampleWeight: document.querySelector("#sampleWeight"),
  feedRate: document.querySelector("#feedRate"),
};

const outputs = {
  averageWeight: document.querySelector("#averageWeight"),
  biomass: document.querySelector("#biomass"),
  dailyFeed: document.querySelector("#dailyFeed"),
};

const recordsList = document.querySelector("#recordsList");
const savedCount = document.querySelector("#savedCount");
const generateReportButton = document.querySelector("#generateReport");
const resetRecordsButton = document.querySelector("#resetRecords");
const clearFormButton = document.querySelector("#clearForm");
const cancelEditButton = document.querySelector("#cancelEdit");
const saveButton = document.querySelector("#saveButton");
const reportDialog = document.querySelector("#reportDialog");
const closeReportButton = document.querySelector("#closeReport");
const reportContent = document.querySelector("#reportContent");
const printReportButton = document.querySelector("#printReport");
const exportCsvButton = document.querySelector("#exportCsv");
const installAppButton = document.querySelector("#installApp");
const customSpeciesField = document.querySelector("#customSpeciesField");
const listedSpecies = Array.from(fields.species.options)
  .map((option) => option.value)
  .filter((value) => value && value !== "Outros");

let records = loadRecords();
let installPrompt = null;
let editingRecordId = null;

fields.date.value = todayValue();

function todayValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function createId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function numberValue(input) {
  return Number(String(input.value || "").replace(",", ".")) || 0;
}

function formatNumber(value, decimals = 2) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: value === 0 ? 0 : decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

function formatDate(value) {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function calculate() {
  const fishTotal = numberValue(fields.fishTotal);
  const sampleCount = numberValue(fields.sampleCount);
  const sampleWeight = numberValue(fields.sampleWeight);
  const feedRate = numberValue(fields.feedRate);

  const averageWeight = sampleCount > 0 ? sampleWeight / sampleCount : 0;
  const biomass = averageWeight * fishTotal;
  const dailyFeed = biomass * (feedRate / 100);

  outputs.averageWeight.value = formatNumber(averageWeight, 3);
  outputs.biomass.value = formatNumber(biomass, 2);
  outputs.dailyFeed.value = formatNumber(dailyFeed, 2);

  return {
    averageWeight,
    biomass,
    dailyFeed,
  };
}

function selectedSpeciesName() {
  if (fields.species.value === "Outros") {
    return fields.customSpecies.value.trim();
  }

  return fields.species.value;
}

function updateCustomSpeciesField() {
  const isOtherSpecies = fields.species.value === "Outros";
  customSpeciesField.hidden = !isOtherSpecies;
  fields.customSpecies.required = isOtherSpecies;
  fields.customSpecies.disabled = !isOtherSpecies;

  if (!isOtherSpecies) {
    fields.customSpecies.value = "";
  }
}

function loadRecords() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
}

function persistRecords() {
  localStorage.setItem(storageKey, JSON.stringify(records));
}

function renderRecords() {
  savedCount.textContent = records.length;
  generateReportButton.disabled = records.length === 0;

  if (records.length === 0) {
    recordsList.innerHTML = '<div class="empty-state">Nenhuma biometria salva.</div>';
    return;
  }

  recordsList.innerHTML = records
    .map(
      (record) => `
        <article class="record-item${record.id === editingRecordId ? " editing" : ""}">
          <div>
            <p class="record-title">${escapeHtml(record.tank)} · ${escapeHtml(record.species)}</p>
            <p class="record-meta">${escapeHtml(record.property)} · ${formatDate(record.date)}</p>
            <p class="record-stats">
              ${formatNumber(record.biomass)} kg biomassa ·
              ${formatNumber(record.dailyFeed)} kg ração/dia ·
              ${formatNumber(record.averageWeight, 3)} kg peso médio
            </p>
          </div>
          <div class="record-buttons">
            <button class="edit-record" type="button" data-edit="${record.id}" aria-label="Editar ${escapeHtml(record.tank)}">
              <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>
              </svg>
            </button>
            <button class="delete-record" type="button" data-delete="${record.id}" aria-label="Remover ${escapeHtml(record.tank)}">
              <svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18M8 6V4h8v2M6 6l1 16h10l1-16M10 11v6M14 11v6"/>
              </svg>
            </button>
          </div>
        </article>
      `
    )
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clearMeasurementFields() {
  fields.tank.value = "";
  fields.fishTotal.value = "";
  fields.sampleCount.value = "";
  fields.sampleWeight.value = "";
  fields.feedRate.value = "";
  calculate();
  fields.tank.focus();
}

function clearForm() {
  form.reset();
  fields.date.value = todayValue();
  updateCustomSpeciesField();
  stopEditing();
  calculate();
}

function buildRecord(id = createId()) {
  const calculations = calculate();

  return {
    id,
    property: fields.property.value.trim(),
    date: fields.date.value,
    tank: fields.tank.value.trim(),
    species: selectedSpeciesName(),
    fishTotal: numberValue(fields.fishTotal),
    sampleCount: numberValue(fields.sampleCount),
    sampleWeight: numberValue(fields.sampleWeight),
    feedRate: numberValue(fields.feedRate),
    ...calculations,
  };
}

function fillForm(record) {
  fields.property.value = record.property;
  fields.date.value = record.date;
  fields.tank.value = record.tank;
  if (listedSpecies.includes(record.species)) {
    fields.species.value = record.species;
    fields.customSpecies.value = "";
  } else {
    fields.species.value = "Outros";
    fields.customSpecies.value = record.species;
  }
  updateCustomSpeciesField();
  fields.fishTotal.value = record.fishTotal;
  fields.sampleCount.value = record.sampleCount;
  fields.sampleWeight.value = record.sampleWeight;
  fields.feedRate.value = record.feedRate;
  calculate();
}

function startEditing(recordId) {
  const record = records.find((item) => item.id === recordId);
  if (!record) return;

  editingRecordId = record.id;
  fillForm(record);
  saveButton.textContent = "Atualizar";
  cancelEditButton.hidden = false;
  renderRecords();
  form.scrollIntoView({ behavior: "smooth", block: "start" });
  fields.tank.focus();
}

function stopEditing() {
  editingRecordId = null;
  saveButton.textContent = "Salvar";
  cancelEditButton.hidden = true;
  renderRecords();
}

function getSummary() {
  const totalFish = records.reduce((total, record) => total + record.fishTotal, 0);
  const totalBiomass = records.reduce((total, record) => total + record.biomass, 0);
  const totalFeed = records.reduce((total, record) => total + record.dailyFeed, 0);
  const weightedAverage =
    totalFish > 0
      ? records.reduce((total, record) => total + record.averageWeight * record.fishTotal, 0) / totalFish
      : 0;

  return {
    tanks: records.length,
    totalFish,
    totalBiomass,
    totalFeed,
    weightedAverage,
  };
}

function renderReport() {
  const summary = getSummary();
  const firstRecord = records[0];

  reportContent.innerHTML = `
    <div class="summary-grid">
      <div class="summary-box">
        <span>Propriedade</span>
        <strong>${escapeHtml(firstRecord.property)}</strong>
      </div>
      <div class="summary-box">
        <span>Data</span>
        <strong>${formatDate(firstRecord.date)}</strong>
      </div>
      <div class="summary-box">
        <span>Tanques</span>
        <strong>${summary.tanks}</strong>
      </div>
      <div class="summary-box">
        <span>Peixes</span>
        <strong>${formatNumber(summary.totalFish, 0)}</strong>
      </div>
      <div class="summary-box">
        <span>Peso médio geral</span>
        <strong>${formatNumber(summary.weightedAverage, 3)} kg</strong>
      </div>
      <div class="summary-box">
        <span>Biomassa total</span>
        <strong>${formatNumber(summary.totalBiomass)} kg</strong>
      </div>
      <div class="summary-box">
        <span>Ração total/dia</span>
        <strong>${formatNumber(summary.totalFeed)} kg</strong>
      </div>
      <div class="summary-box">
        <span>Espécies</span>
        <strong>${new Set(records.map((record) => record.species)).size}</strong>
      </div>
    </div>

    <div class="report-table-wrap">
      <table>
        <thead>
          <tr>
            <th>Tanque</th>
            <th>Espécie</th>
            <th>Peixes</th>
            <th>Amostra</th>
            <th>Peso amostra</th>
            <th>Peso médio</th>
            <th>Biomassa</th>
            <th>Taxa</th>
            <th>Ração/dia</th>
          </tr>
        </thead>
        <tbody>
          ${records
            .map(
              (record) => `
                <tr>
                  <td>${escapeHtml(record.tank)}</td>
                  <td>${escapeHtml(record.species)}</td>
                  <td>${formatNumber(record.fishTotal, 0)}</td>
                  <td>${formatNumber(record.sampleCount, 0)}</td>
                  <td>${formatNumber(record.sampleWeight)} kg</td>
                  <td>${formatNumber(record.averageWeight, 3)} kg</td>
                  <td>${formatNumber(record.biomass)} kg</td>
                  <td>${formatNumber(record.feedRate)}%</td>
                  <td>${formatNumber(record.dailyFeed)} kg</td>
                </tr>
              `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function exportCsv() {
  const header = [
    "Propriedade",
    "Data",
    "Tanque",
    "Espécie",
    "Peixes total",
    "Amostragem",
    "Peso total amostragem kg",
    "Peso médio kg",
    "Biomassa kg",
    "Taxa alimentação %",
    "Ração dia kg",
  ];

  const rows = records.map((record) => [
    record.property,
    formatDate(record.date),
    record.tank,
    record.species,
    record.fishTotal,
    record.sampleCount,
    record.sampleWeight.toFixed(3),
    record.averageWeight.toFixed(3),
    record.biomass.toFixed(2),
    record.feedRate.toFixed(2),
    record.dailyFeed.toFixed(2),
  ]);

  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(";"))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "relatorio-biometria-piscicultura.csv";
  link.click();
  URL.revokeObjectURL(url);
}

Object.values(fields).forEach((field) => {
  field.addEventListener("input", calculate);
  field.addEventListener("change", calculate);
});

fields.species.addEventListener("change", updateCustomSpeciesField);

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!form.reportValidity()) return;

  if (editingRecordId) {
    const updatedRecord = buildRecord(editingRecordId);
    records = records.map((record) => (record.id === editingRecordId ? updatedRecord : record));
    editingRecordId = null;
    saveButton.textContent = "Salvar";
    cancelEditButton.hidden = true;
  } else {
    const record = buildRecord();
    records = [record, ...records];
  }

  persistRecords();
  renderRecords();
  clearMeasurementFields();
});

recordsList.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit]");
  if (editButton) {
    startEditing(editButton.dataset.edit);
    return;
  }

  const button = event.target.closest("[data-delete]");
  if (!button) return;

  records = records.filter((record) => record.id !== button.dataset.delete);
  if (editingRecordId === button.dataset.delete) {
    editingRecordId = null;
    saveButton.textContent = "Salvar";
    cancelEditButton.hidden = true;
  }
  persistRecords();
  renderRecords();
});

resetRecordsButton.addEventListener("click", () => {
  if (records.length === 0) return;
  const confirmed = confirm("Apagar todas as biometrias desta sessão?");
  if (!confirmed) return;

  records = [];
  stopEditing();
  persistRecords();
  renderRecords();
});

clearFormButton.addEventListener("click", clearForm);
cancelEditButton.addEventListener("click", () => {
  stopEditing();
  clearMeasurementFields();
});

generateReportButton.addEventListener("click", () => {
  if (records.length === 0) return;
  renderReport();
  reportDialog.showModal();
});

closeReportButton.addEventListener("click", () => reportDialog.close());
printReportButton.addEventListener("click", () => {
  document.title = "Relatorio Biometria Piscicultura";
  window.print();
});
exportCsvButton.addEventListener("click", exportCsv);

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  installAppButton.hidden = false;
});

installAppButton.addEventListener("click", async () => {
  if (!installPrompt) return;

  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  installAppButton.hidden = true;
});

window.addEventListener("appinstalled", () => {
  installPrompt = null;
  installAppButton.hidden = true;
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  });
}

calculate();
updateCustomSpeciesField();
renderRecords();
