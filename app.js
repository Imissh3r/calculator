const displayField = document.getElementById("display");
const expressionField = document.getElementById("expression");
const buttons = document.querySelectorAll(".btn");

let firstNumber = null;
let operator = null;
let secondNumberWait = false;
let secondNumber = null;

function handleNumberInput(number) {
    if (number === '.' && displayField.textContent.includes('.')) return;

    if (displayField.textContent === "Sus behaviour!") {
        displayField.textContent = '0';
    }

    if (secondNumberWait) {
        displayField.textContent = number;
        secondNumberWait = false;
    } else if (displayField.textContent === '0') {
        displayField.textContent = number;
    } else {
        displayField.textContent += number;
    }
}

function calculateResult() {
    if (firstNumber === null || operator === null) return;
    if (secondNumberWait) return;

    secondNumber = Number(displayField.textContent);
    const result = operate(operator, firstNumber, secondNumber);

    expressionField.textContent = `${firstNumber} ${operator} ${secondNumber} =`;
    displayField.textContent = result;
    if (result === "Sus behaviour!") {
        firstNumber = null;
        operator = null;
        secondNumberWait = false;
    } else {
        firstNumber = result;
        secondNumberWait = true;
    }
}

function operate(op, a, b) {
    let res;
    switch (op) {
        case '+':
            res = a + b;
            break;
        case '-':
            res = a - b;
            break;
        case '*':
            res = a * b;
            break;
        case '/':
            if (b !== 0) {
                res = a / b;
                break;
            } else {
                return "Sus behaviour!";
            }
        case '%':
            if (b !== 0) {
                res = a % b;
                break;
            } else {
                return "Sus behavious!";
            }
        default: return null;
    }
    return Math.round(res * 1000) / 1000;
}

function toggleNegate() {
    if (displayField.textContent === '0' || displayField.textContent === 'Sus behaviour!') return;
    if (displayField.textContent.startsWith('-')) {
        displayField.textContent = displayField.textContent.slice(1);
    } else {
        displayField.textContent = `-${displayField.textContent}`;
    }
}

function resetCalculator() {
    displayField.textContent = '0';
    firstNumber = null;
    secondNumber = null;
    secondNumberWait = false;
    operator = null;
    expressionField.textContent = '';
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.dataset.number) {
            handleNumberInput(button.dataset.number)
        } else if (button.dataset.action) {
            if (button.dataset.action === "clear") {
                resetCalculator();
            } else if (button.dataset.action === "backspace") {
                if (displayField.textContent.length > 1) {
                    displayField.textContent = displayField.textContent.slice(0, -1);
                } else {
                    displayField.textContent = '0';
                    expressionField.textContent = null;
                }
            } else if (button.dataset.action === "equal") {
                calculateResult();
            } else if (button.dataset.action === "negate") {
                toggleNegate();
            }
        } else if (button.dataset.operator) {
            if (!secondNumberWait) {
                if (firstNumber !== null && operator !== null) {
                    calculateResult();
                }
                firstNumber = Number(displayField.textContent);
                operator = button.dataset.operator;
                expressionField.textContent = `${firstNumber} ${operator}`;
                secondNumberWait = true;
            } else {
                operator = button.dataset.operator;
                expressionField.textContent = `${firstNumber} ${operator}`;
            }
        }
    });
});

document.addEventListener('keydown', (event) => {
    if (!isNaN(event.key) || event.key === '.') {
        handleNumberInput(event.key);
    }

    switch (event.key) {
        case '+':
        case '-':
        case '*':
        case '/':
            if (!secondNumberWait) {
                if (firstNumber !== null && operator !== null) {
                    calculateResult();
                }
                firstNumber = Number(displayField.textContent);
                operator = event.key;
                secondNumberWait = true;
                expressionField.textContent = `${firstNumber} ${operator}`;
            } else {
                operator = event.key;
                expressionField.textContent = `${firstNumber} ${operator}`;
            }
            break;
        case '%':
            if (!secondNumberWait) {
                if (firstNumber !== null && operator !== null) {
                    calculateResult();
                }
                firstNumber = Number(displayField.textContent);
                operator = event.key;
                secondNumberWait = true;
                expressionField.textContent = `${firstNumber} ${operator}`;
            } else {
                operator = event.key;
                expressionField.textContent = `${firstNumber} ${operator}`;
            }
            break;
        case 'n':
        case "N":
        case "F9":
            toggleNegate();
            break;
        case "Enter":
        case '=':
            event.preventDefault();
            calculateResult();
            break;
        case "Backspace":
            if (displayField.textContent.length > 1) {
                displayField.textContent = displayField.textContent.slice(0, -1);
            } else {
                resetCalculator();
            }
            break;
        case "Escape":
            resetCalculator();
    }
});