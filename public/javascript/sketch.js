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

const recordTime = 100;
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

    dx = mouseX - oldMouseX;
    dy = mouseY - oldMouseY;

    if(mouseIsPressed) {

        //check to see if you draw with color or erase (aka draw with background color)
        if (eraser){
            stroke(back[0], back[1], back[2]);

        } else if (stroking) {

            //record when the mouse stops completely
            let stopThreshold = 0.1;
            let detectedStop = false;
            if (dx >= -stopThreshold && dx <= stopThreshold) {
                if (dy >= -stopThreshold && dy <= stopThreshold) {
                    detectedStop = true;
                    if (!alreadyStopped) {
                        alreadyStopped = true;
                        recordTimer = recordTime;
                        record();
                    }
                }
            }
            if (!detectedStop) {
                if (dx < -stopThreshold && dx > stopThreshold) {
                    if (dy < -stopThreshold && dy > stopThreshold) {
                        if (recordTimer < 30) alreadyStopped = false;
                    }
                }
                if (recordTimer < 10) alreadyStopped = false;
            }

            //check to see if you should record a point
            //TODO: find a reliable way thats not time based!
            recordTimer -= (abs(dx) + abs(dy));
            if (recordTimer <= 0) {
                recordTimer = recordTime;
                record();
            }

            stroke(r, g, b);
        }

        line(mouseX, mouseY, pmouseX, pmouseY)
        rtn = true;
    }

    oldMouseX = mouseX;
    oldMouseY = mouseY;
    return rtn;
}

function clearScreen(){
    clear();
    background(back[0], back[1], back[2]);
    numPoints = 0;
    numberStrokes = 0;
    strokes = [];
    recordTimer = recordTime;
    dx = 0;
    dy = 0;
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
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height && !eraser){
        strokeWeight(7);
        strokes.push(new Array());
        strokes[numberStrokes][0] = new Array();
        strokes[numberStrokes][1] = new Array();
        record();
        stroking = true;
        recordTimer = 0;
    }
}

function endStroke(){
    if (stroking && !eraser){
        record();
        numberStrokes++;
        numPoints = 0;
        stroking = false;
    }
    
}

function record(){
        strokes[numberStrokes][0][numPoints] = mouseX;
        strokes[numberStrokes][1][numPoints] = mouseY;
        numPoints++;

        lastRecordedPoint = [mouseX, mouseY];
        stroke(255, 0, 0);
        ellipse(mouseX, mouseY, 5, 5);
}

function logStrokes(){
    console.log("strokes")
    console.log(strokes);
}

function getStrokes(){
    return strokes;
}

function drawAvg(strokes){
    for (let stroke2 of strokes){
        let prevX;
        let prevY;
        stroke(255, 0, 0);
        for (let i = 0; i < stroke2[0].length; i++){
            let x = stroke2[0][i];
            let y = stroke2[1][i];
            if (i == 0){
                prevX = x;
                prevY = y;
            } else {
                line(prevX, prevY, x, y);
                prevX = x;
                prevY = y;
            }
        }
    }
}