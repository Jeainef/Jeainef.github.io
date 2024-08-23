import { defaultValues } from "./defaultValues.js";

createUpgrades();
export const upgrades = [
    {
        upgradeName: "Clicker",
        Cost: 10,
        Level: 0,
        increase_BPS: 0.1,
        CostText: document.getElementById("ClickerCost"),
        LevelText: document.getElementById("ClickerUpgradeLevel"),
        costMultiplier: 1.12
    },
    {
        upgradeName: "Waiter",
        Cost: 100,
        Level: 0,
        increase_BPS: 1,
        CostText: document.getElementById("WaiterCost"),
        LevelText: document.getElementById("WaiterUpgradeLevel"),
        costMultiplier: 1.12
    },
    {
        upgradeName: "Restaurant",
        Cost: 500,
        Level: 0,
        increase_BPS: 10,
        CostText: document.getElementById("RestaurantCost"),
        LevelText: document.getElementById("RestaurantUpgradeLevel"),
        costMultiplier: 1.12
    },
    {
        upgradeName: "Farm",
        Cost: 1500,
        Level: 0,
        increase_BPS: 100,
        CostText: document.getElementById("FarmCost"),
        LevelText: document.getElementById("FarmUpgradeLevel"),
        costMultiplier: 1.12
    }

]
function createUpgrades() {
    const upgradesContainer = document.getElementById('upgrades_container')
    const template = document.getElementById("upgrade_template").textContent

    defaultValues.forEach(obj => {
        let html = template;
        Object.keys(obj).forEach((key) => {

            const regex = new RegExp(`{{${key}}}`, 'g');
            html = html.replace(regex, obj[key]);
        });
        upgradesContainer.innerHTML += html;
    });

}