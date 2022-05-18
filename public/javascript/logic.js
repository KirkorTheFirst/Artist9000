//parse the dataset to an array
completeDataset = completeDataset.split('ß')
completeDataset.pop()
let jsonItems = {}
let accuracy;
let algorithmRunning = false;

//dynamically add the prompts based on the json dataset (so that we can add/remove easily!)
let prompts = [];
for (let i = 0; i < completeDataset.length; i++){
  let json = JSON.parse(completeDataset[i]);
  if (!prompts.includes(json.word)) prompts.push(json.word);
}

//comparator is a min heap
let heap = new Heap(function(a, b) {
    if(a[1] < b[1]) {
        return -1
    } else if (a[1] === b[1]) {
        return 0
    } else {
        return 1
    }
})

const datasetBoxWidth = 512;

/**
 * @param {Array} drawing 3d array of our drawing
 * @param {Array} colors 2d array of rgb values per stroke (in order)
 * @returns 2D array of top 10 guesses and its similarity (in order)
 */
function compare(drawing, ctx){
  algorithmRunning = true;
    let map = getSimilarity(drawing, ctx);
    heap = toHeap(map);
    return toArray(heap);
}

/**
 * gets the top 10 guesses and returns them in a 2d array format
 * [
 *   [prompt guess #1, similarity %],
 *   [prompt guess #2, similarity %],
 *   ...
 * ]
 * @param {Heap} tempHeap 
 * @returns 2D array of top 10 guesses
 */
function toArray(tempHeap){
  let rtn = new Array();
  for (let i = 1; i <= prompts.length; i++){
    let arr = tempHeap.pop();
    //re-convert to positive values
    arr[1] *= -1;
    rtn.push([arr[0], arr[1]]);
  }
  return rtn;
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
 * @param {CanvasRenderingContext2D} ctx 2D context of canvas
 * @param {Array} colors 2D array of the RGB used per stroke (in order)
 * @returns map of all items and their similarity to our drawing
 */
function getSimilarity(drawing, ctx, colors){
    let similarityMap = new Map();
    const totalPX = datasetBoxWidth*datasetBoxWidth;
    let userImgData = getDrawingData(drawing, ctx, colors);

    //make all the entries into the map
    for (let prompt of prompts){
      similarityMap.set(prompt, 0);
    }

    for (let i = 0; i < completeDataset.length; i+=accuracy){
      //first record the JSON you're on (you use it a lot)
      let json = JSON.parse(completeDataset[i])
      
      //we only wanna analyze the drawing if it actually fits the category, i.e. it was recognized
      if (json.recognized) {
        //set a value for the similarity to this drawing
        let tempSimilarity = totalPX;
        //first get the image data
        let datasetImgData = getDrawingData(json.drawing, ctx, null)

        //loop through every pixel
        for (let i = 0; i < datasetImgData.length; i++) {

          if (datasetImgData[i] != userImgData[i]) {
            tempSimilarity--; //take 2 "points" away because its 2 different values
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

    
    let chosenPrompt = sessionStorage.getItem("prompt")
    const booster = 5; //boost the algorithm's confidence in the correct prompt by +x%

    //finally convert them all to percentages rounded to 2 decimal points so that they can be compared to each other
    for (let key of prompts){
      let finalSimilarity = getPercentage(similarityMap.get(key), totalPX);
      similarityMap.delete(key);
      similarityMap.set(key, finalSimilarity);

      //give the algorithm a lil nudge in the right direction cough cough nudge nudge
      
      if (chosenPrompt == key){
        let alteredSimilarity = similarityMap.get(chosenPrompt) + booster;
        if (alteredSimilarity > 100) alteredSimilarity = 99.99; //idk its funnier if we never admit they actually got it spot on
        similarityMap.delete(chosenPrompt);
        similarityMap.set(chosenPrompt, alteredSimilarity);
      }

    }

    return similarityMap;
}

/**
 * @param {Map} map of similar categories and its similarity value (%)
 * @returns sorted heap of items based on similarity
 */
function toHeap(map){
    //remember the heap is a MIN-HEAP so make all similarities negative
    for (let prompt of prompts){
      //the data is prompt, negative similarity
      let data = [prompt, (map.get(prompt)) * -1];
      heap.push(data);
    }
    return heap;
}

/**
 * gets the coordinates for a square bounding box containing all of the points in the drawing
 * @param {Array} drawing 3D array of coordinates representing the drawing
 * @returns array containing the xmin, xmax, ymin and ymax values
 */
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
    ymax = ymin + (xmax - xmin)
  }
  else if (xmax - xmin <= ymax - ymin){
    xmax = xmin + (ymax - ymin)
  }
  //scale up if the box is too small
  if (xmax - xmin <= 255){
    ymax = ymin + 255;
    xmax = xmin + 255;
  }

  //return the bounds
  return [xmin, ymin, xmax, ymax]
}

/**
 * gets the image data for a 256x256 image
 * @param {Array} drawing 3D array of drawing translated to a 256x256 space
 * @param {CanvasRenderingContext2D} ctx 2D context of canvas
 * @param {Array} colors 2D array of colors used in strokes (since dataset has no color, if colors = null then only use black)
 * @returns boolean array of image data (true = background, false = not background)
 */
function getDrawingData(drawing, ctx, colors){
  //first clear the top-left 255x255 space of anything (make it all white for now)
  let clearData = ctx.getImageData(0, 0, datasetBoxWidth, datasetBoxWidth);
  //the data comes in the format RGBA, so every 4 entries represents 1 px
  for (let i = 0; i < clearData.data.length; i += 4){
    //rgb of background
    clearData[i] = back[0];
    clearData[i + 1] = back[1];
    clearData[i + 2] = back[2];
    //A (alpha) = 255 means fully opaque (fully visible)
    clearData[i + 3] = 255;
  }
  ctx.putImageData(clearData, 0, 0);

  //draw the drawing in and get the image data for that space
  drawAvg(drawing, colors);
  let rtn = ctx.getImageData(0, 0, datasetBoxWidth, datasetBoxWidth).data;
  let rtn2 = new Array();
  //convert to boolean array
  const lightnessThreshold = (back[0] + back[1] + back[2]) / 6;
  for (let i = 0; i < rtn.length; i += 4){
    let r = rtn[i]
    let g = rtn[i + 1]
    let b = rtn[i + 2]
    let a = rtn[i + 3]
    if (r == back[0] && g == back[1] && b == back[2]){
      rtn2.push(true);
    } else {
      //check if the pixel is a "lighter" or "darker" color

      let hsp = getHSP(r, g, b);

      if (hsp > lightnessThreshold){
        //it is light
        rtn2.push(true);
      } else {
        //it is dark
        rtn2.push(false);
      }
      
    }
  }
  ctx.putImageData(clearData, 0, 0);

  //return array
  return rtn2;

}

/**
 * get HSP (hue-saturation-percieved brightness), like a black-and-white value for how bright the color is
 * @param {Number} r red value of color
 * @param {Number} g green value of color
 * @param {Number} b blue value of color
 * @returns HSP value for that color
 */
function getHSP(r, g, b){
  
  //concept, equation, constants from http://alienryderflex.com/hsp.html
  //these are the degrees to which your eye processes each color (as percentages which add up to 1, or 100%) 
  const r_perception = 0.299;
  const g_perception = 0.587;
  const b_perception = 0.114;
  let hsp = Math.sqrt(
    r_perception * (r * r) +
    g_perception * (g * g) +
    b_perception * (b * b)
  );
  return hsp;
}