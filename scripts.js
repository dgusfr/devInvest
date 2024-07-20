function formatCurrency(input) {
  let value = input.value.replace(/\D/g, "");
  value = (value / 100).toFixed(2) + "";
  value = value.replace(".", ",");
  value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  input.value = value;
}

function togglePeriodInput() {
  const rateType = document.querySelector('input[name="rate-type"]:checked').value;
  const investmentType = document.querySelector('input[name="investment-type"]:checked').value;
  const periodGroup = document.getElementById('period-group');
  const cdiMessage = document.getElementById('cdi-message');

  if (rateType === 'pos' && investmentType === 'cdb') {
      periodGroup.style.display = 'none';
      cdiMessage.style.display = 'block';
  } else {
      periodGroup.style.display = 'block';
      cdiMessage.style.display = 'none';
  }
}

function calculateInvestment() {
  const P = parseFloat(document.getElementById('initial-investment').value.replace(/\./g, '').replace(',', '.'));
  const C = parseFloat(document.getElementById('monthly-investment').value.replace(/\./g, '').replace(',', '.'));
  let n = parseInt(document.getElementById('period').value);
  const rateAnnual = parseFloat(document.getElementById('rate').value) / 100;
  const investmentType = document.querySelector('input[name="investment-type"]:checked').value;
  const rateType = document.querySelector('input[name="rate-type"]:checked').value;
  const periodType = document.getElementById('period-type').value;
  const rateUnit = document.getElementById('rate-type-select').value;

  if (rateType !== 'pos' || investmentType !== 'cdb') {
      if (periodType === 'years') {
          n = n * 12;
      }
  } else {
      n = 24; // Para CDB pós-fixado, usamos 2 anos fixos
  }

  let r = rateUnit === 'annual' ? rateAnnual / 12 : rateAnnual;
  let M = 0;

  if (rateType === 'pre') {
      M = P * Math.pow(1 + r, n) + C * ((Math.pow(1 + r, n) - 1) / r);
  } else if (rateType === 'pos') {
      const cdiRate = 10.4 / 100 / 12;
      M = P * Math.pow(1 + cdiRate, n) + C * ((Math.pow(1 + cdiRate, n) - 1) / cdiRate);
  } else if (rateType === 'ipca') {
      const i = 0.04 / 12; // Supondo uma inflação anual de 4%
      M = P * Math.pow(1 + r + i, n) + C * ((Math.pow(1 + r + i, n) - 1) / (r + i));
  }

  document.getElementById('result').innerHTML = `Valor acumulado: R$ ${M.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+\,)/g, "$1.")}`;
}

function resetForm() {
  document.getElementById('cdi-message').style.display = 'none';
  document.getElementById('period-group').style.display = 'block';
}
