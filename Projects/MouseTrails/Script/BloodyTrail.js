var canvas = document.querySelector("canvas")

var c = canvas.getContext("2d");

var mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

var particles = []
var points = []
var BloodColors = [
    "#660000", "#8B0000", "#800000", "#CC1100", "#DC143C"
]
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

canvas.addEventListener("mousemove", function (event) {

    mouse.x = event.x;
    mouse.y = event.y;

    for (var i = 0; i < 7; i++) particles.push(new Particle());



    points.push(new LinePoint(mouse.x, mouse.y));

    console.log(points.length)

})
function LinePoint(x, y) {
    this.x = x;
    this.y = y;
    this.darken = 100;
    this.color = 'hsl(356, 100%, ' + this.darken + '%)'
    this.width = 5;

    this.Update = function () {
        if (this.darken > 15) this.darken -= 1;
        this.width -= 0.02;
        this.color = 'hsl(356, 100%, ' + this.darken + '%)'
    }

}
function Particle() {
    this.x = mouse.x;
    this.y = mouse.y;
    this.radius = Math.random() * 5 + 5;
    this.dy = Math.random() * 2;
    this.dx = Math.random() * 0.5 - 0.25;
    this.color = BloodColors[Math.floor(Math.random() * BloodColors.length)];
    this.Draw = function () {
        c.beginPath()
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        c.fill();
    }
    this.Update = function () {
        this.y += this.dy;
        this.x += this.dx;
        if (this.radius > 0.1) this.radius -= 0.05
        this.Draw();
    }
}
function HandleParticles() {
    for (var i = 0; i < particles.length; i++) {
        particles[i].Update();
        if (particles[i].radius < 0.15) {
            particles.splice(i, 1);
            i--;
        }
    }
}
function HandleLine() {

    if (points.length > 0) {


        //Update the first point
        points[0].Update();

        if (points[0].width < 0.2) {
            points.splice(0, 1)
        }
        for (var i = 1; i < points.length; i++) {
            //Draw the line between the point i-1 on the points array to the point i
            points[i].Update();


            c.beginPath();
            c.lineWidth = points[i].width;
            c.strokeStyle = points[i].color;
            c.lineCap = "round"
            c.moveTo(points[i - 1].x, points[i - 1].y);
            c.lineTo(points[i].x, points[i].y);
            c.stroke();

            //Delete from array if width is too small
            if (points[i].width < 0.2) {
                points.splice(1, 1)
                i--;
            }

        }

    }
}
function Animate() {
    c.fillStyle = 'rgba(0,0,0,0.3)'
    c.fillRect(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(Animate);

    HandleLine();
    HandleParticles();

}
Animate();