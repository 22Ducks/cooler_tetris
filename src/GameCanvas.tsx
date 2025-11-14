import styled from "styled-components"
import type { BlockDef } from "./blockControl";
import { useContext, useEffect, useRef } from "react";
import { drawCanvas } from "./drawCanvas";
import { PauseContext } from "./context";

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
    windowDimensions: number[];
}

export const GameCanvas = ({gridArr, blockData, gameDimensions, windowDimensions}: GameCanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const {paused} = useContext(PauseContext);

    useEffect(() => {
        drawCanvas(gridArr, blockData, gameDimensions, canvasRef, paused);
    }, [windowDimensions, gridArr, blockData, paused]);
    
    return <StyleGameCanvas data-testid="gamecanvas" ref={canvasRef} width={gameDimensions[0]} height={gameDimensions[1]}></StyleGameCanvas>
}