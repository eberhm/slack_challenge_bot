import 'jest';
import { Candidate } from '../../../src/domain/ValueObjects/Candidate';

describe('Candidate Entity', () => {
    it('Has a valid state defined', () => {
        const ANY_NAME = 'My Name';
        const VALID_USERNAME = 'valid.username';
        const ANY_URL = new URL('https://any.url.com');
        const candidate = Candidate.create(ANY_NAME, VALID_USERNAME, ANY_URL);

        expect(candidate.getGithubUser().getUsername()).toBe(VALID_USERNAME);
        expect(candidate.getResumeUrl()).toBe(ANY_URL);
        expect(candidate.getName()).toBe(ANY_NAME);
    });
});