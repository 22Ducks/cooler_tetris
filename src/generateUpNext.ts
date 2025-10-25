import type { BlockDef } from "./blockControl"
import { shapeList } from "./constants"
import { defaultBlock } from "./Game";

export const generateUpNext = () => {
    const randomIndex = Math.floor(Math.random() * shapeList.length);

    const nextBlock: BlockDef = {
        shape: shapeList[randomIndex],
        rotation: defaultBlock.rotation,
        centerPoint: defaultBlock.centerPoint,
        placed: false
    }

    return nextBlock;
}