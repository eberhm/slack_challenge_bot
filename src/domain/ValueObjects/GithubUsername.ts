export class GithubUsername {
    private value: string;
    constructor(username: string) {
        this.validateUsername(username);
        this.value = username;
    }

    public toString(): string {
        return this.value;
    }

    private validateUsername(username: string): void {
        //TODO: implement this one correctly
        if (username == 'invalid username') {
            throw new InvalidUserNameError(`Invalid username: ${username}`);
        }
    }
};

export class InvalidUserNameError extends Error {};
