export class GithubUser {
    private githubUsername: GithubUsername;

    constructor(username: string) {
      this.githubUsername = new GithubUsername(username);
    }

    public getUsername(): string {
      return this.githubUsername.toString();
    }
}

export class InvalidUserNameError extends Error {}
class GithubUsername {
    private value: string;

    constructor(username: string) {
      this.validateUsername(username);
      this.value = username;
    }

    public toString(): string {
      return this.value;
    }

    private validateUsername(username: string): void {
      // TODO: implement this one correctly
      if (username == 'invalid username') {
        throw new InvalidUserNameError(`Invalid username: ${username}`);
      }
    }
}
