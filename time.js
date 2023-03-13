const timers = new Map();

export function startTimer(label) {
    timers.set(label, Date.now());
}

export function endTimer(label) {
    const start = timers.get(label);
    if (start) {
        const duration = Date.now() - start;
        // https://ansi.gabebanks.net/
        console.log(
            `\x1b[32mSegment \x1b[33m${label}\x1b[32m took \x1b[33m${duration}\x1b[32m ms\x1b[0m`
        );
    }
}
