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

        const [boardWidth, boardHeight] = gameDimensions;
        const cellWidth = boardWidth / 10;
        const cellHeight = boardHeight / 20;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();

        gridArr.forEach((row, y) => {
          row.forEach((item, x) => {
            if(item === "[x]") {
              ctx.fillStyle = "#7cce70ff"
            } else {
              ctx.fillStyle = "#222222ff"
            }
            const rectX = x * boardWidth / 10;
            const rectY = y * boardHeight / 20;
            ctx.fillRect(rectX, rectY, cellWidth, cellHeight);
            ctx.rect(rectX, rectY, cellWidth, cellHeight);
          });
        });

        ctx.fillStyle = "#58aae0ff"

        currentShape.forEach((row, yIndex) => {
          row.forEach((_item, xIndex) => {
            const y = centerPoint[1] + yIndex + offsetTop;
            const x = centerPoint[0] + xIndex + offsetLeft;
            if(x >= 0 && y >= 0 && currentShape[yIndex][xIndex] !== "") {
              const rectX = x * boardWidth / 10;
              const rectY = y * boardHeight / 20;
              ctx.fillRect(rectX, rectY, cellWidth, cellHeight);
            }
          });
        });

        ctx.strokeStyle = "#aaaaaaff";
        ctx.stroke();

        ctx.closePath();
      }
    }

    return canvasRef;
}