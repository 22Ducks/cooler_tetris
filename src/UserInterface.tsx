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

const SpacingDiv = styled.div `
height: 10%;
`

export const UserInterface = ({windowDimensions, paused}: InterfaceProps) => {

    const circleRef = useRef<HTMLDivElement>(null);
    const [circleWidth, setWidth] = useState(0);

    useEffect(() => {
        if(circleRef.current) {
            setWidth(circleRef.current.offsetWidth);
            console.log(circleWidth);
        }
    }, [windowDimensions, circleRef.current]);

    return (
        <>
        <ComboDiv>
            <SpacingDiv />
                <ComboDisplayDiv circleRef={circleRef} circleWidth={circleWidth}/>
            <SpacingDiv /> 
        </ComboDiv>
        <div>
            <p>shop</p>
        </div>
        <div>
            <p>score</p>
        </div>
        </>
    );
}