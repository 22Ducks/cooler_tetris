import styled from "styled-components"
import type { BlockDef } from "./blockControl";
import { useEffect, useRef } from "react";
import { drawCanvas } from "./drawCanvas";

const StyleGameCanvas = styled.canvas `
align-self: flex-start;
border: 1px solid #000000;
margin-left: 5vw;
margin-top: 5vh;
`

type GameCanvasProps = {
    gridArr: string[][];
    blockData: BlockDef;
    gameDimensions: number[];
    windowHeight: number;
}

export const GameCanvas = ({gridArr, blockData, gameDimensions, windowHeight}: GameCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        drawCanvas(gridArr, blockData, gameDimensions, canvasRef);
    }, [windowHeight, gridArr, blockData]);
    
    return <StyleGameCanvas ref={canvasRef} width={gameDimensions[0]} height={gameDimensions[1]}></StyleGameCanvas>
}