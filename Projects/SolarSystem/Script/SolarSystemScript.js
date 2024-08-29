var canvas = document.querySelector("canvas");

var c = canvas.getContext("2d");

canvas.width = window.innerWidth - 2;
canvas.height = window.innerHeight - 2;

//StyleVariables
var starNumber = 300;
var starMinRadius = 1;
var starMaxRadius = 3;

//Utilities

function RandomBetweenTwoValues(min, max) {
    return Math.random() * (max - min) + min;
}

function Star(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.radiant = Math.random() * (2 * Math.PI);

    this.Draw = function () {

        c.beginPath();
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        c.fill();
    };
    this.Update = function () {
        this.radiant += 0.005;
        c.globalAlpha = Math.cos(this.radiant) * 0.5 + 0.5;
        this.Draw();
    };
}

var stars = []
var starColors = ["White", "Yellow", "Orange"]


for (var int = 0; int < starNumber; int++) {

    var x = Math.random() * canvas.width;
    var y = Math.random() * canvas.height;
    var radius = RandomBetweenTwoValues(starMinRadius, starMaxRadius);
    var color = starColors[Math.floor(Math.random() * starColors.length)];
    console.log(color)
    var star = new Star(x, y, radius, color);
    stars.push(star);
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < stars.length; i++) {
        stars[i].Update();
    }
}

animate();
