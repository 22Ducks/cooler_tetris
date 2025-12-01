import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { StartMenuModal } from "../StartMenuModal";

afterEach(cleanup);

describe("StartMenuModal", () => {
    it("renders when open", () => {
        const { getByTestId } = render(<StartMenuModal />);
        
        expect(getByTestId("menu")).not.toBeNull();
    });

    it("closes when button clicked", () => {
        const { getByTestId, rerender, queryByTestId } = render(<StartMenuModal />);

        fireEvent.click(getByTestId("startButton"));
        rerender(<StartMenuModal />);

        expect(queryByTestId("menu")).toBeNull();
    });
});