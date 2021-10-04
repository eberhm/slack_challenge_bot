import 'jest';
import { Reviewer } from '../../../src/domain/Entities/Reviewer';
import { GithubUser } from '../../../src/domain/ValueObjects/GithubUser';
import { SlackUser } from '../../../src/domain/ValueObjects/SlackUser';

describe('Reviewer Entity', () => {
    it('Has a valid GH Username and Slack User defined', () => {
        const VALID_GH_USERNAME = 'valid.username';
        const VALID_SLACK_USERID = 124783;
        const githubUser = new GithubUser(VALID_GH_USERNAME);
        const slackUser = new SlackUser(VALID_SLACK_USERID);
        const reviewer = new Reviewer(githubUser, slackUser);
        
        expect(reviewer.getGithubUser().getUsername()).toBe(VALID_GH_USERNAME);
        expect(reviewer.getSlackUser().getUserId()).toBe(VALID_SLACK_USERID);
    });
});
