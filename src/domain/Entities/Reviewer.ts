import { GithubUser } from "../ValueObjects/GithubUser";
import { SlackUser } from "../ValueObjects/SlackUser";

export class Reviewer {
    private githubUser: GithubUser;
    private slackUser: SlackUser;

    constructor(githubUser: GithubUser, slackUser: SlackUser) {
        this.githubUser = githubUser
        this.slackUser = slackUser;
    }

    public getGithubUser(): GithubUser
    {
        return this.githubUser;
    }

    public getSlackUser(): SlackUser {
        return this.slackUser;
    }
};
