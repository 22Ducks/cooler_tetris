import { LinearProgress } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

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

const ComboTimeDiv = styled.div `
position: absolute;
border: 1px solid #000000;
height: 30%;
width: 85%;
` //may need to make into own component to dynamically edit

const ComboDisplayDiv = styled.div `
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
            <ComboDisplayDiv>
                <ComboTimeDiv style={{ marginLeft: `${circleWidth}` }}>
                    <LinearProgress variant="determinate" value={10} sx={{ height: '100%' }}/>
                </ComboTimeDiv>
                <CircleDiv ref={circleRef}>
                    <p>combo</p>
                </CircleDiv>
            </ComboDisplayDiv>
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