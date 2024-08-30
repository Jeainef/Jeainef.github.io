var canvas= document.querySelector("canvas")

var c=canvas.getContext("2d");

var mouse={
    x:canvas.width/2,
    y:canvas.height/2
}

var particles=[]
var hue=0;
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

window.addEventListener("resize",function(){
    canvas.width=window.innerWidth;
    canvas.height=window.innerHeight;
})

canvas.addEventListener("mousemove",function(event){
    mouse.x=event.x,
    mouse.y=event.y

    for(var i=0;i<3;i++){
        particles.push(new Particle());
    }
    
})

function Particle(){
    this.x=mouse.x;
    this.y=mouse.y;
    this.radius=Math.random()*5+5;
    this.dx=Math.random()*2-1;
    this.dy=Math.random()*2-1;
    this.color='hsl(' + hue + ' ,100%,50%)';
    this.Draw=function(){
        c.beginPath()
        c.fillStyle=this.color;
        c.arc(this.x,this.y,this.radius,0,2*Math.PI)
        c.fill();
    }
    this.Update=function(){
        this.x+=this.dx;
        this.y+=this.dy;
        if(this.radius>0.2)this.radius-=0.15
        this.Draw();
    }
}
function HandleParticles(){
    for(var i=0;i<particles.length;i++){
        particles[i].Update();

        for(var j=i;j<particles.length;j++){
            var distx=particles[j].x-particles[i].x;
            var disty=particles[j].y-particles[i].y;
            var distance= Math.sqrt(distx*distx + disty*disty);
            if(distance<50){
                console.log(distance)
                c.beginPath();
                c.strokeStyle=particles[i].color;
                c.lineWidth=0.2;
                c.moveTo(particles[i].x,particles[i].y);
                c.lineTo(particles[j].x,particles[j].y);

                c.stroke();
            }
        }
        if(particles[i].radius<=0.3) {
            particles.splice(i,1)
            i--;
        }
    }
}
function Animate(){
  //  c.fillStyle='rgba(0,0,0,0.1)'
// c.fillRect(0,0,canvas.width,canvas.height);
    c.clearRect(0,0,canvas.width,canvas.height)
    requestAnimationFrame(Animate);

    hue+=3;
    HandleParticles();

}
Animate();