import type { BlockDef } from "./blockControl";
import { shapeChart } from "./constants";
import { outerOffsets } from "./outerOffsets";

export const canFall = (blockData: BlockDef, gridArr: string[][]) => {
  const {shape, rotation, centerPoint} = blockData;  
  const currentShape = shapeChart[shape][rotation];
  
  const {offsetTop, offsetLeft} = outerOffsets(currentShape);
    
    const isInvalid = currentShape.some((row, yIndex) => {
        return row.some((item, xIndex) => {
            const y = centerPoint[1] + yIndex + offsetTop;
            const x = centerPoint[0] + xIndex + offsetLeft;
            if(y < 0 || item === "") {
              return false;
            }
            
            if(y >= 19 || gridArr[y+1][x] === "[x]") { //checking pos post-shift
              return true;
            }
        });
    });

    return !isInvalid;
}