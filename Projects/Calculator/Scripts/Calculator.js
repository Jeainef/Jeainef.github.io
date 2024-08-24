

var result = "0";
var value = "0";
var operation = "";

var ResultHTML = document.getElementById("Result");


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
    if (ResultHTML.innerHTML === "0") {
        ResultHTML.innerHTML = number;
    }
    else {
        ResultHTML.innerHTML += number;
    }
    if (operation === "") {
        if (result === "0") {
            result = number;
        }
        else {
            result += number;
        }
    }
    else {
        if (value === "0") {
            value = number;

        }
        else {
            value += number;
        }
    }

}