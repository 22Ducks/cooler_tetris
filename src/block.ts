export const block = (centerPoint: number[], currentShape: string[][], gridArr: string[][], setGridArr: React.Dispatch<React.SetStateAction<string[][]>>) => {
    //possible shapes: O, I, S, Z, L, J, T

    const offsetTop = currentShape.length%2 === 0 ? -2 : -1;
    const offsetLeft = currentShape[0].length%2 === 0 ? -2 : -1;

    //checking for out of bounds or if landed will be handled by a diff function  
    
    //rewrite gridArr
    const newGrid = new Array(20).fill("").map(() => new Array(10).fill(""));

    gridArr.forEach((row, yIndex) => {
      row.forEach((item, xIndex) => {
        newGrid[yIndex][xIndex] = item === "[o]" ? "" : item;
      });
    });
 
    currentShape.forEach((row, yIndex) => {
      row.forEach((item, xIndex) => {
        const y = centerPoint[1] + yIndex + offsetTop;
        const x = centerPoint[0] + xIndex + offsetLeft;
        if(x >= 0 && y >= 0 && currentShape[yIndex][xIndex] !== "") {
          newGrid[y][x] = "[o]";
        }
      });
    });

    console.log({newGrid});
    setGridArr(newGrid);
}