const display = document.getElementById("display");
const buttons = document.querySelectorAll(".btn");

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
    // 1. korvataan visuaaliset merkit oikeiksi operaattoreiksi
    let exprForEval = expression.replace(/÷/g, "/").replace(/×/g, "*");

    // 2. muutetaan prosentit: 9% -> (9/100), 12.5% -> (12.5/100)
    exprForEval = exprForEval.replace(/(\d+(\.\d+)?)%/g, "($1/100)");

    // 3. lasketaan tulos
    const result = eval(exprForEval);

    // Näytölle näkyviin alkuperäinen lauseke + tulos
    updateDisplay(expression + "=" + result);
    expression = String(result);
  } catch (e) {
    updateDisplay("Virhe");
    expression = "";
  }
}


// ——— LISÄTOIMINNOT ———

// Neliöjuuri: √x
function applySqrt() {
  const current = display.value || expression;
  if (!current) return;

  const num = parseFloat(current);
  if (isNaN(num) || num < 0) {
    updateDisplay("Virhe");
    expression = "";
    return;
  }
  const result = Math.sqrt(num);
  updateDisplay("√(" + num + ")=" + result);
  expression = String(result);
}

// x²
function applySquare() {
  const current = display.value || expression;
  const num = parseFloat(current);
  if (isNaN(num)) return;
  const result = Math.pow(num, 2);
  updateDisplay(num + "²=" + result);
  expression = String(result);
}

// 1/x
function applyInverse() {
  const current = display.value || expression;
  const num = parseFloat(current);
  if (isNaN(num) || num === 0) {
    updateDisplay("Virhe");
    expression = "";
    return;
  }
  const result = 1 / num;
  updateDisplay("1/" + num + "=" + result);
  expression = String(result);
}

// ± (vaihda etumerkki)
function toggleSign() {
  const current = display.value || expression || "0";
  const num = parseFloat(current);
  if (isNaN(num)) return;
  const result = num * -1;
  updateDisplay(String(result));
  expression = String(result);
}
