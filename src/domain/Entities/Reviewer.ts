import { Identifier } from "../Interfaces/Identifier";
import { GithubUser } from "../ValueObjects/GithubUser";
import { SlackUser } from "../ValueObjects/SlackUser";

export class Reviewer {
    private id: Identifier;
    private githubUser: GithubUser;
    private slackUser: SlackUser;

    constructor(id: Identifier, githubUser: GithubUser, slackUser: SlackUser) {
        this.id = id;
        this.githubUser = githubUser;
        this.slackUser = slackUser;
    }

    public getId() {
        return this.id.value;
    }

    public getGithubUser(): GithubUser
    {
        return this.githubUser;
    }

    public getSlackUser(): SlackUser {
        return this.slackUser;
    }
};
