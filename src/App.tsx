import { useEffect, useState } from 'react'
import './App.css'
import styled from 'styled-components'
import { Game } from './Game'
import { UserInterface } from './UserInterface'
import { lineClearBus, LineClearContext, PauseContext } from './context'

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

function App() {
  
  const [windowDimensions, setWindowDimensions] = useState([window.innerWidth, window.innerHeight]);
  const [paused, setPaused] = useState(true);

  const gameDimensions = [window.innerHeight*0.4, window.innerHeight*0.8];

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <ContainerDiv>
      <LineClearContext.Provider value = {lineClearBus}>
      <PauseContext.Provider value = {{paused, setPaused}}>
        <UiDiv>
          <UserInterface/>
        </UiDiv>
        <GameDiv>
          <Game gameDimensions={gameDimensions} windowDimensions={windowDimensions}/>
        </GameDiv>
      </PauseContext.Provider>
      </LineClearContext.Provider>
    </ContainerDiv>
  )
}

export default App;
