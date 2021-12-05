export class GithubCodeChallenge {
    private url: URL;

    constructor(url: URL) {
        this.url = url;
    }

    public getUrl(): URL {
        return this.url;
    }
}

