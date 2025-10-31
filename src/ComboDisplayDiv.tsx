import styled from "styled-components"
import { LinearProgress } from "@mui/material";
import { useEffect, useRef } from "react";

const ComboTimeDiv = styled.div `
position: absolute;
border: 1px solid #000000;
height: 30%;
width: 65%;
`

const ContainerDiv = styled.div `
position: relative;
display: flex;
align-items: center;
height: 80%;
`

const CircleDiv = styled.div `
height: 100%;
margin-left: 5%;
aspect-ratio: 1 / 1;
border: 1px solid #000000;
border-radius: 50%;
`

type ComboProps = {
    circleRef: React.RefObject<HTMLDivElement | null>;
    circleWidth: number;
}

export const ComboDisplayDiv = ({circleRef, circleWidth}: ComboProps) => {
    const progressRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        console.log({circleWidth});
        if(progressRef.current) {
            const barMargin = circleWidth + 10;
            progressRef.current.style.marginLeft =  `${barMargin}px` ;
        }
    }, [circleRef, circleWidth]);

    useEffect(() => {
        const comboUp = () => {
            console.log("CLEAR!");
        }

        document.addEventListener('lineClearEvent', comboUp);
    }, []);

    return (
        <ContainerDiv>
            <ComboTimeDiv ref={progressRef}>
                <LinearProgress variant="determinate" value={10} sx={{ height: '100%' }}/>
            </ComboTimeDiv>
            <CircleDiv ref={circleRef}>
                <p>combo</p>
            </CircleDiv>
        </ContainerDiv>
    );
}