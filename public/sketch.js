function setup() {
    let c = createCanvas(window.innerWidth, window.innerHeight);
    stroke(0, 0, 0);
    strokeWeight(15);
    c.parent('canvas');
  }
  
  function draw() {
      if(mouseIsPressed) {
          line(mouseX, mouseY, pmouseX, pmouseY);
      }
    return false;
  }