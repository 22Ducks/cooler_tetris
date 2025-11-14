import { createContext } from "react";
import { createLineClearSubscription } from "./eventSubscription";

type PauseContextType = {
  paused: boolean;
  setPaused: (paused: boolean) => void;
}

const defaultPausedVal: PauseContextType = {
  paused: true,
  setPaused: () => {}
}

export const lineClearBus = createLineClearSubscription();

export const PauseContext = createContext<PauseContextType>(defaultPausedVal);

export const LineClearContext = createContext(lineClearBus);