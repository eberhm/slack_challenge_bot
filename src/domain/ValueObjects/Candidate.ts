import { GithubUser } from './GithubUser';

export class Candidate {
    private name: string;
    private githubUser: GithubUser;
    private resumeUrl: URL;

    static create(name: string, githubUsername: string, resumeUrl: URL) {
      return new this(name, new GithubUser(githubUsername), resumeUrl);
    }
    
    private constructor(name: string, githubUser: GithubUser, resumeUrl: URL) {
      this.name = name;
      this.githubUser = githubUser;
      this.resumeUrl = resumeUrl;
    }

    public getName(): string {
      return this.name;
    }

    public getGithubUser(): GithubUser {
      return this.githubUser;
    }

    public getResumeUrl(): URL {
      return this.resumeUrl;
    }
}
