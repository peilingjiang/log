import { HyperLog } from './hyperLog';
import './css/main.scss';
declare global {
    interface Window {
        log: (...args: any[]) => HyperLog;
        errorBoundary: (func: () => void) => void;
    }
}
