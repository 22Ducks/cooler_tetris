import { rotationCheck } from "./rotationCheck";
import { outerOffsets } from "./outerOffsets";
import { Shape, shapeChart, srs_chart } from "./constants";
import { innerOffsets } from "./innerOffsets";
import * as R from 'ramda';

export type BlockDef = {
  shape: Shape;
  rotation: number;
  centerPoint: [number, number];
  placed: boolean;
}

export const calcBlockMovement = (event: string, gridArr: string[][], blockDef: BlockDef): BlockDef => {
  
  const {shape, rotation, centerPoint} = blockDef;
  const currentShape = shapeChart[shape][rotation];
  const {offsetTop, offsetLeft} = outerOffsets(currentShape);
  const offsets = innerOffsets(currentShape);

  if(event === "ArrowRight" && centerPoint[0] + offsets[1] < 10) {

    const isInvalid = currentShape.some((row, yIndex) => {
        return row.some((item, xIndex) => {
            const y = centerPoint[1] + yIndex + offsetTop;
            const x = centerPoint[0] + xIndex + offsetLeft;
            if(y < 0 || item === "") {
              return false;
            }
            if(gridArr[y][x+1] === "[x]" && item === "o") {
              return true;
            }
        });
    });

    return isInvalid ? blockDef : {...blockDef, centerPoint: [centerPoint[0]+1, centerPoint[1]]};

  }
  
  if(event === "ArrowLeft" && centerPoint[0] + offsets[0] > 0) {

    const isInvalid = currentShape.some((row, yIndex) => {
        return row.some((item, xIndex) => {
            const y = centerPoint[1] + yIndex + offsetTop;
            const x = centerPoint[0] + xIndex + offsetLeft;
            if(y < 0 || item === "") {
              return false;
            }
            if(gridArr[y][x-1] === "[x]" && item === "o") { //checking pos post-shift
              return true;
            }
        });
    });

    return isInvalid ? blockDef : {...blockDef, centerPoint: [centerPoint[0]-1, centerPoint[1]]};

  }
  
  if(event === "ArrowDown") {
    //deal with later
    return blockDef;
  }
  
  if(event.toLowerCase() === "z" || event.toLowerCase() === "x") { //prevent out-of-bounds

    if(shape === "O") {
      return blockDef;
    }

    const rotationIndex = event.toLowerCase() === "z" ? 0 : 1;

    const newRotation = event.toLowerCase() === "z" //todo: remove nested ternery
      ? (rotation - 1) >= 0 ? (rotation - 1) : shapeChart[shape].length - 1
      : (rotation + 1)%(shapeChart[shape].length);

    const rotationObject = srs_chart[shape][newRotation][rotationIndex];
    const rotatedShape = shapeChart[shape][newRotation];

    const shift = rotationCheck(gridArr, centerPoint, rotatedShape, rotationObject);

    return shift[0] !== 999 ? {...blockDef, "rotation": newRotation, centerPoint: [centerPoint[0] + shift[0], centerPoint[1] + shift[1]]} : blockDef;
  }

  return blockDef;
}

export const quickDrop = (gridArr: string[][], blockDef: BlockDef): BlockDef => {

  const {shape, rotation, centerPoint} = blockDef;
  const currentShape = shapeChart[shape][rotation];

  const {offsetTop, offsetLeft} = outerOffsets(currentShape);

  const transShape = R.transpose(currentShape);  
  const trans = R.transpose(gridArr);
  const spacing: number[] = [];
  
  transShape.forEach((col, xInd) => {
    const localLastIndex = col.lastIndexOf("o");
    if(localLastIndex >= 0) {
      const currentCol = centerPoint[0] + offsetLeft + xInd;

      const lastIndex = centerPoint[1] + offsetTop + localLastIndex;
      const topSurfaceIndex = trans[currentCol].slice(lastIndex).indexOf("[x]") >= 0 ? trans[currentCol].slice(lastIndex).indexOf("[x]") + lastIndex : 20;
      spacing.push(topSurfaceIndex - lastIndex);
    }
  });

  const downShift = Math.min(...spacing) - 1;

  return {shape, rotation, centerPoint: [centerPoint[0], centerPoint[1]+downShift], placed: true};
}