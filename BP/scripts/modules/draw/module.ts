import {Dimension, Player, Vector2, Vector3, MolangVariableMap, RGBA} from '@minecraft/server';
import {CardinalDirectionMap} from '../../Shard/CONST';
import {ShardModule} from '../../Shard/module';


/**Options for setting & animating particle opacity & size.
 * 
 * `alpha_fade_out` is currently glitchy & should not be used.
*/
export interface ParticleOptions {
    size_x?: number,
    size_y?: number,

    alpha_fade_in?: number,
    alpha_sustain?: number,
    alpha_fade_out?: number,

    size_x_fade_in?: number,
    size_x_sustain?: number,
    size_x_fade_out?:number,

    size_y_fade_in?: number,
    size_y_sustain?: number,
    size_y_fade_out?:number,
};


/**Renders a square at the location.
 * 
 * `lifetime` sets all sustain options in `particleOptions` if they are undefined.
*/
export function RenderSquare(location:Vector3, target:Dimension|Player, color:RGBA, facingDirection:'north'|'east'|'south'|'west'|'up'|'down', particleOptions?:ParticleOptions, lifetime:number=1):void {
    // Set default options.
    if (particleOptions == undefined) {particleOptions = {}};
    if (particleOptions.size_x == undefined) {particleOptions.size_x = 0.5};
    if (particleOptions.size_y == undefined) {particleOptions.size_y = 0.5};
    if (particleOptions.alpha_fade_in == undefined) {particleOptions.alpha_fade_in = 0};
    if (particleOptions.alpha_sustain == undefined) {particleOptions.alpha_sustain = lifetime};
    if (particleOptions.alpha_fade_out == undefined) {particleOptions.alpha_fade_out = 0};
    if (particleOptions.size_x_fade_in == undefined) {particleOptions.size_x_fade_in = 0};
    if (particleOptions.size_x_sustain == undefined) {particleOptions.size_x_sustain = lifetime};
    if (particleOptions.size_x_fade_out == undefined) {particleOptions.size_x_fade_out = 0};
    if (particleOptions.size_y_fade_in == undefined) {particleOptions.size_y_fade_in = 0};
    if (particleOptions.size_y_sustain == undefined) {particleOptions.size_y_sustain = lifetime};
    if (particleOptions.size_y_fade_out == undefined) {particleOptions.size_y_fade_out = 0};

    // Create molang map.
    const molang = new MolangVariableMap();
    molang.setColorRGBA('variable.color', color);
    molang.setSpeedAndDirection('variable.particle', 0, CardinalDirectionMap[facingDirection]);
    for (let key in particleOptions) {
        molang.setFloat(`variable.${key}`, particleOptions[key]);
    };

    // If not in unloaded chunk, spawn particle.
    if (target instanceof Dimension) {
        if (target.getBlock(location) == undefined) {return};
    }
    else {
        if (target.dimension.getBlock(location) == undefined) {return};
    };
    target.spawnParticle('shard:square', location, molang);
};


/**Renders a cube at the location.
 * 
 * `lifetime` sets all sustain options in `particleOptions` if they are undefined.
*/
export function RenderCuboid(location:Vector3, target:Dimension|Player, color:RGBA, size:Vector3={x:1,y:1,z:1}, particleOptions?:ParticleOptions, lifetime:number=1):void {
    // Iterate on each face.
    for (let direction in CardinalDirectionMap) {
        let particleSize:Vector2 = {x:size.x/2, y:size.y/2};
        let particleLocation:Vector3 = {x:0, y:0, z:0};
        // Logic for setting correct positions & sizes for each face.
        switch (direction) {
            case 'up': {
                particleLocation.y += size.y/2;
                particleSize.y = size.z/2;
                break;
            };
            case 'down': {
                particleLocation.y -= size.y/2;
                particleSize.y = size.z/2;
                break;
            };
            case 'north': {
                particleLocation.z += size.z/2;
                break;
            };
            case 'east': {
                particleLocation.x += size.x/2;
                particleSize.x = size.z/2;
                break;
            };
            case 'south': {
                particleLocation.z -= size.z/2;
                break;
            };
            case 'west': {
                particleLocation.x -= size.x/2;
                particleSize.x = size.z/2;
                break;
            };
        };

        particleOptions.size_x = particleSize.x;
        particleOptions.size_y = particleSize.y;

        // Spawn particle.
        RenderSquare({x:location.x+particleLocation.x, y:location.y+particleLocation.y, z:location.z+particleLocation.z}, target, color, direction as 'north'|'east'|'south'|'west'|'up'|'down', particleOptions, lifetime);
    };
};




// Instantiate Module.
export const Module = new ShardModule(
    {
        id: 'draw',
        displayName: {translate:'shard.draw.displayName'},
        brief: {translate:'shard.draw.brief'},
    },
    {
        childPaths: [
            'cmd/drawCuboid',
            'cmd/drawOptions',
        ],
    },
);
