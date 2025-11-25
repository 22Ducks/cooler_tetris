import { describe, expect, expectTypeOf, it } from "vitest";
import { calcBlockMovement, quickDrop, type BlockDef } from "../blockControl";
import { defaultBlock } from "../Game";
import { Shape } from "../constants";

const testGrid = new Array(20).fill("").map(() => new Array(10).fill(""));

describe("calcBlockMovement", () => {

    it("returns an item of type BlockDef", () => {
        const returnBlock = calcBlockMovement("", testGrid, defaultBlock);

        expectTypeOf(returnBlock).toMatchObjectType<BlockDef>();
    });

    it("moves block right on ArrowRight event if not obstructed", () => {
        const testBlock = defaultBlock;

        testBlock.centerPoint = [0, 0]; //can move
        expect(calcBlockMovement("ArrowRight", testGrid, testBlock).centerPoint).toEqual([1, 0]);

        testBlock.centerPoint = [8, 0]; //blocked by wall
        expect(calcBlockMovement("ArrowRight", testGrid, testBlock).centerPoint).toEqual([8, 0]);

        testGrid[5][5] = "[x]";
        testBlock.centerPoint = [3, 5]; //blocked by placed item
        expect(calcBlockMovement("ArrowRight", testGrid, testBlock).centerPoint).toEqual([3, 5]);
    });

    it("moves block left on ArrowLeft event if not obstructed", () => {
        const testBlock = defaultBlock;

        testBlock.centerPoint = [5, 0]; //can move
        expect(calcBlockMovement("ArrowLeft", testGrid, testBlock).centerPoint).toEqual([4, 0]);

        testBlock.centerPoint = [1, 0]; //blocked by wall
        expect(calcBlockMovement("ArrowLeft", testGrid, testBlock).centerPoint).toEqual([1, 0]);

        testBlock.centerPoint = [6, 5]; //blocked by placed item
        expect(calcBlockMovement("ArrowLeft", testGrid, testBlock).centerPoint).toEqual([6, 5]);
    });

    it("rotates the block if possible", () => {
        const testBlock = defaultBlock;

        testBlock.centerPoint = [5, 3]; //unobstructed
        expect(calcBlockMovement("z", testGrid, testBlock).rotation).toEqual(3);

        expect(calcBlockMovement("x", testGrid, testBlock).rotation).toEqual(1);

        testBlock.centerPoint = [0, 3]; //partially obstructed
        testBlock.rotation = 1;

        expect(calcBlockMovement("z", testGrid, testBlock).rotation).toEqual(0);
        expect(calcBlockMovement("z", testGrid, testBlock).centerPoint).not.toEqual([0, 3]);

        expect(calcBlockMovement("x", testGrid, testBlock).rotation).toEqual(2);
        expect(calcBlockMovement("x", testGrid, testBlock).centerPoint).not.toEqual([0, 3]);

        const fullGrid = new Array(20).fill("[x]").map(() => new Array(10).fill("[x]")); //fully obstructed
        testBlock.centerPoint = [5, 5];
        testBlock.rotation = 0;
        
        expect(calcBlockMovement("z", fullGrid, testBlock).rotation).toEqual(0);
        expect(calcBlockMovement("z", fullGrid, testBlock).centerPoint).toEqual([5, 5]);

        expect(calcBlockMovement("x", fullGrid, testBlock).rotation).toEqual(0);
        expect(calcBlockMovement("x", fullGrid, testBlock).centerPoint).toEqual([5, 5]);

        testBlock.shape = Shape.O; //un-rotateable due to being O block
        expect(calcBlockMovement("z", testGrid, testBlock)).toEqual(testBlock);
        expect(calcBlockMovement("x", testGrid, testBlock)).toEqual(testBlock);
        
    });
});

describe("quickDrop", () => {
    it("returns an item of type BlockDef", () => {
        const testBlock = defaultBlock;

        const returnBlock = quickDrop(testGrid, testBlock);
        expectTypeOf(returnBlock).toMatchObjectType<BlockDef>();
    });

    it("sets placed to true for the block", () => {
        const testBlock = defaultBlock;

        const returnBlock = quickDrop(testGrid, testBlock);
        expect(returnBlock.placed).toEqual(true);
    });
});