export declare const development: boolean;
export interface GlobalSettings {
    preserveConsole: boolean | undefined;
    useSourceMaps: boolean | undefined;
    directionDown: boolean | undefined;
    defaultOrganization: string | undefined;
    logHistoryLength: number | undefined;
    vsLogPort: number | undefined;
}
export declare const g: GlobalSettings;
export declare const socket: any;
