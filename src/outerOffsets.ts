export const outerOffsets = (currentShape: string[][]) => {
    const offsetTop = currentShape.length%2 === 0 ? -2 : -1;
    const offsetLeft = currentShape[0].length%2 === 0 ? -2 : -1;

    return {offsetTop, offsetLeft};
}