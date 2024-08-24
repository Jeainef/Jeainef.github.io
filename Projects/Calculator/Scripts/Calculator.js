

var result = "0";
var value = "0";
var operation = "";

var ResultHTML = document.getElementById("Result")

function Operate() {
    floatValue = parseFloat(value);
    floatResult = parseFloat(result)
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
        case "":
            result = floatValue;
    }
    ResultHTML.innerHTML = result;

    operation = ""
    value = "0"
    console.log(floatResult + "   " + floatValue);

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
    if (value === "0") {
        ResultHTML.innerHTML = number;
    }
    else {
        ResultHTML.innerHTML += number;
    }
    if (result === "0") {
        result = number;
    }
    else if (value === "0") {
        value = number;
    }
    else {
        value += number;
    }

}