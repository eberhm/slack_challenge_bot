import 'jest';
import { Reviewer } from '../../../src/domain/Entities/Reviewer';
import { GithubUser } from '../../../src/domain/ValueObjects/GithubUser';
import { SlackUser } from '../../../src/domain/ValueObjects/SlackUser';

describe('Reviewer Entity', () => {
    it('Has a valid GH Username and Slack User defined', () => {
        const VALID_GH_USERNAME = 'valid.username';
        const VALID_SLACK_USERID = 'valid_slack_id';
        const githubUser = new GithubUser(VALID_GH_USERNAME);
        const slackUser = new SlackUser(VALID_SLACK_USERID);
        const reviewer = Reviewer.create(githubUser, slackUser);
        
        expect(reviewer.getId()).not.toBe(null);
        expect(reviewer.getGithubUser().getUsername()).toBe(VALID_GH_USERNAME);
        expect(reviewer.getSlackUser().getUserId()).toBe(VALID_SLACK_USERID);
    });
});
