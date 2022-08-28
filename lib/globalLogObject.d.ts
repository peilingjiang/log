interface RequestOptions {
    level: string | undefined;
    element: HTMLElement | undefined;
    id: string | undefined;
    name: string | undefined;
    color: string | undefined;
    unit: string | undefined;
    history: number | undefined;
    snap: SnapOptions | undefined;
    format: string | undefined;
}
interface SnapOptions {
    snap: boolean | undefined;
    snapElement: HTMLElement | undefined;
    snapAnchorSide: string | undefined;
    snapAnchorPercent: number | undefined;
}
export declare class HyperLog {
    private args;
    private requests;
    constructor(args: any[], addLogFunction: (requests: RequestOptions) => void);
    level(level?: string): this;
    e(element: HTMLElement | string): this;
    id(id: string): this;
    name(name?: string): this;
    color(color?: string): this;
    unit(unit?: string): this;
    history(history?: number): this;
    snap(options?: SnapOptions): this;
    shape(shape?: boolean): this;
}
export {};
