import type { BlockDef } from "./blockControl"
import { defaultBlock } from "./App"
import { shapeList } from "./constants"

export const generateUpNext = () => {
    const randomIndex = Math.floor(Math.random() * shapeList.length);

    const nextBlock: BlockDef = {
        shape: shapeList[randomIndex],
        rotation: defaultBlock.rotation,
        centerPoint: defaultBlock.centerPoint
    }

    return nextBlock;
}