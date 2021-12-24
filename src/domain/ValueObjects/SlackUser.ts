export type SlackId = string;
export class SlackUser {
    private userId: SlackId;

    constructor(id: string) {
      this.userId = id;
    }

    public getUserId(): SlackId {
      return this.userId;
    }
}
