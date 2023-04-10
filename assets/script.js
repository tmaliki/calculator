/**
 * calculator script
 */

// selection des élements
const formElt = document.querySelector('form');
const calculElt = document.querySelector('#idCalcul');
const resultElt = document.querySelector('#idResult');
const historyElt = document.querySelector('.history');
const historyIconElt  = document.querySelector('.historyIcon');

// déclaration des varibales
let btnId;
let dataKeyValue;
let temporaryOp;
let lastOperation;
let lastDataKey;
let parentheseLeft = false; // boolean
let dataKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', 'x', '÷', '%', '.'];
let operationKeys = ['+', '-', 'x', '÷'];
let historyTab = [];

// fonction d'affichage de l'historique
historyIconElt.addEventListener('click', historyShowHide);
function historyShowHide() {
    // si mon historique n'est pas vide
    if(historyTab.length > 0) {
        for(let i = 0; i < historyTab.length; i++) {
            document.querySelector('#opCal'+i).innerHTML = historyTab[i].opCalcul;
            document.querySelector('#opRes'+i).innerHTML = historyTab[i].opResult;
        }
    }

    // si notre div de l'historique contient la classe show-animation
    if(historyElt.classList.contains('show-animation')) {
        // cacher l'historique
        historyElt.classList.remove('over-flow');
        historyElt.classList.replace('show-animation', 'hide-animation');
        setTimeout(() => {
            historyElt.classList.toggle('show');
        }, 220);
    } else {
        // afficher l'historique
        historyElt.classList.toggle('show');
        historyElt.classList.remove('hide-animation');
        historyElt.classList.add('show-animation');
        setTimeout(() => {
            historyElt.classList.add('over-flow');
        }, 220)
    }
}

// condition de transformation des données de l'historique
if(localStorage.getItem('historyTab') != null) {
    historyTab = historyTab.concat(JSON.parse(localStorage.getItem('historyTab')));
}

// fonction de sauvegarde de l'historique
function historySave() {
    let opCalculVal = calculElt.value;
    let opResultVal = resultElt.value;
    let historyObject = {
        opCalcul: opCalculVal,
        opResult: opResultVal
    };

    historyTab.push(historyObject);

    if(historyTab.length > 4) {
        historyTab.shift();
    }

    localStorage.setItem('historyTab', JSON.stringify(historyTab));
}

// fonction d'affiche du resultat
function fnShowResult() {
    temporaryOp = calculElt.value;
    temporaryOp = temporaryOp.replace(/x/g, '*').replace(/÷/g, '/').replace(/%/g, '/100');

    if(temporaryOp.endsWith('+') || temporaryOp.endsWith('-') || temporaryOp.endsWith('*') || temporaryOp.endsWith('/') || temporaryOp.endsWith('(')) {
        temporaryOp = temporaryOp.slice(0, -1);
    }

    (eval(temporaryOp) != undefined) ? resultElt.value = eval(temporaryOp) : resultElt.value = "";
}

// fonction poiur effacer la calculatrice
function clearCalculator() {
    calculElt.value = "";
    resultElt.value = "";
    lastOperation = "";
    lastDataKey = "";
    parentheseLeft = false;
}

// fonction pour back space
function fnBackSpace() {
    if(calculElt.value != "")
        calculElt.value = calculElt.value.slice(0, -1);
}

// fonction pour le bouton égale
function fnEqual() {
    calculElt.value = resultElt.value;
    resultElt.value = "";
}

// fonction pour faire les calcules
formElt.addEventListener('click', fnCalculate);
function fnCalculate(evt) {
    btnId = evt.target.getAttribute('id');
    dataKeyValue = evt.target.getAttribute('dataKey');

    if(dataKeyValue) {
        if(!parentheseLeft && dataKeyValue == '()') {
            dataKeyValue = '(';
            parentheseLeft = true;
        } else if(parentheseLeft && dataKeyValue == '()') {
            dataKeyValue = ')';
            parentheseLeft = false;
        }

        calculElt.value = calculElt.value + dataKeyValue;
        fnShowResult();

        if(operationKeys.includes(dataKeyValue)) {
            lastOperation = dataKeyValue;
        }
        lastDataKey = dataKeyValue;
    }

    if(btnId) {
        switch (btnId) {
            case 'idAc':
                clearCalculator();
                break;
            
            case "idBackSpace":
                fnBackSpace();
                break;

            case "idEqual":
                historySave();
                fnEqual();
                break;

            default:
                break;
        }
    }

    evt.target.blur();
}

// fonction d'utilisation du clivier de l'appreil
window.addEventListener('keydown', fnKeyboardUsing)
function fnKeyboardUsing(evt) {
    if(dataKeys.includes(evt.dataKey)) {
        evt.preventDefault();
        document.querySelector("button[dataKey='"+ evt.dataKey + "']").click();
    } else {
        switch (evt.dataKey) {
            case "Enter":
            case "=":
                evt.preventDefault();
                historySave();
                fnEqual();
                break;

            case "Escape":
            case "Esc":
                clearCalculator();
                break;

            case "Backspace":
                fnBackSpace();
                fnShowResult();
                break;

            case "*":
                document.querySelector("button[dataKey='x']").click();
                break;

            case "/":
                document.querySelector("button[dataKey='÷']").click();
                break;

            case "(":
            case ")":
                document.querySelector("button[dataKey='()']").click();
                break;
            
            default:
                break;
        }
    }
}


