export class SlackUser {
    private userId: number;

    constructor(id: number) {
      this.userId = id;
    }

    public getUserId(): number {
      return this.userId;
    }
}
