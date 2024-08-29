


var canvas = document.querySelector("canvas");



var c = canvas.getContext("2d");

var mouse = {
    mouseX: undefined,
    mouseY: undefined
}
canvas.addEventListener("mousemove", function (event) {
    mouse.mouseX = event.x;
    mouse.mouseY = event.y;
    console.log(mouse);
});
window.addEventListener("resize", function (event) {
    init();
})
function Circle(x, y, radius, dx, dy, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.minRadius = radius;
    this.Draw = function () {
        c.beginPath()
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fill()

    }
    this.Update = function () {
        this.x += dx;
        this.y += dy;

        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            dx = -dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            dy = -dy;
        }
        this.Draw();
    }
}


var circles = [];
var colorArray = [
    "#014040", "#02735E", "#03A678", "#F27405", "#731702"

]
function init() {
    circles = []
    canvas.width = window.innerWidth - 2;
    canvas.height = window.innerHeight - 2;
    for (var i = 0; i < 1000; i++) {
        radius = Math.random() * 5 + 1;
        var x = Math.random() * (canvas.width - radius * 2) + radius;
        var y = Math.random() * (canvas.height - radius * 2) + radius;
        var dx = (Math.random() - 0.5) * 4
        var dy = (Math.random() - 0.5) * 4
        var color = colorArray[Math.floor(Math.random() * colorArray.length)]
        circles.push(new Circle(x, y, radius, dx, dy, color))
    }
}

var maxRadius = 25;
function animate() {
    requestAnimationFrame(animate);

    c.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < circles.length; i++) {
        circles[i].Update();

        if (mouse.mouseX - circles[i].x < 50 && mouse.mouseX - circles[i].x > -50
            && mouse.mouseY - circles[i].y < 50 && mouse.mouseY - circles[i].y > -50
        ) {
            if (circles[i].radius < maxRadius) {
                circles[i].radius += 1;
            }
        }
        else {
            if (circles[i].radius > circles[i].minRadius)
                circles[i].radius -= 1;
        }

    }

}

init();
animate();


