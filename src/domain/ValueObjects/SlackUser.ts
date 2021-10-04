export class SlackUser {
    private userId: Number;

    constructor(id: Number) {
        this.userId = id;
    }

    public getUserId(): Number {
        return this.userId;
    }
}

