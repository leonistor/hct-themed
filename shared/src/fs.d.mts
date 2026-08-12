export function pathExists(p: string): Promise<boolean>;
export function ensureDir(dir: string): Promise<void>;
export function atomicWrite(filePath: string, data: string): Promise<void>;
