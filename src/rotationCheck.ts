import { innerOffsets } from "./innerOffsets";
import { outerOffsets } from "./outerOffsets";

declare global {
    interface Window {
        x: any;
        y: any;
        shift: any;
        srsChecks: any;
    }
}

export const rotationCheck = (gridArr: string[][], centerPoint: number[], currentShape: string[][], srsChecks: number[][]) => {
    
    const {offsetTop, offsetLeft} = outerOffsets(currentShape);
    const offsets = innerOffsets(currentShape);

    let returnVal: number[] = [999, 999];
    
    srsChecks.some((shift) => {
        if(centerPoint[0] + offsets[0] + shift[0] >= 0 && centerPoint[0] + offsets[1] + shift[0] <= 10) { //not out-of-bounds
            
            const isInvalid = currentShape.some((row, yIndex) => {
                return row.some((item, xIndex) => {
                    const y = centerPoint[1] + yIndex + offsetTop + shift[1];
                    const x = centerPoint[0] + xIndex + offsetLeft + shift[0];
                    if(y < 0) {
                        return false;
                    }
                    if(y > 19 || (gridArr[y][x] === "[x]" && item !== "")) {
                        return true;
                    }
                });
            });

            if(!isInvalid) { //got through all loops without invalid position
                returnVal = shift;
                return true;
            }
        }

        return false;
    });

    return returnVal;
}