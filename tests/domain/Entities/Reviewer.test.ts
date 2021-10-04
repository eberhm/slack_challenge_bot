import 'jest';
import { Reviewer } from '../../../src/domain/Entities/Reviewer';
import { GithubUser } from '../../../src/domain/ValueObjects/GithubUser';

describe('Reviewer Entity', () => {
    it('Has a valid Username defined', () => {
        const VALID_USERNAME = 'valid.username';
        const githubUser = new GithubUser(VALID_USERNAME);
        const reviewer = new Reviewer(githubUser);
        
        expect(reviewer.getGithubUser().getUsername()).toBe(VALID_USERNAME);
    });
});
