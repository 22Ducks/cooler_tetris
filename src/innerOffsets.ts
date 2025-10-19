export const innerOffsets = (currentShape: string[][]) => {

    const shapeCenter = Math.floor(currentShape[0].length/2);
    const shapeEdges = [3, 0]; //default to both extremes

    currentShape.forEach((row) => {
        const tempL = row.indexOf("o");
        const tempR = row.lastIndexOf("o");

        shapeEdges[0] = (tempL >= 0 && tempL < shapeEdges[0]) ? tempL : shapeEdges[0];
        shapeEdges[1] = tempR > shapeEdges[1] ? tempR : shapeEdges[1];
    });

    return [shapeEdges[0] - shapeCenter, shapeEdges[1] + 1 - shapeCenter];
}