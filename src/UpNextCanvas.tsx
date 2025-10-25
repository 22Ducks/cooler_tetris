import { useEffect, useRef } from "react";
import styled from "styled-components"
import type { BlockDef } from "./blockControl";
import { shapeChart } from "./constants";

const StyleNextCanvas = styled.canvas `
width: 100%;
height: 100%;
`

type UpNextProps = {
    windowDimensions: number[];
    upNext: BlockDef;
}

export const UpNextCanvas = ({windowDimensions, upNext}: UpNextProps) => { //incorrect dimensions?
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvas = canvasRef.current;
    const currentShape = shapeChart[upNext.shape][upNext.rotation];

    useEffect(() => {
        if (canvas) {
            const ctx = canvas.getContext('2d');

            const cellWidth = canvas.width / currentShape[0].length;
            const cellHeight = canvas.height / currentShape.length;

            if(ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.beginPath();
                currentShape.forEach((row, y) => {
                    row.forEach((item, x) => {
                        if(item === "o") {
                            ctx.fillStyle = "#58aae0ff";
                        } else {
                            ctx.fillStyle = "#222222ff";
                        }

                        const rectX = x * cellWidth;
                        const rectY = y * cellHeight;

                        ctx.fillRect(rectX, rectY, cellWidth, cellHeight);
                        ctx.rect(rectX, rectY, cellWidth, cellHeight);
                    });
                });

                ctx.strokeStyle = "#aaaaaaff";
                ctx.stroke();
                ctx.closePath();
            }
        }
    }, [windowDimensions, upNext]);

    return <StyleNextCanvas ref={canvasRef} />
}