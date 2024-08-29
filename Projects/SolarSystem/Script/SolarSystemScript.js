var canvas = document.querySelector("canvas");

var c = canvas.getContext("2d");

window.addEventListener("resize",function(){
    Init();
})
canvas.addEventListener("mousemove",function(event){
    mousePos.posX=event.x;
    mousePos.posY=event.y;
})

//Variables

var mousePos={
    posX: window.innerWidth/2,
    posY: window.innerHeight/2,
}
//Stars
var stars = []
var starColors = ["White", "Yellow", "Orange"]
var starNumber = 100;
var starMinRadius = 1;
var starMaxRadius = 3;
var starShimmerSpeed=0.03;

//Planet
var planet;
var planetRadius=70;
var mouseDrag=0.1;
var planetColors=[
    "#eddbad","#e2bf7d","#c3924f","#fceead","#c4b08b"
]
var planetStripes=50;

//Sattelites
var satellites=[]
var satelliteColors = ["#eddbad","#e2bf7d","#c3924f","#fceead","#c4b08b"]
var SatelliteRadius=5;
var satelliteSpeed=0.1;
var maxSatelliteDistance=200;
var minSatelliteDistance=130;
var satelliteDrag=0.5;

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
        c.globalAlpha = Math.cos(this.radiant) * 0.5 + 0.5;
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        c.fill();
    };
    this.Update = function () {
        this.radiant += starShimmerSpeed;

        this.Draw();
    };
}
function Planet(x, y, radius){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color=c.createLinearGradient(0,0,innerWidth,innerHeight);

    for (var i=0;i<planetStripes;i++) {
        this.color.addColorStop(i/planetStripes, planetColors[Math.floor(Math.random()*planetColors.length)]);
    };
    
    //Drag
    this.lastPosition={x:this.x,y:this.y};

    this.Draw = function () {

        c.beginPath();
        c.globalAlpha=1;
        c.fillStyle = this.color;
        c.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        c.fill();
    };
    this.Update = function () {

        //DragEffect
        this.lastPosition.x
        +=(mousePos.posX - this.lastPosition.x)*mouseDrag
        this.lastPosition.y
        +=(mousePos.posY - this.lastPosition.y)*mouseDrag

        this.x =  this.lastPosition.x;
        this.y=  this.lastPosition.y;

        this.Draw();
    };
}
function Satellite(x, y, radius,color){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.radiant = Math.random() * (2 * Math.PI);
    this.distance=RandomBetweenTwoValues(minSatelliteDistance,maxSatelliteDistance);
    this.speed=RandomBetweenTwoValues(0.005,satelliteSpeed);
    //Drag
    this.lastPosition={x:x,y:y};

    this.Draw = lastPoint =>{

        c.beginPath();
        c.globalAlpha=1;
        c.strokeStyle = this.color;
        c.lineWidth=this.radius;
        c.moveTo(lastPoint.x,lastPoint.y);
        c.lineTo(this.x,this.y);
        c.stroke();
        c.closePath();
    };
    this.Update = function ( TargetX, TargetY) {

        const lastPoint ={x:this.x,y:this.y}
        this.radiant+=this.speed;
        //DragEffect
        this.lastPosition.x
        +=(TargetX - this.lastPosition.x)*satelliteDrag
        this.lastPosition.y
        +=(TargetY - this.lastPosition.y)*satelliteDrag

        this.x =  this.lastPosition.x + Math.cos(this.radiant) * this.distance;
        this.y=  this.lastPosition.y + (Math.sin(this.radiant) * this.distance)/1.5;

        this.Draw(lastPoint);
    };
}

function Init(){
    canvas.width = window.innerWidth - 2;
    canvas.height = window.innerHeight - 2;
    stars=[];

  

    planet= new Planet(canvas.width/2,canvas.height/2,planetRadius)
    for (var int = 0; int < starNumber; int++) {

        var x = Math.random() * canvas.width;
        var y = Math.random() * canvas.height;
        var radius = RandomBetweenTwoValues(starMinRadius, starMaxRadius);
        var color = starColors[Math.floor(Math.random() * starColors.length)];
        var star = new Star(x, y, radius, color);
        stars.push(star);
    }


    for (var int = 0; int < 300; int++) {

        var x = window.innerWidth - 2 + Math.random()*10 + 5 + planetRadius;
        var y = window.innerHeight - 2 + Math.random()*10 + 5+ planetRadius;
        var radius = SatelliteRadius;
        var color = satelliteColors[Math.floor(Math.random() * satelliteColors.length)];
        var moon = new Satellite(x, y, radius, color);
        satellites.push(moon);
    }
}


function Animate() {
    requestAnimationFrame(Animate);
    c.fillStyle='rgba(0,0,0,0.3)'
    c.fillRect(0, 0, canvas.width, canvas.height);
  
    for (var i = 0; i < stars.length; i++) {
        stars[i].Update();
    }
    planet.Update();
    for (var i = 0; i < satellites.length; i++) {
        satellites[i].Update(planet.x,planet.y);
    }

}

Init();
Animate();
