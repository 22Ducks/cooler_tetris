import { outerOffsets } from "./outerOffsets";

export const canFall = (centerPoint: number[], currentShape: string[][], gridArr: string[][]) => {
    const {offsetTop, offsetLeft} = outerOffsets(currentShape);
    
    const isInvalid = currentShape.some((row, yIndex) => {
        return row.some((item, xIndex) => {
            const y = centerPoint[1] + yIndex + offsetTop;
            const x = centerPoint[0] + xIndex + offsetLeft;
            if(y < 0) {
              return false;
            }
            if(gridArr[y+1][x] === "[x]" && item === "o") { //checking pos post-shift
              return true;
            }
        });
    });

    return !isInvalid;
}