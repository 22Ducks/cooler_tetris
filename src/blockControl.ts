import { block } from "./block";

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

  //rotation updates
  if(event.toLowerCase() === "z") {
    rotation.current = (rotation.current - 1) >= 0 ? (rotation.current - 1) : shapeChart[shape.current as keyof typeof shapeChart].length - 1;
  } else if(event.toLowerCase() === "x") {
    rotation.current = (rotation.current + 1)%(shapeChart[shape.current as keyof typeof shapeChart].length);
  }
  
  const currentShape = shapeChart[shape.current as keyof typeof shapeChart][rotation.current];

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
  }else if(event.toLowerCase() === "z" || event.toLowerCase() === "x") { //prevent out-of-bounds
    //out-of-bounds left check
    while(centerPoint[0] + offsets[0] < 0) {
      centerPoint[0]++;
    }
    //out-of-bounds right check
    while(centerPoint[0] + offsets[1] > 10) {
      centerPoint[0]--;
    }

    //overlap with already set blocks, use SRS method
  }

  block(centerPoint, currentShape, gridArr, setGridArr);
}