import { useEffect, useRef, useState } from 'react'
import './App.css'
import styled from 'styled-components'
import { GameCanvas } from './GameCanvas'
import { calcBlockMovement, quickDrop } from './blockControl'
import { setCanvas } from './setCanvas'
import { updateActiveBlock } from './updateActiveBlock'
import { Shape, shapeChart } from './constants'
import type { BlockDef } from './blockControl'
import { generateUpNext } from './generateUpNext'

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

export const defaultBlock = {
  shape: Shape.T,
  rotation: 0,
  centerPoint: [5, 2] as [number, number]
}

function App() {

  const [gridArr, setGridArr] = useState<string[][]>(new Array(20).fill("").map(() => new Array(10).fill("")));
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [blockData, setBlockData] = useState<BlockDef>(defaultBlock);
  const [upNext, setUpNext] = useState<BlockDef>(generateUpNext());

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {shape, rotation, centerPoint} = blockData;
  const currentShape = shapeChart[shape][rotation];

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

        setBlockData(upNext);
        const resetShape = shapeChart[upNext.shape][upNext.rotation];
        setGridArr(updateActiveBlock(upNext.centerPoint, resetShape, newGrid));

        const newNext = generateUpNext();
        setUpNext(newNext);

        return;
      }

      console.log( event.key );
      const newData = calcBlockMovement(event.key, gridArr, blockData);
      setBlockData(newData);
      const updatedShape = shapeChart[shape][newData.rotation];
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
