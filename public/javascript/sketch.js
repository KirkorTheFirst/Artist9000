//false = pen equipped, true = eraser equipped
let eraser = false;
//the hexadecimal values for the paint color
let r = 0;
let g = 0;
let b = 0;
//background color in [R, G, B] format
const back = [255, 255 ,255];
//the canvas and width/height
let c;
let width;
let height;

//track mouse coordinates and distance between previous and current coordinates
let oldMouseX;
let oldMouseY;
let olddx;
let olddy;
let dx = 0;
let dy = 0;

//checks if you've already stopped moving your mouse nearby to prevent multiple points being added
let alreadyStopped = false;
//see if youre drawing a line on the canvas
let stroking = false;

//timer for when to record new points on the line
const recordTime = 50;
let recordTimer = recordTime;

/**
 * 3D array of our drawing in the format:
 * 
 * [
 *   [ //stroke 1
 *     [x1, x2, x3... ] //x coords of each point in order
 *     [y1, y2, y3... ] //y coords of each point in order
 *   ],
 *   [ //stroke 2
 *     [x1, x2, x3... ]
 *     [y1, y2, y3... ]
 *   ] ...
 * ]
 * 
 */
let strokes = new Array();
//also record number of strokes so far and number of points per stroke (will update if you are making a new stroke)
let numberStrokes = 0;
let numPoints = 0;

//thresholds for recording change in mouse coordinates (stopping and rapid directional change)
const stopThreshold = 0.1;
const changeThreshold = 12;

function setup() {
    //set up the canvas dynamically
    width = windowWidth * 0.7;
    height = windowHeight * 0.7;
    c = createCanvas(width, height)
    background(back[0], back[1], back[2]);
    c.parent('canvas')

    //equip the pencil
    equipPencil();

    //set up the "old" coordinates
    oldMouseX = mouseX;
    oldMouseY = mouseY;
    olddx = dx;
    olddy = dy;
}

function draw() {
    //draws a box in the top-right to view drawings in the dataset drawn with drawAvg()
    stroke(255, 0, 0);
    strokeWeight(1);
    line(0, 255, 255, 255);
    line(255, 0, 255, 255);
    strokeWeight(7);

    let rtn = false;

    //update mouse distance values
    olddx = dx;
    olddy = dy;
    dx = mouseX - oldMouseX;
    dy = mouseY - oldMouseY;

    if(mouseIsPressed) {

        //check to see if you draw with color or erase (aka draw with background color)
        if (eraser){
            stroke(back[0], back[1], back[2]);

        } else if (stroking) {

            //record when the mouse stops completely (or very close to it)
            let detectedStop = false;
            if (dx >= -stopThreshold && dx <= stopThreshold) {
                if (dy >= -stopThreshold && dy <= stopThreshold) {
                    detectedStop = true;
                    //if its already stopped before this (aka its been in the threshold before this) then dont update
                    if (!alreadyStopped) {
                        alreadyStopped = true;
                        recordTimer = recordTime;
                        record();
                    }
                }
            }
            if (!detectedStop) {
                //if the mouse has sped up past the threshold or the recording timer is less than 10 (you've gone a certain distance away) you can record again
                if (dx < -stopThreshold && dx > stopThreshold) {
                    if (dy < -stopThreshold && dy > stopThreshold) {
                        if (recordTimer < 30) alreadyStopped = false;
                    }
                }
                if (recordTimer < 10) alreadyStopped = false;
            }

            //check to see if you should record a point based on how far away you are from the last point (not time or velocity based)
            recordTimer -= (abs(dx) + abs(dy));
            if (recordTimer <= 0) {
                recordTimer = recordTime;
                record();
            }
            
            //also check if theres been a rapid change in the mouse velocity (aka you switch direction) and if so record a point
            if (abs(abs(olddx) - abs(dx)) > changeThreshold || abs(abs(olddy) - abs(dy)) > changeThreshold) {
                record();
                recordTimer = recordTime;
            }

            //finally, since we know you have the pencil tool equipped, set the color of the line to the chosen color
            stroke(r, g, b);
        }

        //draw a line and set the return to true
        line(mouseX, mouseY, pmouseX, pmouseY)
        rtn = true;
    }

    //finally update mouse coordinates
    oldMouseX = mouseX;
    oldMouseY = mouseY;

    return rtn;
}

function clearScreen(){
    //clear the canvas and reset background
    clear();
    background(back[0], back[1], back[2]);
    //reset values that may update to their default values
    numPoints = 0;
    numberStrokes = 0;
    strokes = [];
    recordTimer = recordTime;
    dx = 0;
    dy = 0;
    olddx = dx;
    olddy = dy;
}

function changeColor(newr, newg, newb){
    //changes the color of the pencil tool if its not the same color as the background (aka the eraser tool)
    if (newr !== back[0] && newg !== back[1] && newb !== back[2]){
        r = newr;
        g = newg;
        b = newb;
    }
}

function equipEraser(){
    //set the cursor and size of the brush to eraser format
    eraser = true;
    strokeWeight(20);
    cursor('resources/eraser.png')
}

function equipPencil(){
    //set the cursor and size of the brush to pencil format
    eraser = false;
    strokeWeight(7);
    cursor('resources/pencil.png')
}

function saveDrawing(prompt){
    //download the current canvas state and name it the prompt given to the user
    saveCanvas(c, prompt, "png")
}

function startStroke(){
    //start a stroke with the pencil tool on the canvas (check both of those conditions)
    if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height && !eraser){
        //make a new entry into the 3D array, record the starting point
        strokeWeight(7);
        strokes.push(new Array());
        strokes[numberStrokes][0] = new Array();
        strokes[numberStrokes][1] = new Array();
        record();
        stroking = true;
    }
}

function endStroke(){
    //end a stroke, given its already begun
    if (stroking && !eraser){
        //record the last point in this stroke and update values
        record();
        numberStrokes++;
        numPoints = 0;
        stroking = false;
    }
    
}

function record(){
    //records a point on a stroke into the 3D array

    //check if you're making a duplicate point (happens when certain events overlap)
    if (!(strokes[numberStrokes][0][numPoints - 1] == mouseX && strokes[numberStrokes][1][numPoints - 1] == mouseY)) {
        //make a new entry into the 3D array
        strokes[numberStrokes][0][numPoints] = mouseX;
        strokes[numberStrokes][1][numPoints] = mouseY;

        numPoints++;

        //draw a red dot where the point in (dev tool, will delete later)
        stroke(255, 0, 0);
        ellipse(mouseX, mouseY, 5, 5);
    }
}

function logStrokes(){
    //logs the 3D array into the console (dev tool, will delete later)
    console.log("strokes")
    console.log(strokes);
}

function getStrokes(){
    return strokes;
}

function drawAvg(strokes){
    //draws the averages of each stroke on the canvas by looping through the 3D array and connecting a straight line between every point
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

function drawBox(xmin, xmax, ymin, ymax){
    stroke(255, 0, 0);
    strokeWeight(1);
    line(xmin, ymin, xmax, ymin)
    line(xmin, ymin, xmin, ymax)
    line(xmin, ymax, xmax, ymax)
    line(xmax, ymin, xmax, ymax)
    stroke(0, 0, 0);
    strokeWeight(7);
}