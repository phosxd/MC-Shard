import * as Perlin from './perlin';

/**Current seed.*/
let currentSeed: number;


export function Seed(x:number, y:number, seed:number): number {
    return (x*(seed+y)) + (y*(seed+x))
};


export const RandomNoise = {
    /**
     * mulberry32 based random noise.
    */
    get(x:number, y:number, seed:number) {
        return mulberry32(Seed(x, y, seed))();
    },
};


export const PerlinNoise = {
    get(x:number, y:number, seed:number, scale:number=1, smoothing:number=0) {
        if (currentSeed !== seed) {Perlin.seed(seed)};
        currentSeed = seed;
        return (Perlin.perlin2(x*scale, y*scale) + 1) / 2; // Rescale from "-1-1" to "0-1".
    },
};


export const PerlinNoise3d = {
    get(x:number, y:number, z:number, seed:number, scale:number=1, smoothing:number=0) {
        if (currentSeed !== seed) {Perlin.seed(seed)};
        currentSeed = seed;
        return (Perlin.perlin3(x*scale, y*scale, z*scale) + 1) / 2; // Rescale from "-1-1" to "0-1".
    },
};


export const SimplexNoise = {
    get(x:number, y:number, seed:number, scale:number=1) {
        if (currentSeed !== seed) {Perlin.seed(seed)};
        currentSeed = seed;
        return (Perlin.simplex2(x*scale, y*scale) + 1) / 2; // Rescale from "-1-1" to "0-1".
    },
};


export const SimplexNoise3d = {
    get(x:number, y:number, z:number, seed:number, scale:number=1) {
        if (currentSeed !== seed) {Perlin.seed(seed)};
        currentSeed = seed;
        return (Perlin.simplex3(x*scale, y*scale, z*scale) + 1) / 2; // Rescale from "-1-1" to "0-1".
    },
};




export function mulberry32(seed) {
    return function() {
        let t = (seed += 0x6D2B79F5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
};