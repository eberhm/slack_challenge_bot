import { generateUuid, Identifier } from '../ValueObjects/Identifier';
import { GithubUser } from '../ValueObjects/GithubUser';
import { SlackUser } from '../ValueObjects/SlackUser';

export class Reviewer {
    private id: Identifier;

    private githubUser: GithubUser;

    private slackUser: SlackUser;

    static create(githubUser: GithubUser, slackUser: SlackUser) {
      const id = generateUuid('Reviewer');
      return new this(id, githubUser, slackUser);
    }

    private constructor(id: Identifier, githubUser: GithubUser, slackUser: SlackUser) {
      this.id = id;
      this.githubUser = githubUser;
      this.slackUser = slackUser;
    }

    public getId() {
      return this.id;
    }

    public getGithubUser(): GithubUser {
      return this.githubUser;
    }

    public getSlackUser(): SlackUser {
      return this.slackUser;
    }
}
