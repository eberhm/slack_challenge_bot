import { generateUuid, Identifier } from '../ValueObjects/Identifier';

export class Challenge {
    private id: Identifier;

    private githubRepositoryUrl: URL;

    static create(url: URL) {
      const id = generateUuid('Challenge');
      return new this(id, url);
    }

    private constructor(id: Identifier, url: URL) {
      this.id = id;
      this.githubRepositoryUrl = url;
    }

    public getId() {
      return this.id;
    }

    public getUrl():URL {
      return this.githubRepositoryUrl;
    }
}
