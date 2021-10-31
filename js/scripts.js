let canvas;
let ctx;
let flowfield;
let flowfieldAnimation;
window.onload = function () {
    canvas = document.getElementById("canvas1");
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    flowfield = new FlowFieldEffect(ctx, canvas.width, canvas.height);
    flowfield.animate(0);
}
const mouse = {
    x: 0,
    y:0,
}

window.addEventListener('mousemove', function (event) {
    mouse.x = event.x;
    mouse.y = event.y;
    console.log('event fired')
})
window.addEventListener("resize", function () {
    this.cancelAnimationFrame(flowfieldAnimation);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    flowfield = new FlowFieldEffect(ctx, canvas.width, canvas.height);
    flowfield.animate(0);
})
class FlowFieldEffect{
    #ctx;
    #width;
    #height;
    constructor(ctx,width,height) {
        this.#ctx = ctx;
       
        this.#ctx.lineWidth =1;
        this.#height = height;
        this.#width = width;
        
        this.lastTime = 0;//calculate delta time
        this.interval = 1000/60;
        this.timer = 0;
        this.cellSize = 10; //15px is safer size bigger is better in performance worse in look
        this.gradient;
        this.#createGradient();
        this.#ctx.strokeStyle = this.gradient;
        this.radius = 0;
        this.vr = 0.04;
    }
    #createGradient() {
        this.gradient = this.#ctx.createLinearGradient(0, 0, this.#width, this.#height);
        this.gradient.addColorStop("0.1", "#ff5c33");
        this.gradient.addColorStop("0.2", "#ff66b3");
        this.gradient.addColorStop("0.4", "#ccccff");
        this.gradient.addColorStop("0.6", "#b3ffff");
        this.gradient.addColorStop("0.8", "#80ff80");
        this.gradient.addColorStop("0.9", "#ffff33");
        
    }
    #drawLine(angle, x, y) {
        let postionX = x;
        let positionY = y;
        let dx = mouse.x - postionX;
        let dy = mouse.y - positionY;
        let distance = dx * dx + dy * dy;
        if (distance > 400000) distance = 400000;
        else if (distance < 50000) distance = 50000;
        let length = distance/10000;
        this.#ctx.beginPath();
        this.#ctx.moveTo(x, y);
        // this.#ctx.lineTo(x + length, y + length);
        this.#ctx.lineTo(x+Math.cos(angle)*length, y+Math.sin(angle) * length);
        this.#ctx.stroke();
    }
    animate(timeStamp) { //timeStamp is passed automatically when called with requestAnimationFrame
        const deltaTime = timeStamp - this.lastTime;
        this.lastTime = timeStamp;
        if (this.timer > this.interval) {
            this.#ctx.clearRect(0, 0, this.#width, this.#height);
            this.radius += this.vr;
            if (this.radius > 5 || this.radius < -5) {
                this.vr *= -1;
            }
            for (let y = 0; y < this.#height; y += this.cellSize){
                for (let x = 0; x < this.#width; x += this.cellSize){
                    const angle = (Math.cos(x*.01) + Math.sin(y*.01))*this.radius;
                     this.#drawLine(angle,x, y);
                }
               
            }
            
            this.timer = 0;
        } else {
            this.timer += deltaTime;
        }
       
        
      
        flowfieldAnimation= requestAnimationFrame(this.animate.bind(this));
    }
}