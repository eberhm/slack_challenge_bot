import { GithubUser } from "../ValueObjects/GithubUser";

export class Candidate {
    private githubUser: GithubUser;

    constructor(githubUser: GithubUser) {
        this.githubUser = githubUser
    }

    public getGithubUser(): GithubUser
    {
        return this.githubUser;
    }
}

