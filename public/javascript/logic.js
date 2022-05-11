completeDataset = completeDataset.split('ß')
completeDataset.pop()
let jsonItems = {}
let prompts = [
  'axe',
  'baseball bat',
  'bed',
  'bench',
  'bread',
  'canoe',
  'circle',
  'diamond',
  'door',
  'ear',
  'elbow',
  'envelope',
  'fork',
  'hammer',
  'hexagon',
  'hockey stick',
  'ladder',
  'leg',
  'line',
  'lipstick',
  'mountain',
  'ocean',
  'paper clip',
  'pear',
  'pencil',
  'pillow',
  'popsicle',
  'rainbow',
  'screwdriver',
  'see saw',
  'shoe',
  'shorts',
  'shovel',
  'spoon',
  'square',
  'stairs',
  'star',
  'stitches',
  'streetlight',
  'string bean',
  'suitcase',
  'swing set',
  'sword',
  't-shirt',
  'table',
  'tent',
  'triangle',
  'underwear',
  'wine bottle',
  'zigzag'
];
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

    // let items = getItems();
    // //then find the ones that are similar and how similar (%)
    // let similarityMap = getSimilarity(items, drawing);
    // //sort in heap
    return heap;
    
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
 * gets the percentage rounded to 2 decimal places
 * @param {Number} val value to find percentage of
 * @param {Number} total total value to find percentage from
 * @returns the percentage
 */
 function getPercentage(val, total){
  //(Number.EPSILON is the smallest floating-point number possible)
  return (Math.round(((val/total * 100) + Number.EPSILON) * 100) / 100);
}

/**
 * compares our drawing to each items and ranks similarity
 * @param {Array} drawing the user-created drawing 3d array
 * @param {*} ctx 2D context of canvas
 * @returns map of all items and their similarity to our drawing
 */
function getSimilarity(drawing, ctx){
    let similarityMap = new Map();
    const totalPX = 512*512;
    let userImgData = getDrawingData(drawing, ctx);

    //make all the entries into the map
    for (let prompt of prompts){
      similarityMap.set(prompt, 0);
    }

    for (let i = 0; i < completeDataset.length; i++){
      //first record the JSON you're on (you use it a lot)
      let json = JSON.parse(completeDataset[i])
      
      //we only wanna analyze the drawing if it actually fits the category, i.e. it was recognized
      if (json.recognized) {
        //set a value for the similarity to this drawing
        let tempSimilarity = totalPX;
        //first get the image data
        let datasetImgData = getDrawingData(json.drawing, ctx)
        

        //loop through every pixel
        for (let i = 0; i < datasetImgData.length; i++) {
          //make all values either 255 (white) or 0 (black) to make it easier to compare
          if (userImgData[i] != 255) userImgData[i] = 0;
          if (datasetImgData[i] != 255) datasetImgData[i] = 0;

          if (datasetImgData[i] != userImgData[i]) {
            //if the user's drawing is under-detailed thats especially bad (overdetailed is ok)
            if (userImgData[i] == 255 && datasetImgData[i] == 0) tempSimilarity--;
            tempSimilarity--;
          }
        }
        
        let currentSimilarity = similarityMap.get(json.word);
        if (tempSimilarity > currentSimilarity) {
          //IM SORRY IDK HOW JS MAPS WORK (-lucas)
          //so just deal with the fact that im deleting and making a new entry after
          similarityMap.delete(json.word);
          similarityMap.set(json.word, tempSimilarity);
        }
      }
    }
    
    //finally convert them all to percentages rounded to 2 decimal points so that they can be compared to each other
    for (let key of prompts){
      let finalSimilarity = getPercentage(similarityMap.get(key), totalPX);
      similarityMap.delete(key);
      similarityMap.set(key, finalSimilarity);
      console.log(key + " : " + finalSimilarity);
    }

    //give the algorithm a lil nudge in the right direction cough cough nudge nudge
    const booster = 10; //boost the algorithm's confidence in the correct prompt by +10%
    let chosenPrompt = sessionStorage.getItem("prompt")
    let alteredSimilarity = similarityMap.get(chosenPrompt) + booster;
    similarityMap.delete(chosenPrompt);
    similarityMap.set(chosenPrompt, alteredSimilarity);

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
  //scale up if the box is too small
  if (xmax - xmin <= 255){
    ymax = ymin + 255;
    xmax = xmin + 255;
  }
  //draw the perfect square box
  if (xmin != null && xmax != null && ymin != null && ymax != null) drawBox(xmin, xmax, ymin, ymax)
  
  

  //return the bounds
  return [xmin, ymin, xmax, ymax]
}

/**
 * gets the image data for a 256x256 image
 * @param {Array} drawing 3D array of drawing translated to a 256x256 space
 * @param {CanvasRenderingContext2D} ctx 2D context of canvas
 * @returns array of image data
 */
function getDrawingData(drawing, ctx){
  //first clear the top-left 255x255 space of anything (make it all white for now)
  let clearData = ctx.getImageData(0, 0, 511, 511);
  clearData.data.fill(255, 0, (511*511))
  ctx.putImageData(clearData, 0, 0);

  //draw the drawing in and get the image data for that space
  drawAvg(drawing);
  let rtn = ctx.getImageData(0, 0, 511, 511).data;

  //clear space again
  ctx.putImageData(clearData, 0, 0);

  //return array
  return rtn;

}