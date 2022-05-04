//false = pen equipped, true = eraser equipped
let eraser = false;
let r = 0;
let g = 0;
let b = 0;
let c;

let back = [255, 255 ,255];

function setup() {
    c = createCanvas(windowWidth * 0.7, windowHeight * 0.7 )
    background(back[0], back[1], back[2]);
    c.parent('canvas')
    equipPencil();

    oldMouseX = mouseX;
    oldMousY = mouseY;
}
function draw() {
    if(mouseIsPressed) {

        if (eraser){
            stroke(back[0], back[1], back[2]);

        } else{
            stroke(r, g, b);
        }
        
        line(mouseX, mouseY, pmouseX, pmouseY)
    }
    return false
}

function clearScreen(){
    clear();
    background(back[0], back[1], back[2]);
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

function saveDrawing(prompt){
    saveCanvas(c, prompt, "png")
}