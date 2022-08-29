import { HyperLog } from './hyperLog';
import './rendering';
import './css/main.scss';
interface LogFunc {
    (...args: any[]): HyperLog;
}
export declare const log: LogFunc;
export {};
