import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ComboDisplayDiv } from "./ComboDisplayDiv";

type InterfaceProps = {
    windowDimensions: number[];
    paused: boolean;
}

const ComboDiv = styled.div `
display: flex;
flex-direction: column;
height: 20%;
border-bottom: 1px solid #000000;
overflow: hidden;
`

const StoreDiv = styled.div `
display: flex;
flex-direction: column;
height: 60%;
border-bottom: 1px solid #000000;
`

const ScoreDiv = styled.div `
display: flex;
flex-direction: column;
height: 20%;
`

const SpacingDiv = styled.div `
height: 10%;
`

export const UserInterface = ({windowDimensions, paused}: InterfaceProps) => {

    const circleRef = useRef<HTMLDivElement>(null);
    const [circleWidth, setWidth] = useState(0);
    const [combo, setCombo] = useState(0);
    const [score, setScore] = useState(0);

    useEffect(() => {
        if(circleRef.current) {
            setWidth(circleRef.current.offsetWidth);
        }
    }, [windowDimensions, circleRef.current]);

    return (
        <>
        <ComboDiv>
            <SpacingDiv />
                <ComboDisplayDiv circleRef={circleRef} circleWidth={circleWidth} combo={combo} setCombo={setCombo} score={score} setScore={setScore}/>
            <SpacingDiv /> 
        </ComboDiv>
        <StoreDiv>
            <p>shop</p>
        </StoreDiv>
        <ScoreDiv>
            <p>{String(score)}</p>
        </ScoreDiv>
        </>
    );
}