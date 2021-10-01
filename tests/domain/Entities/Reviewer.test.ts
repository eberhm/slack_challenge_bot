import 'jest';
import { GithubUser, InvalidUserNameError, Reviewer, Candidate } from '../../../src/domain/Entities/Reviewer';

describe('GithubUser', () => {
    it('Has a valid Username defined', () => {
        const VALID_USERNAME = 'valid.username';
        const githubUser = new GithubUser(VALID_USERNAME);
        expect(githubUser.getUsername()).toBe(VALID_USERNAME);
    });

    it('Throws exception if username is not valid', () => {
        const INVALID_USERNAME = 'invalid username';
        expect(() => new GithubUser(INVALID_USERNAME))
            .toThrowError(InvalidUserNameError);
    });
});

describe('Reviewer Entity', () => {
    it('Has a valid Username defined', () => {
        const VALID_USERNAME = 'valid.username';
        const githubUser = new GithubUser(VALID_USERNAME);
        const reviewer = new Reviewer(githubUser);
        
        expect(reviewer.getGithubUser().getUsername()).toBe(VALID_USERNAME);
    });
});

describe('Candidate Entity', () => {
    it('Has a valid Username defined', () => {
        const VALID_USERNAME = 'valid.username';
        const githubUser = new GithubUser(VALID_USERNAME);
        const candidate = new Candidate(githubUser);
        expect(candidate.getGithubUser().getUsername()).toBe(VALID_USERNAME);
    });
});