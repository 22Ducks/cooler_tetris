export const setCanvas = (gridArr: string[][], gameDimensions: number[], canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
    const canvas = canvasRef.current;

    if (canvas) {
      const ctx = canvas.getContext('2d');
      if(ctx) {
        gridArr.forEach((row, yInd) => {
          row.forEach((item, xInd) => {
            if(item === "[x]") {
              ctx.fillStyle = "#7cce70ff"
            } else if(item === "") {
              ctx.fillStyle = "#222222ff"
            } else {
              ctx.fillStyle = "#47cc33ff"
            }
            ctx.fillRect(xInd*(gameDimensions[0]/10), yInd*(gameDimensions[1]/20), gameDimensions[0]/10, gameDimensions[1]/10);
            ctx.rect(xInd*(gameDimensions[0]/10), yInd*(gameDimensions[1]/20), gameDimensions[0]/10, gameDimensions[1]/10);
          });
        });
        ctx.strokeStyle = "#aaaaaaff";
        ctx.stroke();
      }
    }

    return canvasRef;
}