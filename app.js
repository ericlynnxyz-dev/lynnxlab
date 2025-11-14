// app.js
// JavaScript for Myanmar Gold Calculator
// Handles toggles, conversions, pricing, and UI updates.

document.addEventListener('DOMContentLoaded', () => {
  // Conversion constants
  const KYAT_TO_PAE = 16;
  const PAE_TO_YWAY = 8;
  const KYAT_TO_YWAY = 128;
  const KYAT_TO_GRAM = 16.329; // as requested

  // Elements: gold weight
  const chkKPY = document.getElementById('chkKPY');
  const chkGrams = document.getElementById('chkGrams');

  const kyatInput = document.getElementById('kyat');
  const paeInput = document.getElementById('pae');
  const ywayInput = document.getElementById('yway');
  const gramsInput = document.getElementById('grams');

  // Waste weight
  const chkWaste = document.getElementById('chkWaste');
  const wasteKyatInput = document.getElementById('wasteKyat');
  const wastePaeInput = document.getElementById('wastePae');
  const wasteYwayInput = document.getElementById('wasteYway');

  // Price/purity/crafting fee
  const kyatPriceInput = document.getElementById('kyatPrice');
  const puritySelect = document.getElementById('purity');
  const craftingFeeInput = document.getElementById('craftingFee');

  const calculateBtn = document.getElementById('calculateBtn');
  const resultsSection = document.getElementById('results');
  const resultMain = document.getElementById('resultMain');
  const breakdownEl = document.getElementById('breakdown');
  const formEl = document.getElementById('calcForm');

  // Helper: set input enabled/disabled state and data-enabled attr for styling
  function setInputState(inputEl, enabled) {
    inputEl.disabled = !enabled;
    inputEl.setAttribute('data-enabled', enabled ? 'true' : 'false');
    const row = inputEl.closest('.group-row');
    if (row) {
      if (!enabled) row.classList.add('disabled');
      else row.classList.remove('disabled');
    }
  }

  // Toggle group: KPY (gold)
  function toggleKPYGroup() {
    const enabled = chkKPY.checked;
    setInputState(kyatInput, enabled);
    setInputState(paeInput, enabled);
    setInputState(ywayInput, enabled);
  }

  // Toggle grams
  function toggleGrams() {
    const enabled = chkGrams.checked;
    setInputState(gramsInput, enabled);
  }

  // Toggle waste group
  function toggleWasteGroup() {
    const enabled = chkWaste.checked;
    setInputState(wasteKyatInput, enabled);
    setInputState(wastePaeInput, enabled);
    setInputState(wasteYwayInput, enabled);
  }

  // Initialize states
  toggleKPYGroup();
  toggleGrams();
  toggleWasteGroup();

  // Attach listeners
  chkKPY.addEventListener('change', toggleKPYGroup);
  chkGrams.addEventListener('change', toggleGrams);
  chkWaste.addEventListener('change', toggleWasteGroup);

  function calculateGold() {
    // Require at least one section included (gold KPY/grams or waste)
    if (!chkKPY.checked && !chkGrams.checked && !chkWaste.checked) {
      resultsSection.style.display = 'block';
      resultMain.innerHTML = '<strong>Please check at least one input group to include in the calculation. (ကျယ်/ပဲ/ရွေး/ဂရမ်/ပျက်စီး ထဲမှ အနည်းဆုံး တစ်ခုကို ရွေးပါ)</strong>';
      breakdownEl.innerHTML = '';
      return;
    }

    // Gold KPY values (only if checked)
    const kyatVal = chkKPY.checked ? (parseFloat(kyatInput.value) || 0) : 0;
    const paeVal = chkKPY.checked ? (parseFloat(paeInput.value) || 0) : 0;
    const ywayVal = chkKPY.checked ? (parseFloat(ywayInput.value) || 0) : 0;
    const gramsVal = chkGrams.checked ? (parseFloat(gramsInput.value) || 0) : 0;

    // Waste KPY values
    const wasteKyatVal = chkWaste.checked ? (parseFloat(wasteKyatInput.value) || 0) : 0;
    const wastePaeVal = chkWaste.checked ? (parseFloat(wastePaeInput.value) || 0) : 0;
    const wasteYwayVal = chkWaste.checked ? (parseFloat(wasteYwayInput.value) || 0) : 0;

    // Convert Gold K/P/Y to Kyat
    let goldKyatTotal = 0;
    if (chkKPY.checked) {
      goldKyatTotal += kyatVal;
      goldKyatTotal += (paeVal / KYAT_TO_PAE);
      goldKyatTotal += (ywayVal / KYAT_TO_YWAY);
    }
    if (chkGrams.checked) {
      goldKyatTotal += (gramsVal / KYAT_TO_GRAM);
    }
    goldKyatTotal = parseFloat(goldKyatTotal.toFixed(8));

    // Convert Waste K/P/Y to Kyat
    let wasteKyatTotal = 0;
    if (chkWaste.checked) {
      wasteKyatTotal += wasteKyatVal;
      wasteKyatTotal += (wastePaeVal / KYAT_TO_PAE);
      wasteKyatTotal += (wasteYwayVal / KYAT_TO_YWAY);
    }
    wasteKyatTotal = parseFloat(wasteKyatTotal.toFixed(8));

    // Combined total Kyat (gold + waste)
    const totalKyat = parseFloat((goldKyatTotal + wasteKyatTotal).toFixed(8));

    // Representations
    const totalYway = Math.round(totalKyat * KYAT_TO_YWAY);
    const totalGram = totalKyat * KYAT_TO_GRAM;

    // Pricing logic using entered 16K base price
    const kyatPrice = parseFloat(kyatPriceInput.value) || 0;
    const purity = puritySelect.value;
    let pricePerKyat = kyatPrice;

    switch (purity) {
      case '15K':
        pricePerKyat = (kyatPrice / 17) * 16;
        break;
      case '14.5K':
        pricePerKyat = (128 * kyatPrice) / 140;
        break;
      case '14K':
        pricePerKyat = (16 * kyatPrice) / 18;
        break;
      case '12K':
        pricePerKyat = kyatPrice * 0.75;
        break;
      case '16K':
      default:
        pricePerKyat = kyatPrice;
        break;
    }

    // Crafting fee (whole number Ks) added to total monetary value
    const craftingFee = Math.max(0, Math.floor(parseFloat(craftingFeeInput.value) || 0));

    const totalValueBeforeFee = totalKyat * pricePerKyat;
    const totalValue = totalValueBeforeFee + craftingFee;

    // Formatting
    const formattedKyat = totalKyat.toFixed(2);
    const formattedGram = totalGram.toFixed(2);
    const formattedValue = totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const formattedPricePerKyat = pricePerKyat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    // Render results
    resultsSection.style.display = 'block';
    resultMain.innerHTML = `
      <div>
        <strong>စုစုပေါင်း အလေးချိန် — Total Weight</strong><br />
        • Kyat: <span style="color:#b07d12; font-weight:700">${formattedKyat}</span> / ကျပ် (2 decimals)<br />
        • Yway: <span style="color:#b07d12; font-weight:700">${totalYway}</span> / ရွေး (whole number)<br />
        • Grams: <span style="color:#b07d12; font-weight:700">${formattedGram}</span> g / ဂရမ် (2 decimals)<br /><br />
        <strong>စုစုပေါင်း ရွှေတန်ဖိုး — Total Gold Value (Purity: ${purity})</strong><br />
        • Price per Kyat (based on purity): <span style="color:#a05e07; font-weight:700">${formattedPricePerKyat}</span> Ks / ကျယ်<br />
        • Total value before crafting fee: <span style="color:#a05e07; font-weight:700">${totalValueBeforeFee.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span> Ks<br />
        • Crafting fee: <span style="color:#a05e07; font-weight:700">${craftingFee.toLocaleString()}</span> Ks<br />
        • Grand total value (including crafting fee): <span style="color:#a05e07;font-size:1.05em;font-weight:800">${formattedValue}</span> Ks
      </div>
    `;

    // Breakdown: show included inputs and waste separately
    let breakdownHtml = '<strong>Inputs included in calculation / ထည့်သွင်းချက်များ</strong><br />';
    breakdownHtml += '<em>Gold Weight</em><br />';
    if (chkKPY.checked) {
      breakdownHtml += `- Kyat: ${kyatVal} / ကျယ်<br />- Pae: ${paeVal} / ပဲ<br />- Yway: ${ywayVal} / ရွေး<br />`;
    } else breakdownHtml += '- Kyat/Pae/Yway (gold) not included<br />';
    if (chkGrams.checked) breakdownHtml += `- Grams: ${gramsVal} g / ဂရမ်<br />`; else breakdownHtml += '- Grams (gold) not included<br />';

    breakdownHtml += `<br /><em>Waste Weight</em><br />`;
    if (chkWaste.checked) {
      breakdownHtml += `- Kyat: ${wasteKyatVal} / ကျယ်<br />- Pae: ${wastePaeVal} / ပဲ<br />- Yway: ${wasteYwayVal} / ရွေး<br />`;
    } else {
      breakdownHtml += '- Waste weight not included<br />';
    }

    breakdownHtml += `<br />Converted totals:<br />- Gold Kyat total: ${goldKyatTotal.toFixed(6)} Kyat<br />- Waste Kyat total: ${wasteKyatTotal.toFixed(6)} Kyat<br />- Combined Kyat used for pricing: ${totalKyat.toFixed(6)} Kyat<br />`;
    breakdownHtml += `<br />Entered 16K price per Kyat: ${kyatPrice || 0} Ks / ကျယ်စျေး<br />Crafting fee added: ${craftingFee} Ks<br />Conversion used: 1 Kyat = ${KYAT_TO_PAE} Pae = ${KYAT_TO_YWAY} Yway; 1 Kyat ≈ ${KYAT_TO_GRAM} g`;

    breakdownEl.innerHTML = breakdownHtml;
  }

  // Event listeners
  calculateBtn.addEventListener('click', calculateGold);

  // Enter triggers calculation in the form
  formEl.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      calculateGold();
    }
  });
});