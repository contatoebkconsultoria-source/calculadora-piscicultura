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
const sortOrderSelect = document.querySelector("#sortOrder");
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
const feedingHint = document.querySelector("#feedingHint");
const feedingHintGroup = document.querySelector("#feedingHintGroup");
const feedingHintPhase = document.querySelector("#feedingHintPhase");
const feedingHintStage = document.querySelector("#feedingHintStage");
const feedingHintRate = document.querySelector("#feedingHintRate");
const feedingHintMeals = document.querySelector("#feedingHintMeals");
const feedingHintProtein = document.querySelector("#feedingHintProtein");
const feedingHintNote = document.querySelector("#feedingHintNote");
const useSuggestedRateButton = document.querySelector("#useSuggestedRate");
const listedSpecies = Array.from(fields.species.options)
  .map((option) => option.value)
  .filter((value) => value && value !== "Outros");

const feedingGroups = {
  carnivores: {
    group: "Carnívoros",
    species: ["Pirarucu", "Pintado", "Dourado", "Traíra", "Tucunaré"],
    phases: [
      { min: 5, max: 15, phase: "5 a 15 g", stage: "alevino treinado", rate: "6% a 8%", meals: "4 a 6", protein: "45% a 50% PB", note: "Fase sensível; usar ração fina e observar canibalismo." },
      { min: 15, max: 100, phase: "15 a 100 g", stage: "alevinagem / recria inicial", rate: "5% a 7%", meals: "4 a 6", protein: "40% a 45% PB", note: "Boa fase para uniformização do lote." },
      { min: 100, max: 500, phase: "100 a 500 g", stage: "recria", rate: "4% a 5%", meals: "3 a 4", protein: "40% a 45% PB", note: "Ajustar com biometria e observar consumo." },
      { min: 500, max: 1000, phase: "500 g a 1 kg", stage: "recria final", rate: "3% a 4%", meals: "2 a 3", protein: "40% PB", note: "Evitar excesso, principalmente com OD baixo." },
      { min: 1000, max: 5000, phase: "1 a 5 kg", stage: "engorda", rate: "2% a 3%", meals: "2", protein: "36% a 40% PB", note: "Faixa prática para engorda." },
      { min: 5000, max: Infinity, phase: "Acima de 5 kg", stage: "terminação", rate: "1% a 2%", meals: "1 a 2", protein: "36% a 40% PB", note: "Trabalhar mais próximo de 1% em peixe grande." },
    ],
  },
  roundFish: {
    group: "Onívoros - peixes redondos",
    species: ["Tambaqui", "Tambatinga", "Pacu"],
    phases: [
      { min: 0.5, max: 7, phase: "0,5 a 7 g", stage: "alevinagem", rate: "20% a 10%", meals: "6", protein: "55% PB", note: "Ração farelada/pó; fase de alto consumo." },
      { min: 7, max: 25, phase: "7 a 25 g", stage: "recria I", rate: "7,7% a 6,4%", meals: "4", protein: "40% PB", note: "Usar ração 1-2 mm." },
      { min: 25, max: 70, phase: "25 a 70 g", stage: "recria II", rate: "5,9% a 4,6%", meals: "4", protein: "40% PB", note: "Fase comum de ajuste inicial em viveiro." },
      { min: 70, max: 188, phase: "70 a 188 g", stage: "recria III", rate: "4,2% a 2,7%", meals: "4", protein: "32% PB", note: "Começar a reduzir a taxa." },
      { min: 188, max: 298, phase: "188 a 298 g", stage: "recria IV", rate: "2,6% a 2,2%", meals: "4", protein: "28% PB", note: "Evitar excesso de ração." },
      { min: 298, max: 530, phase: "298 a 530 g", stage: "engorda I", rate: "2,1% a 1,8%", meals: "3", protein: "28% PB", note: "Boa faixa para viveiro escavado." },
      { min: 530, max: 1000, phase: "530 g a 1 kg", stage: "engorda II", rate: "1,7% a 1,2%", meals: "2", protein: "28% PB", note: "Em água quente, usar limite inferior." },
      { min: 1000, max: 2500, phase: "1 a 2,5 kg", stage: "engorda III / terminação", rate: "1,0% a 0,8%", meals: "2", protein: "28% PB", note: "Para peixe grande, 1% ou menos costuma ser mais seguro." },
    ],
  },
  tilapia: {
    group: "Onívoros - tilápia",
    species: ["Tilapia"],
    phases: [
      { min: 1, max: 5, phase: "1 a 5 g", stage: "alevinagem inicial", rate: "14%", meals: "5", protein: "42% PB", note: "Ração em pó." },
      { min: 5, max: 10, phase: "5 a 10 g", stage: "alevinagem", rate: "8%", meals: "4", protein: "42% PB", note: "Ração 2-3 mm." },
      { min: 10, max: 20, phase: "10 a 20 g", stage: "alevinagem / recria inicial", rate: "5%", meals: "3", protein: "42% PB", note: "Boa fase para crescimento rápido." },
      { min: 20, max: 50, phase: "20 a 50 g", stage: "recria", rate: "4,5%", meals: "3", protein: "42% PB", note: "Ajustar pela biometria." },
      { min: 50, max: 150, phase: "50 a 150 g", stage: "recria", rate: "3,4%", meals: "3", protein: "36% PB", note: "Ração 3-4 mm." },
      { min: 150, max: 250, phase: "150 a 250 g", stage: "recria final", rate: "3%", meals: "3", protein: "32% PB", note: "Ração 4-6 mm." },
      { min: 250, max: 400, phase: "250 a 400 g", stage: "engorda", rate: "2,2%", meals: "2", protein: "28% a 32% PB", note: "Faixa comum de engorda." },
      { min: 400, max: 600, phase: "400 a 600 g", stage: "engorda", rate: "1,4%", meals: "2", protein: "28% a 32% PB", note: "Reduzir se houver sobra." },
      { min: 600, max: 800, phase: "600 a 800 g", stage: "terminação", rate: "1%", meals: "2", protein: "28% a 32% PB", note: "Usar com água bem oxigenada." },
      { min: 800, max: 1300, phase: "800 g a 1,3 kg", stage: "terminação", rate: "0,8%", meals: "2", protein: "28% a 32% PB", note: "Para peixe grande." },
      { min: 1300, max: 1800, phase: "1,3 a 1,8 kg", stage: "terminação avançada", rate: "0,6%", meals: "2", protein: "28% a 32% PB", note: "Usar somente se houver mercado para peixe grande." },
    ],
  },
  otherOmnivores: {
    group: "Onívoros - outros",
    species: ["Matrinxa", "Panga", "Piau"],
    phases: [
      { min: 1, max: 10, phase: "1 a 10 g", stage: "alevinagem inicial", rate: "10% a 12%", meals: "5 a 6", protein: "40% a 45% PB", note: "Usar ração fina; fase de alto metabolismo." },
      { min: 10, max: 25, phase: "10 a 25 g", stage: "alevinagem", rate: "7% a 8%", meals: "4 a 5", protein: "36% a 40% PB", note: "Ajustar pela resposta de consumo." },
      { min: 25, max: 70, phase: "25 a 70 g", stage: "recria inicial", rate: "5% a 6%", meals: "4", protein: "36% a 40% PB", note: "Faixa segura para juvenis." },
      { min: 70, max: 200, phase: "70 a 200 g", stage: "recria", rate: "3% a 4,5%", meals: "3 a 4", protein: "32% a 36% PB", note: "Reduzir conforme crescimento." },
      { min: 200, max: 500, phase: "200 a 500 g", stage: "recria final", rate: "2% a 3%", meals: "3", protein: "30% a 32% PB", note: "Manejo parecido com onívoros de médio porte." },
      { min: 500, max: 1000, phase: "500 g a 1 kg", stage: "engorda", rate: "1,5% a 2%", meals: "2", protein: "28% a 32% PB", note: "Usar limite inferior se houver sobra." },
      { min: 1000, max: 2000, phase: "1 a 2 kg", stage: "engorda / terminação", rate: "1% a 1,5%", meals: "2", protein: "28% a 30% PB", note: "Para peixe maior, evitar superalimentação." },
      { min: 2000, max: Infinity, phase: "Acima de 2 kg", stage: "terminação", rate: "0,8% a 1%", meals: "1 a 2", protein: "28% PB", note: "Uso mais conservador." },
    ],
  },
  detritivores: {
    group: "Detritívoros / iliófagos / peixes de fundo",
    species: ["Curimata", "Bodo", "Cascudo", "Branquinha"],
    phases: [
      { min: 0.5, max: 4, phase: "0,5 a 4 g", stage: "berçário / alevino inicial", rate: "9% a 10%", meals: "4", protein: "45% a 50% PB", note: "Usar ração fina; manter viveiro bem preparado." },
      { min: 4, max: 40, phase: "4 a 40 g", stage: "alevinagem", rate: "6% a 8%", meals: "4", protein: "40% a 45% PB", note: "Boa oferta de alimento natural ajuda muito." },
      { min: 40, max: 100, phase: "40 a 100 g", stage: "recria inicial", rate: "5% a 6%", meals: "3 a 4", protein: "36% a 40% PB", note: "Para bodó/cascudo, usar o limite inferior." },
      { min: 100, max: 200, phase: "100 a 200 g", stage: "recria", rate: "3% a 5%", meals: "3", protein: "32% a 36% PB", note: "Evitar excesso no fundo." },
      { min: 200, max: 750, phase: "200 a 750 g", stage: "crescimento / engorda", rate: "1,5% a 2,5%", meals: "2 a 3", protein: "28% a 32% PB", note: "Em policultivo, pode usar menor taxa." },
      { min: 750, max: Infinity, phase: "Acima de 750 g", stage: "engorda / terminação", rate: "0,8% a 1,5%", meals: "1 a 2", protein: "28% a 32% PB", note: "Ração apenas suplementar; priorizar alimento natural." },
    ],
  },
};

let records = loadRecords();
let installPrompt = null;
let editingRecordId = null;
let sortOrder = localStorage.getItem("calculadora-piscicultura-ordem") || "created";
let currentSuggestedRate = null;

fields.date.value = todayValue();
sortOrderSelect.value = sortOrder;

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
  updateFeedingHint(averageWeight);

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

function getFeedingGroup(species) {
  return Object.values(feedingGroups).find((group) => group.species.includes(species));
}

function getFeedingPhase(group, averageWeightKg) {
  const averageWeightGrams = averageWeightKg * 1000;
  if (!averageWeightGrams) return null;

  return (
    group.phases.find((phase) => averageWeightGrams >= phase.min && averageWeightGrams <= phase.max) ||
    (averageWeightGrams < group.phases[0].min ? group.phases[0] : group.phases[group.phases.length - 1])
  );
}

function parseRateValues(rate) {
  const values = String(rate).match(/\d+(?:[,.]\d+)?/g) || [];
  return values.map((value) => Number(value.replace(",", "."))).filter((value) => Number.isFinite(value));
}

function suggestedRateFromPhase(phase, averageWeightKg) {
  const rates = parseRateValues(phase.rate);
  if (rates.length === 0) return null;
  if (rates.length === 1) return rates[0];

  const averageWeightGrams = averageWeightKg * 1000;
  if (!Number.isFinite(phase.max) || phase.max <= phase.min || !averageWeightGrams) {
    return rates[0];
  }

  const progress = Math.min(1, Math.max(0, (averageWeightGrams - phase.min) / (phase.max - phase.min)));
  return rates[0] + (rates[1] - rates[0]) * progress;
}

function formatRateInputValue(value) {
  return Number(value.toFixed(2)).toString();
}

function setSuggestedRate(rate) {
  currentSuggestedRate = rate;
  const hasRate = Number.isFinite(rate);
  useSuggestedRateButton.hidden = !hasRate;
  useSuggestedRateButton.disabled = !hasRate;

  if (hasRate) {
    useSuggestedRateButton.textContent = `Usar taxa sugerida: ${formatNumber(rate, 2)}%`;
  } else {
    useSuggestedRateButton.textContent = "Usar taxa sugerida";
  }
}

function updateFeedingHint(averageWeightKg = calculate().averageWeight) {
  const species = selectedSpeciesName();

  if (!species || fields.species.value === "Outros") {
    feedingHint.hidden = true;
    setSuggestedRate(null);
    return;
  }

  feedingHint.hidden = false;
  const group = getFeedingGroup(species);

  if (!group) {
    feedingHintGroup.textContent = "Referência não cadastrada";
    feedingHintPhase.textContent = "-";
    feedingHintStage.textContent = "-";
    feedingHintRate.textContent = "-";
    feedingHintMeals.textContent = "-";
    feedingHintProtein.textContent = "-";
    feedingHintNote.textContent = "Não há tabela específica para esta espécie nesta referência. Ajuste a taxa conforme manejo local e orientação técnica.";
    setSuggestedRate(null);
    return;
  }

  feedingHintGroup.textContent = group.group;
  const phase = getFeedingPhase(group, averageWeightKg);

  if (!phase) {
    feedingHintPhase.textContent = "Informe o peso médio";
    feedingHintStage.textContent = "-";
    feedingHintRate.textContent = "-";
    feedingHintMeals.textContent = "-";
    feedingHintProtein.textContent = "-";
    feedingHintNote.textContent = "Preencha amostragem e peso total para sugerir a fase conforme o peso médio calculado.";
    setSuggestedRate(null);
    return;
  }

  feedingHintPhase.textContent = phase.phase;
  feedingHintStage.textContent = phase.stage;
  feedingHintRate.textContent = phase.rate;
  feedingHintMeals.textContent = phase.meals;
  feedingHintProtein.textContent = phase.protein;
  feedingHintNote.textContent = `Peso médio atual: ${formatNumber(averageWeightKg * 1000, 1)} g. ${phase.note}`;
  setSuggestedRate(suggestedRateFromPhase(phase, averageWeightKg));
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

function tankNumber(record) {
  const match = String(record.tank || "").match(/\d+(?:[,.]\d+)?/);
  if (!match) return Number.POSITIVE_INFINITY;
  return Number(match[0].replace(",", "."));
}

function compareTankRecords(a, b, direction) {
  const numberA = tankNumber(a);
  const numberB = tankNumber(b);
  const hasNumberA = Number.isFinite(numberA);
  const hasNumberB = Number.isFinite(numberB);

  if (!hasNumberA && hasNumberB) return 1;
  if (hasNumberA && !hasNumberB) return -1;

  if (numberA !== numberB) {
    return direction === "asc" ? numberA - numberB : numberB - numberA;
  }

  return String(a.tank || "").localeCompare(String(b.tank || ""), "pt-BR", {
    numeric: true,
    sensitivity: "base",
  });
}

function getSortedRecords() {
  const sortedRecords = [...records];

  if (sortOrder === "tank-asc") {
    sortedRecords.sort((a, b) => compareTankRecords(a, b, "asc"));
  }

  if (sortOrder === "tank-desc") {
    sortedRecords.sort((a, b) => compareTankRecords(a, b, "desc"));
  }

  return sortedRecords;
}

function renderRecords() {
  savedCount.textContent = records.length;
  generateReportButton.disabled = records.length === 0;

  if (records.length === 0) {
    recordsList.innerHTML = '<div class="empty-state">Nenhuma biometria salva.</div>';
    return;
  }

  recordsList.innerHTML = getSortedRecords()
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
  const sortedRecords = getSortedRecords();
  const firstRecord = sortedRecords[0];

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
          ${sortedRecords
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

  const rows = getSortedRecords().map((record) => [
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

function cleanPdfText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function escapePdfText(value) {
  return cleanPdfText(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function shortenPdfText(value, maxLength) {
  const text = cleanPdfText(value);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 1))}.`;
}

function pdfText(ops, text, x, y, size = 9, font = "F1", color = "0 0 0") {
  ops.push(`BT /${font} ${size} Tf ${color} rg ${x} ${y} Td (${escapePdfText(text)}) Tj ET`);
}

function pdfRect(ops, x, y, width, height, color) {
  ops.push(`q ${color} rg ${x} ${y} ${width} ${height} re f Q`);
}

function pdfLine(ops, x1, y1, x2, y2, color = "0.82 0.86 0.90", width = 0.6) {
  ops.push(`q ${color} RG ${width} w ${x1} ${y1} m ${x2} ${y2} l S Q`);
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function buildPdf(pageStreams) {
  const objects = [];
  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";
  objects[4] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>";

  let nextObject = 5;
  const pageRefs = [];

  pageStreams.forEach((stream) => {
    const contentObject = nextObject++;
    const pageObject = nextObject++;

    objects[contentObject] = `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`;
    objects[pageObject] =
      `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 841.89 595.28] ` +
      `/Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${contentObject} 0 R >>`;
    pageRefs.push(`${pageObject} 0 R`);
  });

  objects[2] = `<< /Type /Pages /Count ${pageRefs.length} /Kids [${pageRefs.join(" ")}] >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  for (let index = 1; index < objects.length; index += 1) {
    offsets[index] = pdf.length;
    pdf += `${index} 0 obj\n${objects[index]}\nendobj\n`;
  }

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length}\n`;
  pdf += "0000000000 65535 f \n";

  for (let index = 1; index < objects.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return pdf;
}

function addPdfPageHeader(ops, pageNumber) {
  pdfRect(ops, 0, 540, 841.89, 55, "0.06 0.16 0.33");
  pdfText(ops, "Calculadora Piscicultura", 34, 570, 18, "F2", "1 1 1");
  pdfText(ops, "Relatorio de Biometria", 34, 552, 10, "F1", "0.82 0.90 1");
  pdfText(ops, `Pagina ${pageNumber}`, 765, 552, 9, "F1", "0.82 0.90 1");
  pdfText(ops, "Desenvolvido por ebkconsultoria", 324, 306, 18, "F2", "0.90 0.93 0.97");
  pdfText(ops, "Desenvolvido por ebkconsultoria", 34, 24, 8, "F1", "0.45 0.52 0.62");
}

function addPdfTableHeader(ops, y, columns) {
  pdfRect(ops, 34, y - 5, 774, 22, "0.93 0.96 0.98");
  let x = 38;
  columns.forEach((column) => {
    pdfText(ops, column.label, x, y + 2, 7.5, "F2", "0.18 0.27 0.40");
    x += column.width;
  });
  pdfLine(ops, 34, y - 7, 808, y - 7, "0.70 0.76 0.84", 0.8);
}

function generatePdfReport() {
  if (records.length === 0) return;

  const summary = getSummary();
  const sortedRecords = getSortedRecords();
  const firstRecord = sortedRecords[0];
  const columns = [
    { label: "Tanque", width: 92, value: (record) => shortenPdfText(record.tank, 16) },
    { label: "Especie", width: 100, value: (record) => shortenPdfText(record.species, 17) },
    { label: "Peixes", width: 68, value: (record) => formatNumber(record.fishTotal, 0) },
    { label: "Amostra", width: 64, value: (record) => formatNumber(record.sampleCount, 0) },
    { label: "Peso am.", width: 90, value: (record) => `${formatNumber(record.sampleWeight)} kg` },
    { label: "Peso medio", width: 88, value: (record) => `${formatNumber(record.averageWeight, 3)} kg` },
    { label: "Biomassa", width: 88, value: (record) => `${formatNumber(record.biomass)} kg` },
    { label: "Taxa", width: 58, value: (record) => `${formatNumber(record.feedRate)}%` },
    { label: "Racao/dia", width: 82, value: (record) => `${formatNumber(record.dailyFeed)} kg` },
  ];

  const pageStreams = [];
  let ops = [];
  let pageNumber = 1;
  let y = 0;

  function startPage() {
    ops = [];
    pageStreams.push(ops);
    addPdfPageHeader(ops, pageNumber);
    y = 510;
    pageNumber += 1;
  }

  startPage();

  pdfText(ops, "Dados gerais", 34, y, 12, "F2", "0.06 0.16 0.33");
  y -= 20;

  const summaryCards = [
    ["Propriedade", firstRecord.property],
    ["Data", formatDate(firstRecord.date)],
    ["Tanques", summary.tanks],
    ["Peixes", formatNumber(summary.totalFish, 0)],
    ["Peso medio geral", `${formatNumber(summary.weightedAverage, 3)} kg`],
    ["Biomassa total", `${formatNumber(summary.totalBiomass)} kg`],
    ["Racao total/dia", `${formatNumber(summary.totalFeed)} kg`],
    ["Especies", new Set(records.map((record) => record.species)).size],
  ];

  summaryCards.forEach(([label, value], index) => {
    const column = index % 4;
    const row = Math.floor(index / 4);
    const x = 34 + column * 194;
    const cardY = y - row * 58;

    pdfRect(ops, x, cardY - 36, 178, 46, "0.96 0.98 1");
    pdfLine(ops, x, cardY - 36, x + 178, cardY - 36, "0.78 0.84 0.90", 0.5);
    pdfText(ops, label.toUpperCase(), x + 10, cardY - 5, 7, "F2", "0.45 0.52 0.62");
    pdfText(ops, shortenPdfText(value, 28), x + 10, cardY - 24, 11, "F2", "0 0 0");
  });

  y -= 132;
  pdfText(ops, "Biometrias por tanque", 34, y, 12, "F2", "0.06 0.16 0.33");
  y -= 28;
  addPdfTableHeader(ops, y, columns);
  y -= 22;

  sortedRecords.forEach((record, index) => {
    if (y < 58) {
      startPage();
      pdfText(ops, "Biometrias por tanque", 34, y, 12, "F2", "0.06 0.16 0.33");
      y -= 28;
      addPdfTableHeader(ops, y, columns);
      y -= 22;
    }

    if (index % 2 === 0) {
      pdfRect(ops, 34, y - 7, 774, 20, "0.99 0.99 1");
    }

    let x = 38;
    columns.forEach((column) => {
      pdfText(ops, column.value(record), x, y, 7.5, "F1", "0.05 0.08 0.12");
      x += column.width;
    });

    pdfLine(ops, 34, y - 10, 808, y - 10, "0.88 0.91 0.94", 0.4);
    y -= 22;
  });

  y -= 10;
  if (y < 70) startPage();
  pdfText(ops, "Observacao", 34, y, 10, "F2", "0.06 0.16 0.33");
  pdfText(
    ops,
    "Relatorio gerado automaticamente com base nas biometrias salvas no aplicativo. Desenvolvido por ebkconsultoria.",
    34,
    y - 17,
    8,
    "F1",
    "0.36 0.42 0.50"
  );

  const pdf = buildPdf(pageStreams.map((streamOps) => streamOps.join("\n")));
  const blob = new Blob([pdf], { type: "application/pdf" });
  const fileDate = firstRecord.date || todayValue();
  downloadBlob(blob, `relatorio-biometria-${fileDate}.pdf`);
}

Object.values(fields).forEach((field) => {
  field.addEventListener("input", calculate);
  field.addEventListener("change", calculate);
});

fields.species.addEventListener("change", updateCustomSpeciesField);

useSuggestedRateButton.addEventListener("click", () => {
  if (!Number.isFinite(currentSuggestedRate)) return;
  fields.feedRate.value = formatRateInputValue(currentSuggestedRate);
  calculate();
  fields.feedRate.focus();
});

sortOrderSelect.addEventListener("change", () => {
  sortOrder = sortOrderSelect.value;
  localStorage.setItem("calculadora-piscicultura-ordem", sortOrder);
  renderRecords();
});

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
printReportButton.addEventListener("click", generatePdfReport);
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
