import 'jest';
import { Candidate } from '../../../src/domain/Entities/Candidate';
import { GithubUser } from '../../../src/domain/ValueObjects/GithubUser';

describe('Candidate Entity', () => {
    it('Has a valid Username defined', () => {
        const VALID_USERNAME = 'valid.username';
        const githubUser = new GithubUser(VALID_USERNAME);
        const candidate = new Candidate(githubUser);
        expect(candidate.getGithubUser().getUsername()).toBe(VALID_USERNAME);
    });
});