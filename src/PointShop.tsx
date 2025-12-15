import styled from "styled-components"
import { shopContents, shopIEvent, shopLineClearEvent, shopSlowmoEvent } from "./constants"
import { Button } from "@mui/material"
import { useEffect, useState } from "react"

type ShopProps = {
    score: number,
    setScore: (score: number) => void
}

const ShopItem = styled.div `
display: flex;
`

const ItemName = styled.div `
width: 15%;
text-align: center;
`

const ItemEffect = styled.div `
width: 60%;
text-align: center;
`

const ItemCost = styled.div `
width: 25%;
text-align: center;
align-items: center;
display: flex;
flex-direction: column;
`

const ShopText = styled.div `
margin-top: 5%;
`

export const PointShop = ({score, setScore}: ShopProps) => {
    
    const [shopCostMods, setShopCostMods] = useState(
        shopContents.reduce((acc, curr) => {
            acc = {
                ...acc,
                [curr.name]: 1
            }

            return acc;
        }, {})
    );

    useEffect(() => {
        const resetCostMods = () => {
            setShopCostMods(
                shopContents.reduce((acc, curr) => {
                    acc = {
                        ...acc,
                        [curr.name]: 1
                    }

                    return acc;
                }, {})
            );
        }

        document.addEventListener('resetUI', resetCostMods);

        return () => {
            document.removeEventListener('resetUI', resetCostMods);
        }
    }, []);

    const shopEventChart = {
        "Clear Line": shopLineClearEvent,
        "I-ify": shopIEvent,
        "Slowmo": shopSlowmoEvent
    }

    const itemBought = (item: string, cost: number, ) => {
        console.log("bought successfully");
        setShopCostMods((currentMods) => {
            const newMod = {
                ...currentMods,
                [item]: currentMods[item as keyof typeof currentMods] + 0.1
            }

            return newMod;
        });
        document.dispatchEvent(shopEventChart[item as keyof typeof shopEventChart]);
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
                <ShopText>{item.name}</ShopText>
            </ItemName>
            <ItemEffect>
                <ShopText>{item.effect}</ShopText>
            </ItemEffect>
            <ItemCost>
                <ShopText>{Math.floor(item.cost * shopCostMods[item.name as keyof typeof shopCostMods])}</ShopText>
                <Button variant="outlined" sx={{width: '20%'}} disabled={(item.cost > score)} onKeyDown={handleSpacebar} onClick={() => itemBought(item.name, item.cost)}>BUY!</Button>
            </ItemCost>
        </ShopItem>
    )}
    </>
    )
}