let answertext = document.getElementsByClassName("answer-text")
answertext = answertext[0]

let expression = "0"
let canDoDot = true
// let maxPrecision = 1

render()

function render() {
    answertext.textContent = String(expression)
}

document.onclick = function (event) {
    let actionData = event.target.dataset.action
    if (!actionData) return

    if (actionData === "ac") {
        expression = "0"
        maxPrecision = 1
        canDoDot = true
    }
    else if (actionData === "plusMinus") {
        let startIndex = getIndexesOfLastNumber()[0]
        console.log(startIndex)
        let lastNumber = getLastNumber()
        if (expression[startIndex - 1] === "-" &&
            (!Number(expression[startIndex - 2]) && expression[startIndex - 2] !== "0")) {
            expression = expression.substring(0, startIndex - 1) + expression.substring(startIndex)
        } else {
            let lastNumber = getLastNumber()
            changeLastNumberTo("-" + lastNumber)

            if (expression[startIndex] === "-" && expression[startIndex - 1] === "-") {
                expression = expression.substring(0, startIndex - 1) + "+" + expression.substring(startIndex + 1)
            }
        }
    }
    else if (actionData === "procent") {
        let startIndex = getIndexesOfLastNumber()[0]
        if (expression[startIndex - 1] !== "*") return

        let newLastNumber = getLastNumber() / 100
        changeLastNumberTo(newLastNumber)
    }
    else if (actionData === "equals") {
        if (!checkIfLastSymbolIsNumber()) expression = expression.substring(0, expression.length - 1)
        solveExpression()
    }
    else if (actionData === "dot") {
        // let lastNumber = getLastNumber()
        // if (lastNumber.includes(".")) return
        if (!canDoDot) return

        if (!checkIfLastSymbolIsNumber()) expression += "0."
        else expression += "."
        // maxPrecision += 1
        canDoDot = false
    }
    else if (Number(actionData) || actionData === "0") makeNum(actionData)
    else makeSign(actionData)

    render()
}

function checkIfLastSymbolIsNumber() {
    if (!Number(expression[expression.length - 1]) && expression[expression.length - 1] !== "0") return false
    return true
}

function makeNum(actionData) {
    if (expression === "0") {
        expression = actionData
        return
    }
    expression += actionData
}

function makeSign(actionData) {
    if (!checkIfLastSymbolIsNumber()) return
    solveExpression()

    if (actionData === "divide") expression += "/"
    else if (actionData === "multiply") expression += "*"
    else if (actionData === "minus") expression += "-"
    else if (actionData === "plus") expression += "+"
}

function solveExpression() {
    expression = String(eval(expression))
    canDoDot = true
    // expression = String(expression.toPrecision(maxPrecision))
}

function changeLastNumberTo(to) {
    let startIndex = getIndexesOfLastNumber()[0]

    expression = expression.substring(0, startIndex)
    expression += to
}

function getLastNumber() {
    let numberIndexes = getIndexesOfLastNumber()
    let startIndex = numberIndexes[0]
    let endIndex = numberIndexes[1]

    let lastNumber = parseFloat(expression.substring(startIndex, endIndex + 1))
    return lastNumber
}

function getIndexesOfLastNumber() {
    let startIndex = -1
    let lastIndex = -1
    let numberStarted = false

    for (let i = 0; i < expression.length; i++) {
        let symbol = expression[i]

        if (Number(symbol) || symbol === "." || symbol === "0") {
            if (!numberStarted) {
                startIndex = i
                lastIndex = i
                numberStarted = true
            } else {
                // if (startIndex === 0) continue
                lastIndex = i
            }
        } else {
            numberStarted = false
        }
    }

    return [startIndex, lastIndex]
}
