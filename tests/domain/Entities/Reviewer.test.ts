import 'jest';
import { Reviewer } from '../../../src/domain/Entities/Reviewer';
import { GithubUser } from '../../../src/domain/ValueObjects/GithubUser';
import { InvalidUserNameError } from '../../../src/domain/ValueObjects/GithubUsername';



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
