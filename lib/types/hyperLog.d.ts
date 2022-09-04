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
    stackFrame: StackFrame | undefined;
}
interface SnapOptions {
    snap: boolean | undefined;
    snapElement: HTMLElement | undefined;
    snapAnchorSide: string | undefined;
    snapAnchorPercent: number | undefined;
}
export interface Timestamp {
    now: number;
}
export declare class HyperLog {
    private args;
    readonly timestamp: Timestamp;
    readonly rawError: Error;
    readonly requests: RequestOptions;
    constructor(args: any[], timestamp: Timestamp, error: Error);
    warn(): this;
    error(): this;
    e(element: HTMLElement | string): this;
    id(id: string): this;
    name(name?: string): this;
    color(color?: string): this;
    unit(unit?: string): this;
    history(history?: number): this;
    snap(options?: SnapOptions): this;
    snapTo(position?: 'x' | 'y' | 'top' | 'left' | 'right' | 'bottom', element?: HTMLElement | string | undefined): this;
    shape(shape?: boolean): this;
    stackFrame(frame: StackFrame): this;
}
export {};
