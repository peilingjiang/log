import { HyperLog } from './hyperLog';
import { GlobalSettings } from './global';
import './rendering';
import './css/main.scss';
declare function log(...args: any[]): HyperLog;
declare function setLog(options: GlobalSettings): void;
declare function errorBoundary(func: () => void, element?: HTMLElement | string): void;
export default log;
export { setLog, errorBoundary };
