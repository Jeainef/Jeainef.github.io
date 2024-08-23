

export function Beautify(value) {
    var valueBeautified = Math.round(value * 10, 2);
    valueBeautified = valueBeautified / 10;
    return valueBeautified
}