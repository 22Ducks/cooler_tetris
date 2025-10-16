import { useEffect, useRef, useState } from 'react'
import './App.css'
import styled from 'styled-components'
import { GameCanvas } from './GameCanvas'
import { calcBlockMovement, quickDrop } from './blockControl'
import { setCanvas } from './setCanvas'
import { updateActiveBlock } from './updateActiveBlock'
import { shapeChart } from './constants'

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

type BlockDef = {
  shape: string;
  rotation: number;
  centerPoint: [number, number];
}

const defaultBlock = {
  shape: "T",
  rotation: 0,
  centerPoint: [5, 5] as [number, number]
}

function App() {

  const [gridArr, setGridArr] = useState<string[][]>(new Array(20).fill("").map(() => new Array(10).fill("")));
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [blockData, setBlockData] = useState<BlockDef>(defaultBlock);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {shape, rotation, centerPoint} = blockData;
  const currentShape = shapeChart[shape as keyof typeof shapeChart][rotation];
  // const shape = useRef("T");
  // const rotation = useRef(1);
  // const centerPoint = useRef([5, 5]);

  const gameDimensions = [window.innerHeight*0.4, window.innerHeight*0.8];

  useEffect(() => { //on first render only
    const newGrid = updateActiveBlock(centerPoint, currentShape, gridArr);
    setGridArr(newGrid);
  }, []);
  
  useEffect(() => {

    setCanvas(gridArr, gameDimensions, canvasRef);
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if(event.key === " ") {
        const newGrid = quickDrop(gridArr, blockData);
        setGridArr(newGrid);
        return;
      }

      console.log( event.key );
      const newData = calcBlockMovement(event.key, gridArr, blockData);
      setBlockData(newData);
      const updatedShape = shapeChart[shape as keyof typeof shapeChart][newData.rotation];
      const newGrid = updateActiveBlock(newData.centerPoint, updatedShape, gridArr);
      setGridArr(newGrid);
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
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
