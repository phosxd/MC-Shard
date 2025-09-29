export const ValueNoise = {
    /**
     * @param seed The offset to apply to `x` & `y`.
    */
    get(x:number, y:number, seed:number) {
        const seededX = x+seed;
        const seededY = y+seed;
        return (
            (Math.sin(x+y) * Math.cos(x-y))
        );
    },
};