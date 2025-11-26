import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { defaultBlock, Game } from "../Game";
import * as Context from "../context";
import { GameCanvas } from "../GameCanvas";
import * as GenerateUpNext from "../generateUpNext";

vi.mock("../GameCanvas", () => ({
    GameCanvas: vi.fn()
}));

vi.mock("../generateUpNext", () => ({
    generateUpNext: vi.fn()
}));

vi.mocked(GenerateUpNext.generateUpNext).mockReturnValue(defaultBlock);

describe("Game", () => {
    it("renders", () => {
        const { getByTestId } = render(<Game gameDimensions={[0, 0]} windowDimensions={[0, 0]}/>);
        expect(getByTestId("game")).not.toBeNull();
    });

    it("moves block down on interval when unpaused", () => {
        
        const mockPauseContext = {
            paused: true,
            setPaused: vi.fn()
        }

        vi.spyOn(Context, "usePauseContext").mockReturnValue(mockPauseContext);

        render(<Game gameDimensions={[0,0]} windowDimensions={[0,0]}/>);

        expect(GameCanvas).toHaveBeenCalledWith(
            expect.objectContaining({
                blockData: expect.objectContaining({shape: "T"})
            })
        );
    });
});