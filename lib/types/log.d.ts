import { HyperLog } from './hyperLog';
declare class LogProcessor {
    private queue;
    private processFunction;
    constructor();
    add(hyperLog: HyperLog): void;
    process(): void;
    setProcessFunction(processingFunction: (hyperLog: HyperLog) => void): void;
}
export declare const logProcessor: LogProcessor;
export {};
