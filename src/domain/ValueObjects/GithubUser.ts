import { GithubUsername } from "./GithubUsername";

export class GithubUser {
    private githubUsername: GithubUsername;

    constructor(username: string) {
        this.githubUsername = new GithubUsername(username);
    }

    public getUsername(): string {
        return this.githubUsername.toString();
    }
}