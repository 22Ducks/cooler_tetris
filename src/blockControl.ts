import { block } from "./block";
import { rotationCheck } from "./rotationCheck";

export const blockControl = (event: string, gridArr: string[][], setGridArr: React.Dispatch<React.SetStateAction<string[][]>>,
                            shape: React.RefObject<string>, rotation: React.RefObject<number>, centerPoint: number[]) => {

  //event can either be key press or moving down on timer

  const shapeChart = {
    O: [[["", "o", "o", ""],
          ["", "o", "o", ""],
          ["", "", "", ""]]],
        
    I: [[["", "o", "", ""],
          ["", "o", "", ""],
          ["", "o", "", ""],
          ["", "o", "", ""]],
        [["", "", "", ""],
          ["o", "o", "o", "o"],
          ["", "", "", ""],
          ["", "", "", ""]],
        [["", "", "o", ""],
          ["", "", "o", ""],
          ["", "", "o", ""],
          ["", "", "o", ""]],
        [["", "", "", ""],
          ["", "", "", ""],
          ["o", "o", "o", "o"],
          ["", "", "", ""]]],

    S: [[["", "o", "o"],
          ["o", "o", ""],
          ["", "", ""]],
        [["", "o", ""],
          ["", "o", "o"],
          ["", "", "o"]],
        [["", "", ""],
          ["", "o", "o"],
          ["o", "o", ""]],
        [["o", "", ""],
          ["o", "o", ""],
          ["", "o", ""]]],

    Z: [[["o", "o", ""],
          ["", "o", "o"],
          ["", "", ""]],
        [["", "", "o"],
          ["", "o", "o"],
          ["", "o", ""]],
        [["", "", ""],
          ["o", "o", ""],
          ["", "o", "o"]],
        [["", "o", ""],
          ["o", "o", ""],
          ["o", "", ""]]],

    L: [[["", "", "o"],
          ["o", "o", "o"],
          ["", "", ""]],
        [["", "o", ""],
          ["", "o", ""],
          ["", "o", "o"]],
        [["", "", ""],
          ["o", "o", "o"],
          ["o", "", ""]],
        [["o", "o", ""],
          ["", "o", ""],
          ["", "o", ""]]],

    J: [[["o", "", ""],
          ["o", "o", "o"],
          ["", "", ""]],
        [["", "o", "o"],
          ["", "o", ""],
          ["", "o", ""]],
        [["", "", ""],
          ["o", "o", "o"],
          ["", "", "o"]],
        [["", "o", ""],
          ["", "o", ""],
          ["o", "o", ""]]],
          
    T: [[["", "o", ""],
          ["o", "o", "o"],
          ["", "", ""]],
        [["", "o", ""],
          ["", "o", "o"],
          ["", "o", ""]],
          [["", "", ""],
          ["o", "o", "o"],
          ["", "o", ""]],
          [["", "o", ""],
          ["o", "o", ""],
          ["", "o", ""]]],
  };

  const srs_chart = {
    I: [[
          [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]], [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]]
        ],
        [
          [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]], [[0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]]
        ],
        [
          [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]], [[0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]]
        ],
        [
          [[0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]], [[0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]]
        ]],

    S: [[
          [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]]
        ],
        [
          [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]]
        ],
        [
          [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]]
        ],
        [
          [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]
        ]],

    Z: [[
          [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]]
        ],
        [
          [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]]
        ],
        [
          [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]]
        ],
        [
          [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]
        ]],

    L: [[
          [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]]
        ],
        [
          [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]
        ],
        [
          [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]]
        ],
        [
          [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]
        ]],

    J: [[
          [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]]
        ],
        [
          [[0, 0], [1, 0], [1, 1], [0, -2], [1, -2]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]
        ],
        [
          [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]]
        ],
        [
          [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]], [[0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]]
        ]],

    T: [[
          [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]], [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]]
        ],
        [
          [[0, 0], [1, 0], [1, 1], [0 -2], [1, -2]], [[0, 0], [1, 0], [1, 1], [0 -2], [1, -2]]
        ],
        [
          [[0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]], [[0, 0], [1, 0], [1, -1], [0, 2], [1, 2]]
        ],
        [
          [[0, 0], [-1, 0], [-1, 1], [0 -2], [-1, -2]], [[0, 0], [-1, 0], [-1, 1], [0 -2], [-1, -2]]
        ]],
  };

  //rotation updates
  const prev_rotation = rotation.current;
  if(event.toLowerCase() === "z") {
    rotation.current = (rotation.current - 1) >= 0 ? (rotation.current - 1) : shapeChart[shape.current as keyof typeof shapeChart].length - 1;
  } else if(event.toLowerCase() === "x") {
    rotation.current = (rotation.current + 1)%(shapeChart[shape.current as keyof typeof shapeChart].length);
  }
  
  let currentShape = shapeChart[shape.current as keyof typeof shapeChart][rotation.current];
  const newGrid = structuredClone(gridArr);

  const shapeCenter = Math.floor(currentShape[0].length/2);
  const shapeEdges = [3, 0]; //default to both extremes

  currentShape.forEach((row) => {
    const tempL = row.indexOf("o");
    const tempR = row.lastIndexOf("o");

    shapeEdges[0] = (tempL >= 0 && tempL < shapeEdges[0]) ? tempL : shapeEdges[0];
    shapeEdges[1] = tempR > shapeEdges[1] ? tempR : shapeEdges[1];
  });

  const offsets = [shapeEdges[0] - shapeCenter, shapeEdges[1] + 1 - shapeCenter];
  
  if(event === "ArrowRight" && centerPoint[0] + offsets[1] < 10) {
    centerPoint[0]++;
  }else if(event === "ArrowLeft" && centerPoint[0] + offsets[0] > 0) {
    centerPoint[0]--;
  }else if(event === "ArrowDown") {
    //deal with later
  }else if(event === " ") {
    console.log("spacebar");
    const bottom_blocks = new Array(currentShape[0].length).fill(-1);
    const offsetTop = currentShape.length%2 === 0 ? -2 : -1;
    const offsetLeft = currentShape[0].length%2 === 0 ? -2 : -1;

    for(let y=currentShape.length-1; y>=0; y--) { //find lowest point in each x pos
      for(let x=0; x<bottom_blocks.length; x++) {
        if(currentShape[y][x] === "o") {
          bottom_blocks[x] = y;
        }
      }
      if(bottom_blocks.every(item => item > -1)) {
        break;
      }
    }

    let downShift = 0;
    let falling = true;

    while(falling) {
      //console.log(Math.max(...bottom_blocks));
      if(centerPoint[1] + Math.max(...bottom_blocks) + offsetTop + downShift === 19) { //failing to enter this statement...
        //console.log("bottom of board");
        falling = false;
      }else{
        bottom_blocks.forEach((yIndex, xIndex) => {
          if(yIndex > -1){
            //console.log(centerPoint[1] + offsetTop + yIndex + downShift + 1);
            if(gridArr[centerPoint[1] + offsetTop + yIndex + downShift + 1][centerPoint[0] + offsetLeft + xIndex] === "[x]") {
              falling = false;
            }
          }
        });
        if(falling) {
          downShift++;
        }
      }
    }
 
    currentShape.forEach((row, yIndex) => {
      row.forEach((item, xIndex) => {
        const y = centerPoint[1] + yIndex + offsetTop + downShift;
        const x = centerPoint[0] + xIndex + offsetLeft;
        if(x >= 0 && y >= 0 && currentShape[yIndex][xIndex] !== "") {
          newGrid[y][x] = "[x]";
        }
      });
    });

  }else if(event.toLowerCase() === "z" || event.toLowerCase() === "x") { //prevent out-of-bounds
    let rotationObject;

    if(event.toLowerCase() === "z") {
      rotationObject = srs_chart[shape.current as keyof typeof srs_chart][rotation.current][0];
    } else{
      rotationObject = srs_chart[shape.current as keyof typeof srs_chart][rotation.current][1];
    }

    const shift = rotationCheck(gridArr, centerPoint, currentShape, offsets, rotationObject);

    if(shift[0] === 999) { //rotation failed
      rotation.current = prev_rotation;
      currentShape = shapeChart[shape.current as keyof typeof shapeChart][rotation.current];
    }else {
      centerPoint[0] += shift[0];
      centerPoint[1] += shift[1];
    }
  }

  block(centerPoint, currentShape, newGrid, setGridArr);
}