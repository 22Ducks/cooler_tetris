

export const rotationCheck = (gridArr: string[][], centerPoint: number[], currentShape: string[][], offsets: number[], srsChecks: number[][]) => {
    
    const offsetTop = currentShape.length%2 === 0 ? -2 : -1;

    let returnVal: number[] = [999, 999];
    
    srsChecks.some((shift) => {
        if(centerPoint[0] + offsets[0] + shift[0] >= 0 && centerPoint[0] + offsets[1] + shift[0] <= 10) { //not out-of-bounds

            let breakFlag = false;
            
            currentShape.some((row, yIndex) => {
                row.some((item, xIndex) => {
                    const y = centerPoint[1] + yIndex + offsetTop;
                    const x = centerPoint[0] + xIndex + offsets[0];
                    if(y < 0 || gridArr[y][x] === "[x]") { //x position already valid in terms of walls
                        breakFlag = true;
                    }

                    return breakFlag; //leaves loop early if invalid position
                });
                return breakFlag;
            });

            if(!breakFlag) { //got through all loops without invalid position
                returnVal = shift;
                return true;
            }
        }

        return false;
    });

    return returnVal;
}