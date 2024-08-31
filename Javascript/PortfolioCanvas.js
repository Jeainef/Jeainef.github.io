var canvas = document.querySelector("canvas")

var c = canvas.getContext("2d");

var mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

var points = []

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

canvas.addEventListener("mousemove", function (event) {

    mouse.x = event.x;
    mouse.y = event.y;


    points.push(new LinePoint(mouse.x, mouse.y));

    console.log(points.length)

})
window.addEventListener("scroll", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

function LinePoint(x, y) {
    this.x = x;
    this.y = y;
    this.darken = 50;
    this.color = 'hsl(180, 100%, ' + this.darken + '%)'
    this.width = 5;

    this.Update = function () {
        if (this.darken > 15) this.darken -= 1;
        this.width -= 0.03;
        this.color = 'hsl(180, 100%, ' + this.darken + '%)'
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

}
Animate();