export class Challenge {
    private githubRepositoryUrl: URL;

    constructor(url: URL) {
        this.githubRepositoryUrl = url;
    }

    public getUrl():URL {
        return this.githubRepositoryUrl;
    }
}
