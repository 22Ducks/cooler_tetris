import { describe, expect, it, vi } from "vitest";
import { ComboDisplayDiv } from "../ComboDisplayDiv";
import { render } from "@testing-library/react";

describe("ComboDisplayDiv", () => {
    it("renders", () => {
        const { getByTestId } = render(<ComboDisplayDiv combo={0} setCombo={vi.fn()} score={0} setScore={vi.fn()} />);
        expect(getByTestId("comboDisp")).not.toBeNull();
    });

    // ---TODO---
    // check if subscribes
    // spy on comboUp to see if it runs when linescleared changes
    // spy on setCombo and setScore
    // check if it updates when combo or score changes
});