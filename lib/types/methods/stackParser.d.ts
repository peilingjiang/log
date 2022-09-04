export class StackParser {
    queue: any[];
    cache: any[];
    parsing: boolean;
    push(args: any, error: any, callback: any): void;
    parse(): void;
    parseStack(args: any, error: any, callback: any): void;
    _endParsing(processedStack: any, callback: any, cache?: boolean): void;
    continueParing(): void;
    _getActualFrame(frames: any, rawError: any): {
        line: any;
        char: any;
        method: any;
        file: any;
        path: any;
        raw: any;
    };
}
export const globalStackParser: StackParser;
