import { describe, expect, it } from "vitest";
import { GameCanvas } from "../GameCanvas";
import { render } from "@testing-library/react";
import { defaultBlock } from "../Game";

//document = {} as any;

describe("GameCanvas", () => {
    it("renders", () => {
        const { getByTestId } = render(<GameCanvas gridArr={[]} blockData={defaultBlock} gameDimensions={[0, 0]} windowDimensions={[0, 0]}/>);
        expect(getByTestId("gamecanvas")).not.toBeNull();
    });
});