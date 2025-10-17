import { rotationCheck } from "./rotationCheck";
import { outerOffsets } from "./outerOffsets";
import { shapeChart, srs_chart } from "./constants";
import { innerOffsets } from "./innerOffsets";
import * as R from 'ramda';

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

  const trans = R.transpose(gridArr);
  console.log(trans);
  const spacing: number[] = [];

  trans.forEach((col) => {
    const lastIndex = col.lastIndexOf("[o]");
    const topIndex = col.slice(lastIndex).indexOf("[x]") >= 0 ? col.slice(lastIndex).indexOf("[x]") + lastIndex : 20;
    if(lastIndex >= 0) {
      spacing.push(topIndex - lastIndex);
    }
  })

  const downShift = Math.min(...spacing) - 1;

  const newGrid = structuredClone(gridArr);

  currentShape.forEach((row, yIndex) => {
    row.forEach((_item, xIndex) => {
      const y = centerPoint[1] + yIndex + offsetTop + downShift;
      const x = centerPoint[0] + xIndex + offsetLeft;
      if(x >= 0 && y >= 0 && currentShape[yIndex][xIndex] !== "") {
        newGrid[y][x] = "[x]";
      }
    });
  });

  return newGrid;
}