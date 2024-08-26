
import { Refresh } from "./Calculator.js";
var currentStyle = "Classic"

const styles = [
    {
        ID: 0,
        name: 'Classic'
    },
    {
        ID: 1,
        name: 'Hacker'
    },
    {
        ID: 2,
        name: 'Water'
    },
    {
        ID: 3,
        name: 'Wood'
    },
    {
        ID: 4,
        name: 'Desert'
    }
]
function ReplaceStyle(id) {
    const newStyle = styles.find((style) => {
        if (style.ID === id) return style
    })
    document.body.innerHTML = document.body.innerHTML.replaceAll(currentStyle, newStyle.name);
    currentStyle = newStyle.name;
    Refresh();
}
window.ReplaceStyle = ReplaceStyle;