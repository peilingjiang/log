import { HyperLog } from './hyperLog';
import './css/main.scss';
declare global {
    interface Window {
        log: (...args: any[]) => HyperLog;
        errorBoundary: (func: () => void) => void;
    }
}
export declare function log(...args: any[]): HyperLog;
export declare function errorBoundary(func: () => void): void;
