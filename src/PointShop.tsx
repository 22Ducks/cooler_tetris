import styled from "styled-components"
import { shopContents, shopLineClearEvent } from "./constants"

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
        "Clear Line": shopLineClearEvent
    }

    const itemBought = (item: string, cost: number, ) => {
        console.log("bought successfully");
        document.dispatchEvent(shopEventChart[item as keyof typeof shopEventChart]); //event not dispatching?
        setScore(score - cost);
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
                <button disabled={(item.cost > score)} onClick={() => itemBought(item.name, item.cost)}>BUY!</button>
            </ItemCost>
        </ShopItem>
    )}
    </>
    )
}