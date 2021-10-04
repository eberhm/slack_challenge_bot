import 'jest';
import { GithubUser, InvalidUserNameError } from '../../../src/domain/ValueObjects/GithubUser';



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
