import styled from "styled-components"
import { LinearProgress } from "@mui/material";

const ComboTimeDiv = styled.div `
border: 1px solid #000000;
height: 30%;
width: 65%;
margin-left: -5%;
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
    combo: number;
    comboTimer: number;
}

export const ComboDisplayDiv = ({combo, comboTimer}: ComboProps) => {

    return (
        <ContainerDiv data-testid="comboDisp">
            <CircleDiv>
                <p data-testid="comboText">{String(combo)}</p>
            </CircleDiv>
            <ComboTimeDiv>
                <LinearProgress data-testid="progress" variant="determinate" value={comboTimer} sx={{ height: '100%', "& .MuiLinearProgress-bar": {transition: 10}} }/>
            </ComboTimeDiv>
        </ContainerDiv>
    );
}