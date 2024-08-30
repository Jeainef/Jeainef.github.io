var canvas= document.querySelector("canvas")

var c=canvas.getContext("2d");

var mouse={
    x:canvas.width/2,
    y:canvas.height/2
}

var particles=[]

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

window.addEventListener("resize",function(){
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
})

canvas.addEventListener("mousemove",function(event){
    mouse.x=event.x,
    mouse.y=event.y

    particles.push(new Particle());
})

function Particle(){
    this.x=mouse.x;
    this.y=mouse.y;
    this.radius=Math.random()*5+6;
    this.dx=Math.random()*5;
    this.dy=Math.random()*5;

    this.Draw=function(){
        c.beginPath()
        c.fillStyle="Red"
        c.arc(this.x,this.y,this.radius,0,2*Math.PI)
        c.fill();
    }
    this.Update=function(){
        this.x+=this.dx;
        this.y+=this.dx;
        if(this.radius>0.2)this.radius-=0.2
        this.Draw();
    }
}
function HandleParticles(){
    for(var i=0;i<particles.length;i++){
        particles[i].Update();
    }
}
function Animate(){
    c.fillStyle='rgba(0,0,0,0.2)'
    c.fillRect(0,0,canvas.width,canvas.height);

    requestAnimationFrame(Animate);

    HandleParticles();

}
Animate();