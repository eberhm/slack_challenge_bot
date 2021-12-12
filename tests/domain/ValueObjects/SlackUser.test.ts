import 'jest';
import { SlackUser } from '../../../src/domain/ValueObjects/SlackUser';

describe('SlackUser', () => {
    it('has a userID defined and can be requested', () => {
        const VALID_ID = 'valid_slack_id';
        const slackUser = new SlackUser(VALID_ID);
        expect(slackUser.getUserId()).toBe(VALID_ID);
    });
});
