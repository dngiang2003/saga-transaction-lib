import { ILogger } from '../interfaces/logger.interface';
export declare class DefaultLogger implements ILogger {
    log(message: string): void;
    error(message: string, error?: Error): void;
    warn(message: string): void;
    debug(message: string): void;
}
