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
    combo: number;
    setCombo: React.Dispatch<React.SetStateAction<number>>
}

export const ComboDisplayDiv = ({circleRef, circleWidth, combo, setCombo}: ComboProps) => {
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
            //deferring change of combo to next tick to avoid error of changing one component mid handling another
            setTimeout(() => {setCombo(prevCombo => prevCombo+1)}, 0); //strict mode may be causing issues here...
        }

        document.addEventListener('lineClearEvent', comboUp);

        return () => {
            document.removeEventListener('lineClearEvent', comboUp);
        };
    }, [combo]);

    return (
        <ContainerDiv>
            <ComboTimeDiv ref={progressRef}>
                <LinearProgress variant="determinate" value={10} sx={{ height: '100%' }}/>
            </ComboTimeDiv>
            <CircleDiv ref={circleRef}>
                <p>{String(combo)}</p>
            </CircleDiv>
        </ContainerDiv>
    );
}