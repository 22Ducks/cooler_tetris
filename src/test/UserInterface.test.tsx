import { cleanup, render } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import * as Context from "../context";
import { UserInterface } from "../UserInterface";

describe("ComboDisplayDiv", () => {
    afterEach(cleanup);

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

    it("changes combo and time on publish, resets combo when timer runs out", () => {
        const { getByTestId, rerender } = render(<UserInterface paused={false}/>);

        vi.useFakeTimers();
        Context.lineClearBus.publish(1);

        vi.runOnlyPendingTimers();
        
        rerender(<UserInterface paused={false}/>);
        expect(getByTestId("comboText").textContent).toBe("1");
        expect(getByTestId("progress").ariaValueNow).toBe("100");

        vi.advanceTimersByTime(5000);

        rerender(<UserInterface paused={false}/>);
        expect(getByTestId("comboText").textContent).toBe('0');
        expect(getByTestId("progress").ariaValueNow).toBe('0');
        
    });
    
    it("should subscribe and unsubscribe to lineclearsubscription", () => {
        const unSubSpy = vi.fn();
        
        const mockLineClearContext = {
            subscribe: vi.fn().mockReturnValue(unSubSpy),
            publish: vi.fn()
        }

        vi.spyOn(Context, "useLineClearContext").mockReturnValue(mockLineClearContext);

        render(<UserInterface paused={false}/>);
        expect(mockLineClearContext.subscribe).toHaveBeenCalledTimes(1);
        expect(unSubSpy).not.toHaveBeenCalled();

        cleanup();

        expect(unSubSpy).toHaveBeenCalledTimes(1);
    });
});