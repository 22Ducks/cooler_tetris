import styled from "styled-components"
import { GameCanvas } from "./GameCanvas"
import { useEffect, useRef, useState } from "react"
import { calcBlockMovement, quickDrop, type BlockDef } from "./blockControl"
import { generateUpNext } from "./generateUpNext"
import { canFall } from "./canFall"
import { Shape, shapeChart } from "./constants"
import { outerOffsets } from "./outerOffsets"
import { UpNextCanvas } from "./UpNextCanvas"

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

type GameProps = {
    gameDimensions: number[];
    windowDimensions: number[];
}

const defaultInterval = {
  interval: 1000,
  modifier: 1
}

export const defaultBlock = {
  shape: Shape.T,
  rotation: 0,
  centerPoint: [5, 1] as [number, number]
}

export const Game = ({gameDimensions, windowDimensions}: GameProps) => {

    const [gridArr, setGridArr] = useState<string[][]>(new Array(20).fill("").map(() => new Array(10).fill("")));
    const currGridArr = useRef<string[][]>(undefined);

    const [blockData, setBlockData] = useState<BlockDef>(generateUpNext());
    const [upNext, setUpNext] = useState<BlockDef>(generateUpNext());
    const [fallInterval, setFallInterval] = useState(defaultInterval);

    useEffect(() => {
        currGridArr.current = gridArr;
    }, [gridArr]);

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
        }, (fallInterval.interval*fallInterval.modifier));

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
        const handleKeyDown = (event: KeyboardEvent) => {
            if(event.key === " ") {
                const newData = quickDrop(gridArr, blockData);

                setBlockData(newData);

                return;
            }

            if(event.key === "ArrowDown") {
                if(event.repeat) {
                    return;
                }

                setFallInterval(prevInterval => ({...prevInterval, modifier: 0.1}));
            }

            const newData = calcBlockMovement(event.key, gridArr, blockData);
            setBlockData(newData);
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            if(event.key === "ArrowDown") {
                setFallInterval(prevInterval => ({...prevInterval, modifier: 1}));
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [gridArr, blockData]);

    return (
        <>
        <GameCanvas gridArr={gridArr} blockData={blockData} gameDimensions={gameDimensions} windowDimensions={windowDimensions}/>
        <InfoDiv>
          <UpNextDiv>
            <UpNextDisplay>
              <UpNextCanvas windowDimensions={windowDimensions} upNext={upNext}/>
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
        </>
    )
}