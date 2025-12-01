import styled from "styled-components"
import { GameCanvas } from "./GameCanvas"
import { useEffect, useRef, useState } from "react"
import { calcBlockMovement, quickDrop, type BlockDef } from "./blockControl"
import { generateUpNext } from "./generateUpNext"
import { canFall } from "./canFall"
import { defaultGridArr, Shape, shapeChart } from "./constants"
import { outerOffsets } from "./outerOffsets"
import { UpNextCanvas } from "./UpNextCanvas"
import { useLineClearContext, usePauseContext } from "./context"
import { GameOverModal } from "./GameOverModal"
import { StartMenuModal } from "./StartMenuModal"

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
  centerPoint: [5, 1] as [number, number],
  placed: false
}

export const Game = ({gameDimensions, windowDimensions}: GameProps) => {

    const {paused, setPaused} = usePauseContext();
    const lineClearBus = useLineClearContext();

    const [isGameOver, setGameOver] = useState(false);

    const [gridArr, setGridArr] = useState<string[][]>(structuredClone(defaultGridArr));
    const currGridArr = useRef<string[][]>(undefined);

    const [blockData, setBlockData] = useState<BlockDef>(generateUpNext());
    const [upNext, setUpNext] = useState<BlockDef>(generateUpNext());
    const [fallInterval, setFallInterval] = useState(defaultInterval);

    useEffect(() => {
        currGridArr.current = gridArr;
    }, [gridArr]);

    useEffect(() => {
        const lowerBlock = () => {
            if(paused) {
                return;
            }

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
    }, [fallInterval, paused]);

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

                let numCleared = 0;

                changedLines.forEach((yInd) => {
                    if(newGrid[yInd].every(item => item === "[x]")) {
                        for(let i = yInd; i > 0; i--) {
                            newGrid[i] = structuredClone(newGrid[i-1]);
                        }
                        numCleared++;
                        //document.dispatchEvent(lineClearEvent);
                    }
                });

                if(numCleared > 0) {
                    lineClearBus.publish(numCleared);
                }

            return newGrid;
        });

        setBlockData(upNext);

        const newNext = generateUpNext();
        setUpNext(newNext);
        }
    }, [blockData]);
    
    useEffect(() => {    
        if(paused) {
            return;
        }

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
    }, [gridArr, blockData, paused]);

    useEffect(() => { //checking for Loss
        const {shape, rotation, centerPoint} = blockData;
        const currentShape = shapeChart[shape][rotation];

        const {offsetTop, offsetLeft} = outerOffsets(currentShape);

        const isInvalid = currentShape.some((row, yIndex) => {
            return row.some((item, xIndex) => {
                const y = centerPoint[1] + yIndex + offsetTop;
                const x = centerPoint[0] + xIndex + offsetLeft;
                if(y < 0) {
                    return false;
                }
                if(y > 19 || (gridArr[y][x] === "[x]" && item !== "")) {
                    return true;
                }
            });
        });

        if(isInvalid) {
            setPaused(true);
            setGameOver(true);
        }
    }, [upNext]);

    const restart = () => {
        setPaused(false);
        setGridArr(structuredClone(defaultGridArr));
        setBlockData(generateUpNext());
        setUpNext(generateUpNext());
        setFallInterval(defaultInterval);
        setGameOver(false);
        lineClearBus.publish(-1);
    }

    return (
        <>
        <GameOverModal open={isGameOver} restart={restart} />
        <StartMenuModal />
        <GameCanvas gridArr={gridArr} blockData={blockData} gameDimensions={gameDimensions} windowDimensions={windowDimensions}/>
        <InfoDiv data-testid="game">
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