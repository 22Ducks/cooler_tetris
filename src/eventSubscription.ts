type LineClearCallback = (linesCleared: number) => void;

export const createLineClearSubscription = () => {
    let callbacks: LineClearCallback[] = [];

    const subscribe = (callback: LineClearCallback) => {
        callbacks.push(callback);

        return () => {
            callbacks = callbacks.filter(fn => fn !== callback);
        };
    }

    const publish = (linesCleared: number) => {
        callbacks.forEach(callback => callback(linesCleared));
    }

    return {subscribe, publish};
}