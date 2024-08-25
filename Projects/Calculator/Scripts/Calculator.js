

var result = "0";
var value = "0";
var operation = "";

var ResultHTML = document.getElementById("Result");


function Operate() {
    console.log(result + "   " + value);
    var floatValue = parseFloat(value);
    var floatResult = parseFloat(result)
    switch (operation) {
        case "+":
            result = floatResult + floatValue;
            break;
        case "-":
            result = floatResult - floatValue;
            break;
        case "*":
            result = floatResult * floatValue;
            break;
        case "/":
            result = floatResult / floatValue;
            break;
        case "^":
            result = floatResult * floatResult;
            break;
        case "sqrt":
            result = Math.sqrt(floatResult);
            break;
        case "":
            result = result;
            break;
    }
    result = result.toString().substring(0, 11);
    ResultHTML.innerHTML = result

    operation = ""
    value = "0"
    console.log(floatResult + "   " + floatValue);
    console.log("The html is: " + ResultHTML.innerHTML);

}
function AddOperation(value) {
    if (operation !== "") {
        Operate();
    }
    operation = value;
    ResultHTML.innerHTML += operation;
}
function AddValue(number) {


    console.log(number)
    if (operation === "") {
        if (result === "0") {
            result = number;
            ResultHTML.innerHTML = number;
        }
        else {
            result += number;
            ResultHTML.innerHTML += number;
        }
    }
    else {
        if (value === "0") {
            value = number;
            ResultHTML.innerHTML = number;
        }
        else {
            value += number;
            ResultHTML.innerHTML += number;
        }
    }

}
export function Refresh() {
    ResultHTML = document.getElementById("Result");
}

window.AddValue = AddValue;
window.AddOperation = AddOperation;
window.Operate = Operate;