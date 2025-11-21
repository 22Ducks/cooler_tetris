import { describe, expect, it } from "vitest";
import { defaultBlock } from "../Game";
import { innerOffsets } from "../innerOffsets";
import { Shape, shapeChart } from "../constants";

describe("innerOffsets", () => {
    it("returns the positions of the inputted shape's edges", () => {
        const testShape = defaultBlock;

        expect(innerOffsets(shapeChart[testShape.shape][testShape.rotation])).toEqual([-1, 2]);

        testShape.shape = Shape.O;
        expect(innerOffsets(shapeChart[testShape.shape][testShape.rotation])).toEqual([-1, 1]);

        testShape.shape = Shape.I;
        expect(innerOffsets(shapeChart[testShape.shape][testShape.rotation])).toEqual([-1, 0]);

        testShape.rotation = 1;
        expect(innerOffsets(shapeChart[testShape.shape][testShape.rotation])).toEqual([-2, 2]);
    });
});