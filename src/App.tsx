import { useEffect, useRef, useState } from 'react'
import './App.css'
import styled from 'styled-components'
import { GameCanvas } from './GameCanvas'
import { block } from './block'
import { blockControl } from './blockControl'

const ContainerDiv = styled.div `
display: flex;
height: 90vh;
flex-direction: row;
justify-content: flex-start;
`

const UiDiv = styled.div `
width: 35vw;
border: 1px solid #000000;
`

const GameDiv = styled.div `
display: flex;
flex-direction: row;
width: 50vw;
border: 1px solid #000000;
`

const InfoDiv = styled.div `
display: flex;
flex-direction: column;
width: 40%;
height: 80vh;
align-self: flex-start;
border: 1px solid #000000;
margin-top: 5vh;
overflow: auto;
`

const UpNextDiv = styled.div `
display: flex;
height: 30%;
border-bottom: 1px solid #000000;
`

const UpNextDisplay = styled.div `
height: 80%;
aspect-ratio: 1 / 1;
margin-top: 5%;
margin-left: 5%;
border: 1px solid #000000;
`

const ChallengeDiv = styled.div `
height: 40%;
border-bottom: 1px solid #000000;
`

const TimerDiv = styled.div `
height: 30%;
`

function App() {

  const [gridArr, setGridArr] = useState<string[][]>(new Array(20).fill("").map(() => new Array(10).fill("")));
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const shape = useRef("I");
  const rotation = useRef(1);
  const centerPoint = useRef([5, 5]);

  const gameDimensions = [window.innerHeight*0.4, window.innerHeight*0.8];

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      blockControl(event.key, gridArr, setGridArr, shape.current, rotation.current, centerPoint.current);
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if(ctx) {
        gridArr.forEach((row, yInd) => {
          row.forEach((item, xInd) => {
            if(item === "[x]") {
              ctx.fillStyle = "#7cce70ff"
            } else if(item === "") {
              ctx.fillStyle = "#222222ff"
            } else {
              ctx.fillStyle = "#47cc33ff"
            }
            ctx.fillRect(xInd*(gameDimensions[0]/10), yInd*(gameDimensions[1]/20), gameDimensions[0]/10, gameDimensions[1]/10);
            ctx.rect(xInd*(gameDimensions[0]/10), yInd*(gameDimensions[1]/20), gameDimensions[0]/10, gameDimensions[1]/10);
          });
        });
        ctx.strokeStyle = "#aaaaaaff";
        ctx.stroke();
      }
    }
  }, [gridArr, windowHeight]);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <ContainerDiv>
      <UiDiv>
        <p>div1</p>
      </UiDiv>
      <GameDiv>
        <GameCanvas canvasRef={canvasRef} width={gameDimensions[0]} height={gameDimensions[1]}/>
        <InfoDiv>
          <UpNextDiv>
            <UpNextDisplay>
              
            </UpNextDisplay>
            <div>
              <p>fancy up next text here</p>
            </div>
          </UpNextDiv>
          <ChallengeDiv>
            <p>two</p>
          </ChallengeDiv>
          <TimerDiv>
            <p>three</p>
          </TimerDiv>
        </InfoDiv>
      </GameDiv>
    </ContainerDiv>
  )
}

export default App
