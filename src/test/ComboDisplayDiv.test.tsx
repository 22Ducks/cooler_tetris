import { afterEach, describe, expect, it, vi } from "vitest";
import { ComboDisplayDiv } from "../ComboDisplayDiv";
import { cleanup, render } from "@testing-library/react";

afterEach(cleanup);

describe("ComboDisplayDiv", () => {
    it("renders", () => {
        const { getByTestId } = render(<ComboDisplayDiv combo={0} comboTimer={0}/>);
        expect(getByTestId("comboDisp")).not.toBeNull();
    });

    it("displays the correct combo and time", () => {
        const { getByTestId, rerender } = render(<ComboDisplayDiv combo={0} comboTimer={0}/>);
        expect(getByTestId("comboText").textContent).toBe("0");
        expect(getByTestId("progress").ariaValueNow).toBe('0');

        rerender(<ComboDisplayDiv combo={22} comboTimer={10}/>);
        expect(getByTestId("comboText").textContent).toBe("22");
        expect(getByTestId("progress").ariaValueNow).toBe('10');
    });

});