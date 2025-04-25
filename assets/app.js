const formElement = document.querySelector('form');
const calculInput = document.querySelector('#calcul');
const resultInput = document.querySelector('#result');
const toggleBtnSpan = document.querySelector('.toggleBtn');
const historyDiv =  document.querySelector('.history');

let keyValue;
let btnId;
let tmp;
let lastOperatorTyped;
let lastKey;
let leftParenthese = false;
let keys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '÷', 'x', '-', '+', '%'];
let operatorsKeys = ['+', '-', 'x', '÷'];
let history = [];

/**
 * toggle btn
 * history = [{calculation: '', result: ''}, {calculation: '', result: ''}]
 */
toggleBtnSpan.addEventListener('click', showHideHistory);
function showHideHistory() {
    if(history.length > 0) {
        for(let i = 0; i < history.length; i++) {
            document.getElementById('calcul' + i).innerText = history[i].calculation;
            document.getElementById('result' + i).innerText = history[i].result;
        }
    }

    if(historyDiv.classList.contains('showAnimation')) {
        // hide history
        historyDiv.classList.remove('overFlow');
        historyDiv.classList.replace('showAnimation', 'hideAnimation');
        setTimeout(() => {
            historyDiv.classList.toggle('show');
        }, 250);
    } else {
        // show history
        historyDiv.classList.toggle('show');
        historyDiv.classList.remove('hideAnimation');
        historyDiv.classList.add('showAnimation');
        setTimeout(() => {
            historyDiv.classList.add('overFlow');
        }, 250);
    }
}

/**
 * localStorage save history data
 */
if(localStorage.getItem('history') != null) {
    history = history.concat(JSON.parse(localStorage.getItem('history')));
}

function saveHistory() {
    const calculation = calculInput.value;
    const result = resultInput.value;
    const historyObject = {
        calculation: calculation,
        result: result,
    }
    history.push(historyObject);
    if(history.length > 3) history.shift();
    localStorage.setItem('history', JSON.stringify(history));
}

/**
 * caculate function
 * 9 ÷ 3 + 17 - 56
 * ÷ => /
 * x => *
 * % => /100
 */
// show result function
function showResult() {
    tmp = calculInput.value;
    tmp = tmp.replace(/x/g, '*').replace(/÷/g, '/').replace(/%/g, '/100');
    if(tmp.endsWith('+') || tmp.endsWith('-') || tmp.endsWith('*') || tmp.endsWith('/') || tmp.endsWith('(')) {
        tmp = tmp.slice(0, -1);
    }
    // (eval(tmp) != undefined) ? resultInput.value = eval(tmp) : resultInput.value = '';
    resultInput.value = (eval(tmp) != undefined) ? eval(tmp) : '';
}

// clear calcul input function
function clearCalculator() {
    calculInput.value = "";
    resultInput.value = "";
    lastOperatorTyped = "";
    lastKey = "";
    leftParenthese = false;
}

// back space function
function backSpace() {
    if(calculInput.value != "") {
        calculInput.value = calculInput.value.slice(0, -1);
    }
}

// operation equal function
function equal() {
    calculInput.value = resultInput.value;
    resultInput.value = '';
}

// calculate function
formElement.addEventListener('click', calculate);
function calculate(e) {
    keyValue = e.target.getAttribute('key');
    // console.log(keyValue);
    btnId = e.target.getAttribute('id');
    // console.log(btnId);

    if(keyValue) {
        if(!leftParenthese && keyValue == '()') {
            keyValue = '(';
            leftParenthese = true;
        } else if(leftParenthese && keyValue == '()') {
            keyValue = ')';
            leftParenthese = false;
        }
        
        calculInput.value = calculInput.value + keyValue;
        showResult();
        if(operatorsKeys.includes(keyValue)) {
            lastOperatorTyped = keyValue;
        }
        lastKey = keyValue;
    }

    if(btnId) {
        switch (btnId) {
            case "AC":
                clearCalculator();
                break;
            case "backSpace":
                backSpace();
                showResult();
                break;
            case "equal":
                saveHistory();
                equal();
                break;
            default:
                break;
        }
    }

    e.target.blur();
}

/**
 * keyboard function
 */
window.addEventListener('keydown', keyboardKeysTyping);
function keyboardKeysTyping(event) {
    console.log(event);
    if(keys.includes(event.key)) {
        event.preventDefault();
        // document.querySelector("button[key='"+ event.key +"']").click();
        document.querySelector(`button[key='${event.key}']`).click();
    } else {
        switch (event.key) {
            case 'Enter':
            case '=':
                event.preventDefault();
                saveHistory();
                equal();
                break;
            case 'Escape':
            case 'Esc':
                clearCalculator();
                break;
            case 'Backspace':
                backSpace();
                showResult();
                break;
            case '/':
                document.querySelector(`button[key='÷']`).click();
                break;
            case '*':
                document.querySelector(`button[key='x']`).click();
                break;
            case '(':
            case ')':
                document.querySelector(`button[key='()']`).click();
                break;
            default:
                break;
        }
    }
}
