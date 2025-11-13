import styled from "styled-components"
import { LinearProgress } from "@mui/material";
import { useContext, useEffect, useRef, useState } from "react";
import { LineClearContext } from "./App";

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
    score: number;
    setScore: React.Dispatch<React.SetStateAction<number>>
}

export const ComboDisplayDiv = ({circleRef, circleWidth, combo, setCombo, score, setScore}: ComboProps) => {
    const progressRef = useRef<HTMLDivElement>(null);
    const lineClearBus = useContext(LineClearContext);

    const [comboTimer, setComboTimer] = useState(0);

    useEffect(() => {
        if(progressRef.current) {
            const barMargin = circleWidth + 10;
            progressRef.current.style.marginLeft =  `${barMargin}px` ;
        }
    }, [circleRef, circleWidth]);

    useEffect(() => { 
        const comboUp = (linesCleared: number) => {
            if(linesCleared === -1) {
                setTimeout(() => {setCombo(0)}, 0);
                setComboTimer(0);
                setScore(0);
                return;
            }
            //timeout defers process to the next tick so this doesn't try to run mid render of Game
            setTimeout(() => {setCombo(combo+linesCleared)}, 0);
            setTimeout(() => {setScore(score+100*(1+(combo*0.1))*linesCleared)}, 0);
            console.log({score, combo, linesCleared});
            console.log("Added score: ", 100*(1+(combo*0.1))*linesCleared);
        }

        let comboIntervalId = -1;

        if(combo > 0) {
            setComboTimer(100);
            comboIntervalId = setInterval(() => {
                setComboTimer(prevTimer => prevTimer-1);
            }, 50);
        }
        
        const unsubscribe = lineClearBus.subscribe(comboUp);

        // document.addEventListener('lineClearEvent', comboUp);

        return () => {
            if(comboIntervalId !== -1) {
                clearInterval(comboIntervalId);
            }
            unsubscribe();
        //     document.removeEventListener('lineClearEvent', comboUp);
        };
    }, [combo, score]);

    useEffect(() => {
        if(comboTimer <= 0) {
            setCombo(0);
        }
    }, [comboTimer]);

    return (
        <ContainerDiv>
            <ComboTimeDiv ref={progressRef}>
                <LinearProgress variant="determinate" value={comboTimer} sx={{ height: '100%', "& .MuiLinearProgress-bar": {transition: 10}} }/>
            </ComboTimeDiv>
            <CircleDiv ref={circleRef}>
                <p>{String(combo)}</p>
            </CircleDiv>
        </ContainerDiv>
    );
}