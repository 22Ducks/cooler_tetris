import { useEffect, useRef, useState } from 'react'
import './App.css'
import styled from 'styled-components'
import { GameCanvas } from './GameCanvas'
import { calcBlockMovement, quickDrop } from './blockControl'
import { drawCanvas } from './drawCanvas'
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
  const currGridArr = useRef<string[][]>(undefined);
  
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [blockData, setBlockData] = useState<BlockDef>(generateUpNext());
  const [upNext, setUpNext] = useState<BlockDef>(generateUpNext());
  const [fallInterval, setFallInterval] = useState(1000);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const gameDimensions = [window.innerHeight*0.4, window.innerHeight*0.8];

  useEffect(() => {
    currGridArr.current = gridArr;
  }, [gridArr])

  useEffect(() => {
    const lowerBlock = () => {
      setBlockData(prevData => {
        if(!currGridArr.current) {
          return prevData;
        }
        if(canFall(prevData, currGridArr.current)) {
          return {...prevData, centerPoint: [prevData.centerPoint[0], prevData.centerPoint[1]+1]};
        }

        return {...prevData, placed: true};
      });
    }

    const intervalId = setInterval(() => {
      lowerBlock();
    }, fallInterval); // Update every 1 second

    // Clean up the interval when the component unmounts or dependencies change
    return () => {
      clearInterval(intervalId);
    };
  }, [fallInterval]);

  useEffect(() => {
    const {shape, rotation, centerPoint, placed} = blockData;
    
    if(placed) {
      const currentShape = shapeChart[shape][rotation];
      const {offsetTop, offsetLeft} = outerOffsets(currentShape);

      setGridArr(prevGrid => {
        const newGrid = structuredClone(prevGrid);
        const changedLines: number[] = [];
  
        currentShape.forEach((row, yIndex) => {
          row.forEach((_item, xIndex) => {
            const y = centerPoint[1] + yIndex + offsetTop;
            const x = centerPoint[0] + xIndex + offsetLeft;
            if(x >= 0 && y >= 0 && currentShape[yIndex][xIndex] !== "") {
              newGrid[y][x] = "[x]";
              if(changedLines.indexOf(y) === -1) {
                changedLines.push(y);
              }
            }
          });
        });

        changedLines.forEach((yInd) => {
          if(newGrid[yInd].every(item => item === "[x]")) {
            for(let i = yInd; i > 0; i--) {
              newGrid[i] = structuredClone(newGrid[i-1]);
            }
          }
        });

        return newGrid;
      });

      setBlockData(upNext);

      const newNext = generateUpNext();
      setUpNext(newNext);
    }
  }, [blockData]);

  useEffect(() => {
    drawCanvas(gridArr, blockData, gameDimensions, canvasRef);
  }, [windowHeight, gridArr, blockData]);
  
  useEffect(() => {    
    const handleKeyDown = (event: KeyboardEvent) => {
      if(event.key === " ") {
        const newData = quickDrop(gridArr, blockData);

        setBlockData(newData);

        return;
      }

      if(event.key === "s" && fallInterval > 250) { //for debugging purposes
        setFallInterval(prevInterval => prevInterval-250);
      }

      const newData = calcBlockMovement(event.key, gridArr, blockData);
      setBlockData(newData);
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [gridArr, blockData]);

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
