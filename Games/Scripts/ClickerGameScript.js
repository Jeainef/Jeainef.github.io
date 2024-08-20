
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

const upgrades = [
    {
        upgradeName: "clicker",
        Cost: 10,
        Level: 0,
        increase_BPS: 0.1,
        CostText: document.getElementById("ClickerCost"),
        LevelText: document.getElementById("ClicksUpgradeLevel"),
        costMultiplier: 1.12
    },
    {
        upgradeName: "waiter",
        Cost: 100,
        Level: 0,
        increase_BPS: 1,
        CostText: document.getElementById("WaiterCost"),
        LevelText: document.getElementById("WaiterUpgradeLevel"),
        costMultiplier: 1.12
    },
    {
        upgradeName: "restaurant",
        Cost: 500,
        Level: 0,
        increase_BPS: 10,
        CostText: document.getElementById("RestaurantCost"),
        LevelText: document.getElementById("RestaurantUpgradeLevel"),
        costMultiplier: 1.12
    }

]


//Update the game every 0.1 seconds
var intervalId = window.setInterval(function () {
    Update();
}, 100);


clickContainer.innerHTML = "Burguers:" + clicks;
cpsContainer.innerHTML = "per second: " + bps;


function AddBurguers(amount) {
    clicks = clicks + amount;
    clicksBeautified = Math.round(clicks * 10, 2);
    clicksBeautified = clicksBeautified / 10;
    clickContainer.innerHTML = "Burguers:" + clicksBeautified;

}
function clickBurger(event) {

    const x = event.offsetX
    const y = event.offsetY

    const div = document.createElement('div')

    clicksBeautified = Math.round(burgerPerClick * 10, 2);
    clicksBeautified = clicksBeautified / 10;
    div.innerHTML = `+${clicksBeautified}`;
    div.style.cssText = `  font-weight: bold;   text-shadow: 7px 7px 3px #3d3526;
    color: #ffdb98; position: absolute; left: ${x}px;top: ${y}px;  font-size: 30px; pointer-events: none;`
    clickerObject.appendChild(div);

    div.classList.add('fade-up');
    timeout(div);
    AddBurguers(burgerPerClick);


}
const timeout = (div) => {
    setTimeout(() => {
        div.remove()
    }, 800);
}
function Update() {
    AddBurguers(bps / 10);
}

function BuyUpgrade(upgradeName) {
    const selectedUpgrade = upgrades.find((u) => {
        if (u.upgradeName === upgradeName) return u
    })
    if (clicks >= selectedUpgrade.Cost) {

        //Update current burgers
        clicks -= selectedUpgrade.Cost;
        clicksBeautified = Math.round(clicks * 10, 2);
        clicksBeautified = clicksBeautified / 10;
        clickContainer.innerHTML = "Burguers:" + clicksBeautified;

        //Update the object info
        selectedUpgrade.Level++;
        selectedUpgrade.LevelText.innerHTML = "Level: " + selectedUpgrade.Level;



        selectedUpgrade.Cost *= selectedUpgrade.costMultiplier;

        CostBeautified = Math.round(selectedUpgrade.Cost * 10, 2);
        CostBeautified = CostBeautified / 10;

        selectedUpgrade.CostText.innerHTML = CostBeautified;

        //Update stats
        bps += selectedUpgrade.increase_BPS;

        bpsBeautified = Math.round(bps * 10, 2);
        bpsBeautified = bpsBeautified / 10;
        cpsContainer.innerHTML = "per second: " + bpsBeautified;


    }
}