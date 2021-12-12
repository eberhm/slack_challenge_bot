import { generateUuid, Identifier } from '../ValueObjects/Identifier';

export class Challenge {
    private id: Identifier;
    private name: string;
    private githubRepositoryUrl: URL;

    static create(name:string, url: URL) {
      const id = generateUuid('Challenge');
      return new this(id, name, url);
    }

    static createEmpty() {
      return new this("", "", new URL(""));
    }

    private constructor(id: Identifier, name: string, url: URL) {
      this.id = id;
      this.name = name;
      this.githubRepositoryUrl = url;
    }

    public getId() {
      return this.id;
    }


    public getName() {
      return this.name;
    }

    public getUrl():URL {
      return this.githubRepositoryUrl;
    }
}
