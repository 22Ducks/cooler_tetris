import { describe, expect, it } from "vitest";
import { canFall } from "../canFall";
import { defaultBlock } from "../Game";

describe("canFall", () => {

    const testGrid = new Array(20).fill("").map(() => new Array(10).fill(""));

    it("returns true if block can move down", () => {
        const isValid = canFall(defaultBlock, testGrid);
        expect(isValid).toBe(true);
    });

    it("returns false if block can't move down", () => {
        testGrid[2][5] = "[x]";

        let isValid = canFall(defaultBlock, testGrid);
        expect(isValid).toBe(false);

        const bottomTestBlock = {
            ...defaultBlock,
            centerpoint: [19, 5] as [number, number]
        }

        isValid = canFall(bottomTestBlock, testGrid);
        expect(isValid).toBe(false);
    });
});