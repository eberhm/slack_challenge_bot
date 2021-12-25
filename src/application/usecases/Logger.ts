export interface UseCaseLogger {
    error(message: string): void;
    info(message: string): void;
    log(message: string): void;
}

export class VoidLogger implements UseCaseLogger {
    error(message: string): void {}
    info(message: string): void {}
    log(message: string): void {}

}