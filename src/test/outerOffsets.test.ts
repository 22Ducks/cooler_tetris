import { describe, expect, it } from "vitest";
import { defaultBlock } from "../Game";
import { outerOffsets } from "../outerOffsets";
import { Shape, shapeChart } from "../constants";

describe("outerOffsets", () => {
    it("returns the top and left edges of the shape arrays", () => {
        const testShape = defaultBlock;

        const expectedValue = {
            offsetTop: -1,
            offsetLeft: -1
        }
        
        expect(outerOffsets(shapeChart[testShape.shape][testShape.rotation])).toEqual(expectedValue);

        testShape.shape = Shape.O;
        expectedValue.offsetTop = -2;
        expectedValue.offsetLeft = -2;
        expect(outerOffsets(shapeChart[testShape.shape][testShape.rotation])).toEqual(expectedValue);

    });
});