completeDataset = completeDataset.split('ß')
completeDataset.pop()
let jsonItems = {}
for(let i = 0; i < completeDataset.length; i++) {
    console.log(JSON.parse(completeDataset[i]))
}   
let heap = new Heap(function(a, b) {
    if(a < b) {
        return -1
    } else if (a === b) {
        return 0
    } else {
        return 1
    }
})
/**
 * @param {Array} drawing 3d array of our drawing
 * @returns heap of similar items sorted by similarity (%)
 */
function compare(drawing){

    let items = getItems();
    //then find the ones that are similar and how similar (%)
    let similarityMap = getSimilarity(items, drawing);
    //sort in heap
    return toHeap(similarityMap);
    
}

/**
 * gets all the items from the database and puts them in a map with each key pointing to an array of the images
 * @returns map of all item categories and an array of images that were recognized as true
 */
function getItems(){
    let items = new Map();
    return items;
}

function getSlopes(arr){
    let i = 0;
    let slopes = new Array();
    for (let stroke of arr){
      slopes.push(new Array());
      let currentSlope = 0;
      let temp = 0;
      for (let j = 0; j < stroke[0].length - 1; j++){
        let x = stroke[0][j];
        let y = stroke[1][j];


        let deltaX = (stroke[0][j + 1] - x);
        let deltaY = (stroke[1][j + 1] - y);
        if (deltaX == 0) deltaX = 1;
        if (deltaY == 0) deltaY = 1; 
        let tempSlope = deltaY/deltaX;

        if (currentSlope != 0){
            slopes[i].push(currentSlope);
            currentSlope = tempSlope;
        } else currentSlope = tempSlope;
        temp++;
      }
      if (slopes[i][slopes[i].length - 1] != currentSlope){
        slopes[i].push(currentSlope);
      }
      i++;
    }
    return slopes;
}

/**
 * compares our drawing to each items and ranks similarity
 * @param {MediaPositionState} items map of all item categories and an array of images
 * @param {Array} drawing the user-created drawing 3d array
 * @returns map of all items and their similarity to our drawing
 */
function getSimilarity(items, drawing){
    let similarityMap = new Map();
    return similarityMap;
}

/**
 * @param {Map} map of similar categories and its similarity value (%)
 * @returns sorted heap of items based on similarity
 */
function toHeap(map){

    return heap;
}

function getBoundingBox(drawing){
  //gets the min and max x and y values for all the points in your drawing
  let xmin = null;
  let xmax = null;
  let ymin = null;
  let ymax = null;
  for (let stroke2 of drawing){
    for (let i = 0; i < stroke2[0].length; i++){
      let x = stroke2[0][i]
      let y = stroke2[1][i]

      let set = false;

      if (xmin == null) { xmin = x; set = true; }
      if (xmax == null) { xmax = x; set = true; }
      if (ymin == null) { ymin = y; set = true; }
      if (ymax == null) { ymax = y; set = true; }

      if (!set){
        if (xmin > x) xmin = x; set = true;
        if (xmax < x) xmax = x; set = true;
        if (ymin > y) ymin = y; set = true;
        if (ymax < y) ymax = y; set = true;
      }

    }
  }
  //to make the box a perfect square, pick the dimensions based on which direction is traveled further (more x change or y change?)
  if (xmax - xmin > ymax - ymin){
    // //center the box so that the drawing is in the middle
    // for (let i = 0; i < (xmax - xmin)/ 2; i++){
    //   ymax++;
    //   ymin--;
    //   if (xmax - xmin <= ymax - ymin) break;
    // }
    ymax = ymin + (xmax - xmin)
  }
  else if (xmax - xmin <= ymax - ymin){
    // //center the box so that the drawing is in the middle
    // for (let i = 0; i < (ymax - ymin)/ 2; i++){
    //   xmax++;
    //   xmin--;
    //   if (xmax - xmin >= ymax - ymin) break;
    // }
    xmax = xmin + (ymax - ymin)
  }
  //draw the perfect square box
  drawBox(xmin, xmax, ymin, ymax)

  //return the bounds
  return [xmin, ymin, xmax, ymax]
}
