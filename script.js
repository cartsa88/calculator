const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");

// Muuttaa käyttöliittymän luvun (pilkku) JS-luvuksi (piste)
function uiToJsNumber(str) {
  if (!str) return NaN;
  return parseFloat(str.replace(",", "."));
}

// Muuttaa JS-luvun (piste) käyttöliittymämuotoon (pilkku)
function jsNumberToUi(num) {
  return String(num).replace(".", ",");
}


let expression = "";

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = btn.dataset.value;
    const action = btn.dataset.action;

    if (action === "clear") {
      clearDisplay();
    } else if (action === "backspace") {
      backspace();
    } else if (action === "equals") {
      calculate();
    } else if (action === "sqrt") {
      applySqrt();
    } else if (action === "square") {
      applySquare();
    } else if (action === "inv") {
      applyInverse();
    } else if (action === "sign") {
      toggleSign();
    } else if (value) {
      appendValue(value);
    }
  });
});

function updateDisplay(value) {
  display.value = value;
}

function appendValue(val) {
  expression += val;
  updateDisplay(expression);
}

function clearDisplay() {
  expression = "";
  updateDisplay("");
}

function backspace() {
  expression = expression.slice(0, -1);
  updateDisplay(expression);
}

function calculate() {
  if (!expression) return;
  try {
    // 1. korvaa visuaaliset merkit
    let exprForEval = expression.replace(/÷/g, "/").replace(/×/g, "*");

    // 2. vaihdetaan kaikki pilkut pisteiksi JS:ää varten
    exprForEval = exprForEval.replace(/,/g, ".");

    // 3. prosentit: 9% -> (9/100), 12,5% -> (12.5/100)
    exprForEval = exprForEval.replace(/(\d+(\.\d+)?)%/g, "($1/100)");

    // 4. lasketaan
    const result = eval(exprForEval);

    // Näytölle jää käyttöliittymämuoto (pilkut):
    const resultUi = jsNumberToUi(result);
    updateDisplay(expression + "=" + resultUi);

    // Seuraava lasku jatkuu tuloksesta (pilkulla)
    expression = resultUi;
  } catch (e) {
    updateDisplay("Virhe");
    expression = "";
  }
}



// ——— LISÄTOIMINNOT ———

// √x
function applySqrt() {
  const currentUi = expression || display.value;
  const num = uiToJsNumber(currentUi);
  if (isNaN(num) || num < 0) {
    updateDisplay("Virhe");
    expression = "";
    return;
  }
  const result = Math.sqrt(num);
  const resultUi = jsNumberToUi(result);
  updateDisplay(`√(${currentUi})=${resultUi}`);
  expression = resultUi;
}

// x²
function applySquare() {
  const currentUi = expression || display.value;
  const num = uiToJsNumber(currentUi);
  if (isNaN(num)) return;
  const result = Math.pow(num, 2);
  const resultUi = jsNumberToUi(result);
  updateDisplay(`${currentUi}²=${resultUi}`);
  expression = resultUi;
}

// 1/x
function applyInverse() {
  const currentUi = expression || display.value;
  const num = uiToJsNumber(currentUi);
  if (isNaN(num) || num === 0) {
    updateDisplay("Virhe");
    expression = "";
    return;
  }
  const result = 1 / num;
  const resultUi = jsNumberToUi(result);
  updateDisplay(`1/${currentUi}=${resultUi}`);
  expression = resultUi;
}

// ±
function toggleSign() {
  const currentUi = expression || display.value || "0";
  const num = uiToJsNumber(currentUi);
  if (isNaN(num)) return;
  const result = num * -1;
  const resultUi = jsNumberToUi(result);
  expression = resultUi;
  updateDisplay(resultUi);
}
