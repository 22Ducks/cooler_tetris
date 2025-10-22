import type { BlockDef } from "./blockControl";
import { shapeChart } from "./constants";
import { outerOffsets } from "./outerOffsets";

export const drawCanvas = (gridArr: string[][], blockData: BlockDef, gameDimensions: number[], canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext('2d');
      if(ctx) {
        const {shape, rotation, centerPoint} = blockData;
        const currentShape = shapeChart[shape][rotation];
        const {offsetTop, offsetLeft} = outerOffsets(currentShape);

        gridArr.forEach((row, yInd) => {
          row.forEach((item, xInd) => {
            if(item === "[x]") {
              ctx.fillStyle = "#7cce70ff"
            } else {
              ctx.fillStyle = "#222222ff"
            }
            ctx.fillRect(xInd*(gameDimensions[0]/10), yInd*(gameDimensions[1]/20), gameDimensions[0]/10, gameDimensions[1]/10);
            ctx.rect(xInd*(gameDimensions[0]/10), yInd*(gameDimensions[1]/20), gameDimensions[0]/10, gameDimensions[1]/10);
          });
        });

        ctx.fillStyle = "#58aae0ff"

        currentShape.forEach((row, yIndex) => {
          row.forEach((_item, xIndex) => {
            const y = centerPoint[1] + yIndex + offsetTop;
            const x = centerPoint[0] + xIndex + offsetLeft;
            if(x >= 0 && y >= 0 && currentShape[yIndex][xIndex] !== "") {
              ctx.fillRect(x*(gameDimensions[0]/10), y*(gameDimensions[1]/20), gameDimensions[0]/10, gameDimensions[1]/10);
            }
          });
        });

        ctx.strokeStyle = "#aaaaaaff";
        ctx.stroke();
      }
    }

    return canvasRef;
}