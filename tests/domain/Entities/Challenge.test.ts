import 'jest';
import { Challenge, CandidateChallenge, EmptyReviewersSet } from '../../../src/domain/Entities/Challenge';
import { Reviewer, GithubUser, Candidate } from '../../../src/domain/Entities/Reviewer';




describe('Chanllenge Entity works as expected', () => {
    it('Has a valid URL defined', () => {
        const ANY_URL = new URL('https://anything.com');
        const challenge = new Challenge(ANY_URL);
        expect(challenge.getUrl()).toBe(ANY_URL);
    });
});

describe('CandidateChanllenge Entity', () => {
    it('Can be created having a valid state', () => {
        const ANY_URL = new URL('https://anything.com');
        const reviewers: Array<Reviewer> = [
            new Reviewer(new GithubUser('valid.username1')),
            new Reviewer(new GithubUser('valid.username2'))
        ];

        const challenge = new CandidateChallenge(
            ANY_URL,
            new Candidate(new GithubUser('anothervalid.user')),    
            reviewers
            );
        expect(challenge.getUrl()).toBe(ANY_URL);
    });

    it('Cannot be created having an empty reviewers state', () => {
        const ANY_URL = new URL('https://anything.com');
        const reviewers: Array<Reviewer> = [];
        expect(() => {
            const challenge = new CandidateChallenge(
                ANY_URL,
                new Candidate(new GithubUser('anothervalid.user')),    
                reviewers
                );
        }).toThrowError(EmptyReviewersSet);
    });
});