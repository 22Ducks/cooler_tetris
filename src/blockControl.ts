import { rotationCheck } from "./rotationCheck";
import { outerOffsets } from "./outerOffsets";
import { shapeChart, srs_chart } from "./constants";
import { innerOffsets } from "./innerOffsets";

export type BlockDef = {
  shape: string;
  rotation: number;
  centerPoint: [number, number];
}

export const calcBlockMovement = (event: string, gridArr: string[][], blockDef: BlockDef): BlockDef => {
  
  const {shape, rotation, centerPoint} = blockDef;
  const currentShape = shapeChart[shape as keyof typeof shapeChart][rotation];
  const {offsetTop, offsetLeft} = outerOffsets(currentShape);
  const offsets = innerOffsets(currentShape);

  if(event === "ArrowRight" && centerPoint[0] + offsets[1] < 10) {

    const isInvalid = currentShape.some((row, yIndex) => {
        return row.some((item, xIndex) => {
            const y = centerPoint[1] + yIndex + offsetTop;
            const x = centerPoint[0] + xIndex + offsetLeft;
            if(gridArr[y][x+1] === "[x]" && item === "o") {
              return true;
            }
        });
    });

    return isInvalid ? blockDef : {shape, rotation, centerPoint: [centerPoint[0]+1, centerPoint[1]]};

  }
  
  if(event === "ArrowLeft" && centerPoint[0] + offsets[0] > 0) {

    const isInvalid = currentShape.some((row, yIndex) => {
        return row.some((item, xIndex) => {
            const y = centerPoint[1] + yIndex + offsetTop;
            const x = centerPoint[0] + xIndex + offsetLeft;
            if(gridArr[y][x-1] === "[x]" && item === "o") { //checking pos post-shift
              return true;
            }
        });
    });

    return isInvalid ? blockDef : {shape, rotation, centerPoint: [centerPoint[0]-1, centerPoint[1]]};

  }
  
  if(event === "ArrowDown") {
    //deal with later
    return blockDef;
  }
  
  if(event.toLowerCase() === "z" || event.toLowerCase() === "x") { //prevent out-of-bounds
    const rotationIndex = event.toLowerCase() === "z" ? 0 : 1;

    const newRotation = event.toLowerCase() === "z" //todo: remove nested ternery
      ? (rotation - 1) >= 0 ? (rotation - 1) : shapeChart[shape as keyof typeof shapeChart].length - 1
      : (rotation + 1)%(shapeChart[shape as keyof typeof shapeChart].length);

    const rotationObject = srs_chart[shape as keyof typeof srs_chart][newRotation][rotationIndex];
    const rotatedShape = shapeChart[shape as keyof typeof srs_chart][newRotation];

    const shift = rotationCheck(gridArr, centerPoint, rotatedShape, rotationObject);

    return shift[0] !== 999 ? {shape, "rotation": newRotation, centerPoint: [centerPoint[0] + shift[0], centerPoint[1] + shift[1]]} : blockDef;
  }

  return blockDef;
}

export const quickDrop = (gridArr: string[][], blockDef: BlockDef) => {

  const {shape, rotation, centerPoint} = blockDef;
  const currentShape = shapeChart[shape as keyof typeof shapeChart][rotation];

  const {offsetTop, offsetLeft} = outerOffsets(currentShape);
  const offsets = innerOffsets(currentShape);

  const bottom_blocks = new Array(currentShape[0].length).fill(-1);

  for(let y=currentShape.length-1; y>=0; y--) { //find lowest point in each x pos
    for(let x=0; x<bottom_blocks.length; x++) {
      if(currentShape[y][x] === "o" && bottom_blocks[x] < y) {
        bottom_blocks[x] = y;
      }
    }
    if(bottom_blocks.every(item => item > -1)) {
      break;
    }
  }

  let downShift = 0;
  let falling = true;

  console.log(bottom_blocks);

  while(falling) {
    if(centerPoint[1] + Math.max(...bottom_blocks) + offsetTop + downShift === 19) {
      falling = false;
    }else{
      bottom_blocks.forEach((yIndex, xIndex) => {
        if(yIndex > -1){
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

  const newGrid = structuredClone(gridArr);

  currentShape.forEach((row, yIndex) => {
    row.forEach((_item, xIndex) => {
      const y = centerPoint[1] + yIndex + offsetTop + downShift;
      const x = centerPoint[0] + xIndex + offsetLeft;
      console.log({centerPoint, xIndex, offsets});
      if(x >= 0 && y >= 0 && currentShape[yIndex][xIndex] !== "") {
        newGrid[y][x] = "[x]";
      }
    });
  });

  return newGrid;
}

// export const blockControl = (event: string, gridArr: string[][], setGridArr: ((gridArr: string[][]) => void),
//                             shape: React.RefObject<string>, rotation: React.RefObject<number>, centerPoint: number[]) => {

//   //event can either be key press or moving down on timer
//   //rotation updates
//   const prev_rotation = rotation.current;
//   if(event.toLowerCase() === "z") {
//     rotation.current = (rotation.current - 1) >= 0 ? (rotation.current - 1) : shapeChart[shape.current as keyof typeof shapeChart].length - 1;
//   } else if(event.toLowerCase() === "x") {
//     rotation.current = (rotation.current + 1)%(shapeChart[shape.current as keyof typeof shapeChart].length);
//   }
  
//   let currentShape = shapeChart[shape.current as keyof typeof shapeChart][rotation.current];
//   const newGrid = structuredClone(gridArr);

//   const {offsetTop, offsetLeft} = outerOffsets(currentShape);

//   const offsets = innerOffsets(currentShape);
  
//   if(event === "ArrowRight" && centerPoint[0] + offsets[1] < 10) {

//     let isValid = true;

//     currentShape.some((row, yIndex) => {
//         return row.some((item, xIndex) => {
//             const y = centerPoint[1] + yIndex + offsetTop;
//             const x = centerPoint[0] + xIndex + offsetLeft;
//             if(gridArr[y][x+1] === "[x]" && item === "o") {
//               isValid = false;
//               return true;
//             }
//         });
//     });

//     if(isValid) {
//       centerPoint[0]++;
//     }
//   }else if(event === "ArrowLeft" && centerPoint[0] + offsets[0] > 0) {
//     let isValid = true;

//     currentShape.some((row, yIndex) => {
//         return row.some((item, xIndex) => {
//             const y = centerPoint[1] + yIndex + offsetTop;
//             const x = centerPoint[0] + xIndex + offsetLeft;
//             if(gridArr[y][x-1] === "[x]" && item === "o") { //checking pos post-shift
//               isValid = false;
//               return true;
//             }
//         });
//     });

//     if(isValid) {
//       centerPoint[0]--;
//     }
//   }else if(event === "ArrowDown") {
//     //deal with later
//   }else if(event === " ") {
//     const bottom_blocks = new Array(currentShape[0].length).fill(-1);

//     for(let y=currentShape.length-1; y>=0; y--) { //find lowest point in each x pos
//       for(let x=0; x<bottom_blocks.length; x++) {
//         if(currentShape[y][x] === "o" && bottom_blocks[x] < y) {
//           bottom_blocks[x] = y;
//         }
//       }
//       if(bottom_blocks.every(item => item > -1)) {
//         break;
//       }
//     }

//     let downShift = 0;
//     let falling = true;

//     console.log(bottom_blocks);

//     while(falling) {
//       if(centerPoint[1] + Math.max(...bottom_blocks) + offsetTop + downShift === 19) {
//         console.log("bottom of board");
//         console.log(Math.max(...bottom_blocks));
//         falling = false;
//       }else{
//         bottom_blocks.forEach((yIndex, xIndex) => {
//           if(yIndex > -1){
//             //console.log(centerPoint[1] + offsetTop + yIndex + downShift + 1);
//             if(gridArr[centerPoint[1] + offsetTop + yIndex + downShift + 1][centerPoint[0] + offsetLeft + xIndex] === "[x]") {
//               falling = false;
//             }
//           }
//         });
//         if(falling) {
//           downShift++;
//         }
//       }
//     }
 
//     currentShape.forEach((row, yIndex) => {
//       row.forEach((_item, xIndex) => {
//         const y = centerPoint[1] + yIndex + offsetTop + downShift;
//         const x = centerPoint[0] + xIndex + offsetLeft;
//         console.log({centerPoint, xIndex, offsets});
//         if(x >= 0 && y >= 0 && currentShape[yIndex][xIndex] !== "") {
//           newGrid[y][x] = "[x]";
//           console.log({x, y});
//         }
//       });
//     });

//   }else if(event.toLowerCase() === "z" || event.toLowerCase() === "x") { //prevent out-of-bounds
//     let rotationObject;

//     if(event.toLowerCase() === "z") {
//       rotationObject = srs_chart[shape.current as keyof typeof srs_chart][rotation.current][0];
//     } else{
//       rotationObject = srs_chart[shape.current as keyof typeof srs_chart][rotation.current][1];
//     }

//     const shift = rotationCheck(gridArr, centerPoint, currentShape, rotationObject);

//     if(shift[0] === 999) { //rotation failed
//       rotation.current = prev_rotation;
//       currentShape = shapeChart[shape.current as keyof typeof shapeChart][rotation.current];
//     }else {
//       centerPoint[0] += shift[0];
//       centerPoint[1] += shift[1];
//     }
//   }

//   // updateActiveBlock(centerPoint, currentShape, newGrid, setGridArr);
// }