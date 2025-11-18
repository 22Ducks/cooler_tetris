import { cleanup, render } from "@testing-library/react";
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import * as Context from "../context";
import { UserInterface } from "../UserInterface";

describe("ComboDisplayDiv", () => {
    beforeEach(cleanup);

    it("renders", () => {
        const { getByTestId } = render(<UserInterface paused={false}/>);
        expect(getByTestId("comboDisp")).not.toBeNull();
    });

    it("changes score in response to publish calls", () => {
        vi.useFakeTimers();

        const {getByTestId, rerender} = render(<UserInterface paused={false}/>);
        
        //positive increase in score
        Context.lineClearBus.publish(1);
        vi.runOnlyPendingTimers();

        rerender(<UserInterface paused={false}/>);
        expect(getByTestId("scoreDisp").textContent).toBe('100');

        //reset call
        Context.lineClearBus.publish(-1);
        vi.runOnlyPendingTimers();
        
        rerender(<UserInterface paused={false}/>);
        expect(getByTestId("scoreDisp").textContent).toBe('0');
    });
    
    it("should subscribe to lineclearsubscription", () => {
        const mockLineClearContext = {
            subscribe: vi.fn(),
            publish: vi.fn()
        }

        vi.spyOn(Context, "useLineClearContext").mockReturnValue(mockLineClearContext);

        render(<UserInterface paused={false}/>);

        expect(mockLineClearContext.subscribe).toHaveBeenCalledTimes(1);
    });
});