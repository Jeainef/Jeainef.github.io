
//Inicialize variables

//Base Stats
var clicks = 0;
var bps = 0;
var burgerPerClick = 1;

//Right HTML elements
var clickContainer = document.getElementById("currentClicks");
var clickerObject = document.getElementById("clickerObject");
var cpsContainer = document.getElementById("currentCps");

//ShopItems

var clickerCost = 10;
var clickerLevel = 0;
var clickerBps = 0.1;

//Update the game every 0.1 seconds
var intervalId = window.setInterval(function () {
    Update();
}, 100);


clickContainer.innerHTML = "Burguers:" + clicks;
cpsContainer.innerHTML = "per second: " + bps;


function AddBurguers(amount = burgerPerClick) {
    clicks = clicks + amount;
    clicksBeautified = Math.round(clicks * 10, 2);
    clicksBeautified = clicksBeautified / 10;
    clickContainer.innerHTML = "Burguers:" + clicksBeautified;
}

function Update() {
    AddBurguers(bps / 10);
}

function BuyUpgrade(level, cost) {
    if (clicks >= clickerCost) {

        //Update current burgers
        clicks -= clickerCost;
        clickContainer.innerHTML = "Burguers:" + clicks;

        //Update the object info
        clickerLevel++;
        document.getElementById(level).innerHTML = "Level: " + clickerLevel;

        clickerCost = clickerCost + clickerLevel;
        document.getElementById(cost).innerHTML = "Cost: " + clickerCost + '<img src="Images/Burger.png" alt="Burguer" class="UpgradeCostImage"></img>';

        //Update stats
        bps = bps + clickerBps;

        bpsBeautified = Math.round(bps * 10, 2);
        bpsBeautified = bpsBeautified / 10;
        cpsContainer.innerHTML = "per second: " + bpsBeautified;


    }
}