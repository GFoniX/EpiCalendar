export function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export function toJSON(value: any): any {
    try {
        return JSON.parse(value);
    } catch (e) {
        return value;
    }
}