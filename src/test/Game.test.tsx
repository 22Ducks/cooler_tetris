import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { defaultBlock, Game } from "../Game";
import * as Context from "../context";
import * as Constants from "../constants"
import { GameCanvas } from "../GameCanvas";
import * as GenerateUpNext from "../generateUpNext";
import { defaultGridArr } from "../constants";

vi.mock("../GameCanvas", () => ({
    GameCanvas: vi.fn()
}));

vi.mock("../generateUpNext", () => ({
    generateUpNext: vi.fn()
}));

vi.mocked(GenerateUpNext.generateUpNext).mockReturnValue(defaultBlock);

afterEach(() => {
    vi.clearAllMocks();
    cleanup();
});

const mockPauseContext = {
    paused: false,
    setPaused: vi.fn()
}

describe("Game", () => {
    it("renders", () => {
        const { getByTestId } = render(<Game gameDimensions={[0, 0]} windowDimensions={[0, 0]}/>);
        expect(getByTestId("game")).not.toBeNull();
    });

    it("moves block down on interval when unpaused", () => {
        vi.useFakeTimers();
        
        vi.spyOn(Context, "usePauseContext").mockReturnValue(mockPauseContext);

        const { rerender } = render(<Game gameDimensions={[0,0]} windowDimensions={[0,0]}/>);

        vi.advanceTimersByTime(1000);

        rerender(<Game gameDimensions={[0,0]} windowDimensions={[0,0]}/>);

        expect(GameCanvas).toHaveBeenCalledWith(
            expect.objectContaining({
                blockData: expect.objectContaining({centerPoint: [5, 2]})
            }), undefined
        );

        vi.advanceTimersByTime(1000);

        rerender(<Game gameDimensions={[0,0]} windowDimensions={[0,0]}/>);

        expect(GameCanvas).toHaveBeenCalledWith(
            expect.objectContaining({
                blockData: expect.objectContaining({centerPoint: [5, 3]})
            }), undefined
        );
    });

    it("lowers block faster when down arrow held", async () => {
        vi.useFakeTimers();

        vi.spyOn(Context, "usePauseContext").mockReturnValue(mockPauseContext);

        const { rerender } = render(<Game gameDimensions={[0,0]} windowDimensions={[0,0]}/>);

        fireEvent.keyDown(document, {key: 'ArrowDown', code: 'ArrowDown'});

        vi.advanceTimersByTime(100);

        rerender(<Game gameDimensions={[0,0]} windowDimensions={[0,0]}/>);
        
        expect(GameCanvas).toHaveBeenCalledWith(
            expect.objectContaining({
                blockData: expect.objectContaining({centerPoint: [5, 2]})
            }), undefined
        );

        //release arrow
        fireEvent.keyUp(document, {key: 'ArrowDown', code: 'ArrowDown'});

        vi.advanceTimersByTime(100);

        //assuming timer intervals changed back as intended, it will not have moved down again
        expect(GameCanvas).not.toHaveBeenCalledWith(
            expect.objectContaining({
                blockData: expect.objectContaining({centerPoint: [5, 3]})
            }), undefined
        );
    });

    it("adds placed blocks into gridArr", () => {
        vi.useFakeTimers();

        vi.spyOn(Context, "usePauseContext").mockReturnValue(mockPauseContext);

        const { rerender } = render(<Game gameDimensions={[0,0]} windowDimensions={[0,0]}/>);

        fireEvent.keyDown(document, {key: " ", code: "Space"});

        vi.advanceTimersToNextTimer();
        
        rerender(<Game gameDimensions={[0,0]} windowDimensions={[0,0]}/>);

        expect(GameCanvas).toHaveBeenCalledWith(
            expect.objectContaining({
                blockData: expect.objectContaining({placed: true})
            }), undefined
        );

        vi.clearAllMocks();
        vi.advanceTimersToNextTimer();

        rerender(<Game gameDimensions={[0,0]} windowDimensions={[0,0]}/>);
        
        //gridArr should no longer be empty

        expect(GameCanvas).not.toHaveBeenCalledWith(
            expect.objectContaining({
                gridArr: structuredClone(defaultGridArr)
            }), undefined
        );
    });

    it("clears lines that are full", () => {
        vi.useFakeTimers();

        vi.spyOn(Context, "usePauseContext").mockReturnValue(mockPauseContext);

        const mockDefaultGridArr = structuredClone(defaultGridArr);
        for(let i=0; i<10; i++) {
            if(i < 4 || i > 6) {
                mockDefaultGridArr[19][i] = "[x]";
            }
        }

        //replace blank grid arr with one that will lineclear once defaultBlock is placed
        vi.spyOn(Constants, 'defaultGridArr', 'get').mockReturnValue(mockDefaultGridArr);

        const { rerender } = render(<Game gameDimensions={[0,0]} windowDimensions={[0,0]}/>);
        fireEvent.keyDown(document, {key: " ", code: "Space"});

        vi.advanceTimersToNextTimer(); //advance past "placed" state and new block generation
        vi.advanceTimersToNextTimer();

        vi.clearAllMocks();

        rerender(<Game gameDimensions={[0,0]} windowDimensions={[0,0]}/>);

        //cant use defaultGridArr for blank grid due to mock
        const testGridArr = new Array(20).fill("").map(() => new Array(10).fill(""));
        testGridArr[19][5] = "[x]";

        expect(GameCanvas).toHaveBeenCalledWith(
            expect.objectContaining({
                gridArr: testGridArr
            }), undefined
        );
    });

    it("triggers a game over if new block can't be placed", () => {
        vi.useFakeTimers();

        vi.spyOn(Context, "usePauseContext").mockReturnValue(mockPauseContext);

        const mockDefaultGridArr = new Array(20).fill("").map(() => new Array(10).fill("[x]"));

        vi.spyOn(Constants, 'defaultGridArr', 'get').mockReturnValue(mockDefaultGridArr);

        const { rerender, getByTestId } = render(<Game gameDimensions={[0,0]} windowDimensions={[0,0]}/>);

        fireEvent.keyDown(document, {key: " ", code: "Space"});

        vi.advanceTimersToNextTimer(); //advance past "placed" state and new block generation
        vi.advanceTimersToNextTimer();

        rerender(<Game gameDimensions={[0,0]} windowDimensions={[0,0]}/>);

        expect(getByTestId("gameOver")).not.toBeNull();
    });
});