
//Inicialize variables

import { upgrades } from "../Constants/buildings.js";
import * as Helper from "./helperFunctions.js";
//Base Stats
var clicks = 10000;
var bps = 0;
var burgerPerClick = 1;

//Right HTML elements
var clickContainer = document.getElementById("currentClicks");
var clickerObject = document.getElementById("clickerObject");
var cpsContainer = document.getElementById("currentCps");
//ShopItems


//Update the game every 0.1 seconds
var intervalId = window.setInterval(function () {
    Update();
}, 100);
var autoSave = window.setInterval(function () {
    Save();
}, 60000);


clickContainer.innerHTML = "Burguers:" + clicks;
cpsContainer.innerHTML = "per second: " + bps;


function AddBurguers(amount) {
    clicks = clicks + amount;
    clickContainer.innerHTML = "Burguers:" + Helper.Beautify(clicks);

}
function clickBurger(event) {

    const x = event.offsetX
    const y = event.offsetY

    const div = document.createElement('div')

    div.innerHTML = `+${Helper.Beautify(burgerPerClick)}`;
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
    console.log(upgradeName)
    const selectedUpgrade = upgrades.find((u) => {
        if (u.upgradeName === upgradeName) return u
    })
    if (clicks >= selectedUpgrade.Cost) {

        //Update current burgers
        clicks -= selectedUpgrade.Cost;

        clickContainer.innerHTML =
            "Burguers:" + Helper.Beautify(clicks);

        //Update the object info
        selectedUpgrade.Level++;
        selectedUpgrade.LevelText.innerHTML = "Level " + selectedUpgrade.Level;



        selectedUpgrade.Cost *= selectedUpgrade.costMultiplier;
        selectedUpgrade.CostText.innerHTML = Helper.Beautify(selectedUpgrade.Cost);

        //Update stats
        bps += selectedUpgrade.increase_BPS;

        cpsContainer.innerHTML = "per second: " + Helper.Beautify(bps);


    }
}

function Save() {
    localStorage.clear();

    upgrades.map((upgrade) => {
        const obj = JSON.stringify({
            upgradeName: upgrade.upgradeName,
            Cost: upgrade.Cost,
            Level: upgrade.Level,
            increase_BPS: upgrade.increase_BPS,
            CostText: upgrade.CostText,
            LevelText: upgrade.LevelText,
            costMultiplier: upgrade.costMultiplier
        })
        localStorage.setItem(upgrade.upgradeName, obj)
    })


    localStorage.setItem("bps", JSON.stringify(bps))
    localStorage.setItem("clicks", JSON.stringify(clicks))
    localStorage.setItem("burgerPerClick", JSON.stringify(burgerPerClick))
}

function Load() {
    upgrades.map((upgrade) => {
        const savedValues = JSON.parse(localStorage.getItem(upgrade.upgradeName))
        upgrade.Cost = savedValues.Cost
        upgrade.Level = savedValues.Level

        upgrade.increase_BPS = savedValues.increase_BPS
        upgrade.costMultiplier = savedValues.costMultiplier

        upgrade.LevelText.innerHTML = "Level " + savedValues.Level

        upgrade.CostText.innerHTML = Helper.Beautify(savedValues.Cost);
    })
    bps = JSON.parse(localStorage.getItem("bps"));
    cpsContainer.innerHTML = "per second: " + Helper.Beautify(bps);
    clicks = JSON.parse(localStorage.getItem("clicks"));
    burgerPerClick = JSON.parse(localStorage.getItem("burgerPerClick"));


}


window.BuyUpgrade = BuyUpgrade;
window.clickBurger = clickBurger;
window.Save = Save;
window.Load = Load;
window.setInterval = setInterval;