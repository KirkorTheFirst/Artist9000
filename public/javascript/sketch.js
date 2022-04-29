//p5js functions:
function setup() {
    let c = createCanvas(windowWidth, windowHeight)
    background(220)
    stroke(0, 0, 0)
    strokeWeight(7)
    c.parent('canvas')
}
function draw() {
    if(mouseIsPressed) {
        line(mouseX, mouseY, pmouseX, pmouseY)
    }
    return false
}
