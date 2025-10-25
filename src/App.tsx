import { useEffect, useState } from 'react'
import './App.css'
import styled from 'styled-components'
import { Game } from './Game'

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
  
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  const gameDimensions = [window.innerHeight*0.4, window.innerHeight*0.8];

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
        <Game gameDimensions={gameDimensions} windowHeight={windowHeight}/>
      </GameDiv>
    </ContainerDiv>
  )
}

export default App;
