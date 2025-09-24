import { useState } from 'react'
import './App.css'
import styled from 'styled-components'

const ContainerDiv = styled.div `
display: flex;
height: 90vh;
flex-direction: row;
justify-content: flex-start;
`

const UiDiv = styled.div `
width: 30vw;
border: 1px solid #000000;
`

const GameDiv = styled.div `
display: flex;
flex-direction: row;
width: 60vw;
border: 1px solid #000000;
`

const InfoDiv = styled.div `
width: 20vw;
height: 80vh;
align-self: flex-start;
border: 1px solid #000000;
margin-top: 5vh;
`

const GameCanvas = styled.canvas `
width: 30vw;
height: 80vh;
align-self: flex-start;
border: 1px solid #000000;
margin-left: 5vw;
margin-top: 5vh;
`

type GridProps = {
  c: HTMLCanvasElement;
  layout: boolean[][];
  width: number;
  height: number;
}

function App() {

  const [gridArr, setGridArr] = useState<boolean[][]>(new Array(20).fill([new Array(10).fill(false)]));

  return (
    <ContainerDiv>
      <UiDiv>
        <p>div1</p>
      </UiDiv>
      <GameDiv>
        <GameCanvas id="gameCanvas" />
        <script>
          var c = document.getElementById("myCanvas");
          var ctx = c.getContext("2d");
          ctx.rect(0,0,10,10);
          ctx.stroke();
        </script>

        <InfoDiv>

        </InfoDiv>
      </GameDiv>
    </ContainerDiv>
  )
}

export default App
