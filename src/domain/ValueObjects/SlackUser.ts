export class SlackUser {
    private userId: string;

    constructor(id: string) {
      this.userId = id;
    }

    public getUserId(): string {
      return this.userId;
    }
}
