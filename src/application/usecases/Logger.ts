export interface UseCaseLogger {
    error(message: string): void;
    info(message: string): void;
    log(message: string): void;
}

/*
* To be used in automated tests
*/
export class VoidLogger implements UseCaseLogger {
    // eslint-disable-next-line
    error(message: string): void {}
    // eslint-disable-next-line
    info(message: string): void {}
    // eslint-disable-next-line
    log(message: string): void {}

}