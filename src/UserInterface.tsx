import { useEffect, useState } from "react";
import styled from "styled-components";
import { ComboDisplayDiv } from "./ComboDisplayDiv";
import { useLineClearContext } from "./context";

// type InterfaceProps = {
//     paused: boolean;
// }

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

export const UserInterface = () => {

    const [combo, setCombo] = useState(0);
    const [score, setScore] = useState(0);

    const lineClearBus = useLineClearContext();

    const [comboTimer, setComboTimer] = useState(0);

    useEffect(() => { 
        const comboUp = (linesCleared: number) => {
            if(linesCleared === -1) {
                setTimeout(() => {setCombo(0)}, 0);
                setTimeout(() => {setComboTimer(0)}, 0);
                setTimeout(() => {setScore(0)}, 0);
                return;
            }
            //timeout defers process to the next tick so this doesn't try to run mid render of Game
            setTimeout(() => {setCombo(combo+linesCleared)}, 0);
            setTimeout(() => {setScore(score+100*(1+(combo*0.1))*linesCleared)}, 0);
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
        <>
        <ComboDiv>
            <SpacingDiv />
                <ComboDisplayDiv combo={combo} comboTimer={comboTimer}/>
            <SpacingDiv /> 
        </ComboDiv>
        <StoreDiv>
            <p>shop</p>
        </StoreDiv>
        <ScoreDiv>
            <p data-testid="scoreDisp">{String(score)}</p>
        </ScoreDiv>
        </>
    );
}