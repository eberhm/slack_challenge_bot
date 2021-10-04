import { Identifier } from "../Interfaces/Identifier";

export class Challenge {
    private id: Identifier;
    private githubRepositoryUrl: URL;

    constructor(id: Identifier, url: URL) {
        this.id = id;
        this.githubRepositoryUrl = url;
    }

    public getId() {
        return this.id.value;
    }

    public getUrl():URL {
        return this.githubRepositoryUrl;
    }
}
