import { GithubUser } from "./GithubUser";

export class Candidate {
    private githubUser: GithubUser;
    private resumeUrl: URL;

    constructor(githubUser: GithubUser, resumeUrl: URL) {
        this.githubUser = githubUser
        this.resumeUrl = resumeUrl;
    }

    public getGithubUser(): GithubUser
    {
        return this.githubUser;
    }

    public getResumeUrl(): URL
    {
        return this.resumeUrl;
    }
}

