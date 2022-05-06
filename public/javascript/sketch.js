//p5js functions:

//false = pen equipped, true = eraser equipped
let eraser = false;
let r = 0;
let g = 0;
let b = 0;
let back = [255, 255 ,255];
let c;
let width;
let height;

let oldMouseX;
let oldMouseY;
let dx = 0;
let dy = 0;

let alreadyStopped = false;
let stroking = false;

const recordTime = 50;
let recordTimer = recordTime;

let strokes = new Array();
let numberStrokes = 0;
let numPoints = 0;

function setup() {
    width = windowWidth * 0.7;
    height = windowHeight * 0.7;
    c = createCanvas(width, height)
    background(back[0], back[1], back[2]);
    c.parent('canvas')
    equipPencil();

    oldMouseX = mouseX;
    oldMouseY = mouseY;
}
function draw() {
    let rtn = false;

    dx = abs(mouseX - oldMouseX);
    dy = abs(mouseY - oldMouseY);

    if(mouseIsPressed && stroking) {
        //record when the mouse stops completely
        let threshold = 0;
        let detectedStop = false;
        if (dx >= -threshold && dx <= threshold){
            if (dy >= -threshold && dy <= threshold){
                detectedStop = true;
                if (!alreadyStopped){
                    alreadyStopped = true;
                    record();
                }
            }
        }
        if (!detectedStop){
            alreadyStopped = false;
        }

        //check to see if you draw with color or erase (aka draw with background color)
        if (eraser){
            stroke(back[0], back[1], back[2]);

        } else{
            stroke(r, g, b);
        }
        
        line(mouseX, mouseY, pmouseX, pmouseY)
        rtn = true;

        //check to see if you should record a point
        if (stroking) {
            recordTimer -= Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
            if (recordTimer <= 0){
                recordTimer = recordTime;
                record();
            }
        }
    }

    oldMouseX = mouseX;
    oldMouseY = mouseY;
    return rtn;
}

function clearScreen(){
    clear();
    background(back[0], back[1], back[2]);
    //TODO: empty array here
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

function startStroke(){
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height){
        strokes.push(new Array());
        strokes[numberStrokes][0] = new Array();
        strokes[numberStrokes][1] = new Array();
        stroking = true;
        recordTimer = recordTime;
    }
}

function endStroke(){
    if (stroking){
        record();
        numberStrokes++;
        numPoints = 0;
        stroking = false;
    }
    
}

function record(){
        strokes[numberStrokes][0][numPoints] = Math.floor(mouseX);
        strokes[numberStrokes][1][numPoints] = Math.floor(mouseY);
        numPoints++;

        stroke(255, 0, 0);
        ellipse(mouseX, mouseY, 5, 5);
}

function logStrokes(){
    console.log(strokes);
}

function getStrokes(){
    return strokes;
}