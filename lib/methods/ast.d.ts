export function preprocessASTsToGetRegistries(logGroups: any, logTimeline: any, newASTs: any, prevRegistries: any): {};
export function matchWebPathAndFilePath(webPath: any, filePath: any): boolean | undefined;
export function sumRegistries(registries: any): {};
export function getExpandLevels(files: any): {
    indentation: boolean;
    declarations: boolean;
    files: boolean;
};
export function getMaxExpandOffset(expandLevels: any): number;
export function hasLeastOneExpandLevel(expandLevels: any): any;
export function getTimelineOffsets(logGroups: any, registriesByFileName: any, budget: any, expandLevels: any): {
    offsets: {};
    indentationOffsets: {};
    declarationOffsets: {};
};
export function overallExtremeDepths(registriesByFileName: any): {
    max: number;
    min: number;
};
export function getExtremeDepthsByTopLevelDeclarations(fileRegistry: any, targetDeclaration: any, toDoDeclarations: any): {
    max: number;
    min: number;
};
export function _declarationExists(declarations: any, declarationName: any): boolean;
export function _getDeclarationFromAllDeclarations(declarations: any, declarationName: any): any;
export function getAllDeclarations(registriesByFileName: any, currentOffsets: any): {
    name: any;
    file: string;
    groupIds: string[];
}[];
export function _getDeclarationByGroupId(declarations: any, groupIdExtended: any): any;
export function getTopLevelDeclarationsCount(registriesByFileName: any): number;
