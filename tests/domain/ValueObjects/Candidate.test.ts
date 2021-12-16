import 'jest';
import { Candidate } from '../../../src/domain/ValueObjects/Candidate';
import { GithubUser } from '../../../src/domain/ValueObjects/GithubUser';

describe('Candidate Entity', () => {
    it('Has a valid state defined', () => {
        const VALID_USERNAME = 'valid.username';
        const ANY_URL = new URL('https://any.url.com');
        const candidate = Candidate.create(VALID_USERNAME, ANY_URL);

        expect(candidate.getGithubUser().getUsername()).toBe(VALID_USERNAME);
        expect(candidate.getResumeUrl()).toBe(ANY_URL);
    });
});