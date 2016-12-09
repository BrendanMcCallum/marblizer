///<reference path="operations.ts"/>
class Vortex implements Operation {
    // N in the paper
    readonly normal: Vec2;
    // L in the paper
    readonly line: Vec2;
    // A in the paper
    readonly origin: Vec2;
    readonly numTines: number;
    readonly interval: number;
    readonly alpha = 80.0;
    readonly lambda = 32;
    private static regex = RegExp("//^v(?:ortex)? " + vec2Regex + vec2Regex + floatRegex + floatRegex + "$/i");

    constructor(origin: Vec2, numTines: number, interval: number) {
        super();
        this.line = direction.norm();
        this.normal = this.line.perp().norm();
        this.origin = origin;
        this.numTines = numTines;
        this.interval = interval;
    }

    static fromString(str: string) {
        const match = LineTine.regex.exec(str);
        if (match != null && match.length > 0) {
            const origin = new Vec2(parseFloat(match[0]), parseFloat(match[1]));
            const direction = new Vec2(parseFloat(match[2]), parseFloat(match[3]));
            const numTines = parseFloat(match[4]);
            const interval = parseFloat(match[5]);
            return new Vortex(origin, direction, numTines, interval);
        }
    }

    apply(renderer: MarblingRenderer) {

        for (let d = 0; d < renderer.drops.length; d++) {
            let drop = renderer.drops[d];
            for (let p = 0; p < drop.points.length; p++) {
                const oldPoint = drop.points[p];
                const offset = this.atPoint(oldPoint);
                drop.points[p] = oldPoint.add(offset);
            }
            drop.makeDirty();
        }
    }

    atPoint(point: Vec2): Vec2 {
        const d = Math.abs(point.sub(this.origin).dot(this.normal));
        const factor = this.alpha * this.lambda / (d + this.lambda);
        return this.line.copy().scale(factor);
    }

}