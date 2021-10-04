import 'jest';
import { SlackUser } from '../../../src/domain/ValueObjects/SlackUser';

describe('SlackUser', () => {
    it('has a userID defined and can be requested', () => {
        const VALID_ID = 124635;
        const slackUser = new SlackUser(VALID_ID);
        expect(slackUser.getUserId()).toBe(VALID_ID);
    });
});
