//p5js functions:

//false = pen equipped, true = eraser equipped
let eraser = false;
let r = 0;
let g = 0;
let b = 0;

function setup() {
    let c = createCanvas(900, 600)
    c.parent('canvas')
    equipPencil();
}
function draw() {
    if(mouseIsPressed) {
        if (eraser){
            stroke(255, 255, 255);
        } else{
            stroke(r, g, b);
        }
        
        line(mouseX, mouseY, pmouseX, pmouseY)
    }
    return false
}

function clearScreen(){
    clear();
}

function changeColor(newr, newg, newb){
    if (newr !== 0 && newg !== 0 && newb !== 0){
        r = newr;
        g = newg;
        b = newb;
    }
}

function equipEraser(){
    eraser = true;
    strokeWeight(20);
    cursor('resources/eraser.png')
}

function equipPencil(){
    eraser = false;
    strokeWeight(7);
    cursor('resources/pencil.png')
}