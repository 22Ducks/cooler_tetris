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
import { canFall } from './canFall'
import { outerOffsets } from './outerOffsets'

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
  const [fallInterval, setFallInterval] = useState(1000);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const {shape, rotation, centerPoint} = blockData;
  const currentShape = shapeChart[shape][rotation];

  const gameDimensions = [window.innerHeight*0.4, window.innerHeight*0.8];

  useEffect(() => { //on first render only
    const newGrid = updateActiveBlock(centerPoint, currentShape, gridArr);
    setGridArr(newGrid);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setGridArr((prevGridArr) => {
        if(canFall(centerPoint, currentShape, prevGridArr)) { //move block down by 1

          const newGrid = updateActiveBlock([centerPoint[0], centerPoint[1]+1], currentShape, prevGridArr);
          setBlockData((prevData) => {
            return {shape: prevData.shape, rotation: prevData.rotation, centerPoint: [prevData.centerPoint[0], prevData.centerPoint[1]+1]};
          });

          return newGrid;
        }

        const newPlacement = structuredClone(prevGridArr);
        const {offsetTop, offsetLeft} = outerOffsets(currentShape);

        currentShape.forEach((row, yIndex) => {
          row.forEach((_item, xIndex) => {
            const y = centerPoint[1] + yIndex + offsetTop;
            const x = centerPoint[0] + xIndex + offsetLeft;
            if(x >= 0 && y >= 0 && currentShape[yIndex][xIndex] !== "") {
              newPlacement[y][x] = "[x]";
            }
          });
        });

        setBlockData(upNext);
        const resetShape = shapeChart[upNext.shape][upNext.rotation];
        const newGrid = updateActiveBlock(upNext.centerPoint, resetShape, newPlacement);

        const newNext = generateUpNext();
        setUpNext(newNext);

        return newGrid;
      });
    }, 1000); // Update every 1 second

    // Clean up the interval when the component unmounts or dependencies change
    return () => {
      clearInterval(intervalId);
    };
  }, [fallInterval]);
  
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

      //console.log( event.key );
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
