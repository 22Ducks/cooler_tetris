import styled from "styled-components"

const StyleGameCanvas = styled.canvas `
align-self: flex-start;
border: 1px solid #000000;
margin-left: 5vw;
margin-top: 5vh;
`

type GameCanvasProps = {
    canvasRef: React.RefObject<HTMLCanvasElement | null>;
    width: number;
    height: number;
}

export const GameCanvas = ({canvasRef, width, height}: GameCanvasProps) => {
    return <StyleGameCanvas ref={canvasRef} width={width} height={height}></StyleGameCanvas>
}