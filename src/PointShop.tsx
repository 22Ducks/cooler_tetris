import styled from "styled-components"
import { shopContents, shopIEvent, shopLineClearEvent } from "./constants"

type ShopProps = {
    score: number,
    setScore: (score: number) => void
}

const ShopItem = styled.div `
display: flex;
`

const ItemName = styled.div `
width: 20%;
text-align: center;
`

const ItemEffect = styled.div `
width: 60%;
text-align: center;
`

const ItemCost = styled.div `
width: 20%;
text-align: center;
display: flex;
flex-direction: column;
`

export const PointShop = ({score, setScore}: ShopProps) => {

    const shopEventChart = {
        "Clear Line": shopLineClearEvent,
        "I-ify": shopIEvent
    }

    const itemBought = (item: string, cost: number, ) => {
        console.log("bought successfully");
        document.dispatchEvent(shopEventChart[item as keyof typeof shopEventChart]); //event not dispatching?
        setScore(score - cost);
    }

    const handleSpacebar = (event: React.KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === ' ') { // Check if the pressed key is the spacebar
            event.preventDefault(); // Prevent the default spacebar action (button activation)
        }
    }

    return (
    <>
    {shopContents.map((item, idx) =>
        <ShopItem key={idx}>
            <ItemName>
                <p>{item.name}</p>
            </ItemName>
            <ItemEffect>
                <p>{item.effect}</p>
            </ItemEffect>
            <ItemCost>
                <p>{item.cost}</p>
                <button disabled={(item.cost > score)} onKeyDown={handleSpacebar} onClick={() => itemBought(item.name, item.cost)}>BUY!</button>
            </ItemCost>
        </ShopItem>
    )}
    </>
    )
}