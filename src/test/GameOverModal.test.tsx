import { describe, expect, it, vi } from "vitest";
import { GameOverModal } from "../GameOverModal";
import { fireEvent, render } from "@testing-library/react";

describe("GameOverModal", () => {
    it("renders only when open", () => {
        const { queryByTestId, rerender } = render(<GameOverModal open={true} restart={vi.fn()} />);

        expect(queryByTestId("gameOver")).not.toBeNull();

        rerender(<GameOverModal open={false} restart={vi.fn()} />);
        expect(queryByTestId("gameOver")).toBeNull();
    });

    it("calls restart when button clicked", () => {
        const restartSpy = vi.fn();
        const { getByTestId } = render(<GameOverModal open={true} restart={restartSpy} />);

        fireEvent.click(getByTestId("playAgain"));
        expect(restartSpy).toHaveBeenCalledTimes(1);
    });
});