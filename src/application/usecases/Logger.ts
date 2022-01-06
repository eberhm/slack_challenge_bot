export interface UseCaseLogger {
    error(message: string): void;
    info(message: string): void;
    log(message: string): void;
}

/*
* To be used in automated tests
*/
export class VoidLogger implements UseCaseLogger {
    error(message: string): void {}
    info(message: string): void {}
    log(message: string): void {}

}